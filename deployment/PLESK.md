# Развёртывание на Plesk (host.md)

Процедура первичной установки бэкенда на субдомен `new.scm4.md` и того, что
приходится повторять при обновлениях.

Файл лежит рядом с `nginx-plesk.conf` по той же причине, что и он: панель Plesk
ничего не версионирует, и при переезде на основной домен восстанавливать
настройку пришлось бы по памяти.

## Как устроен деплой

Клиент собирается в GitHub Actions (`.github/workflows/deploy.yml`), а не на
сервере — `node_modules` весит около 300 МБ при квоте 2 ГБ на весь аккаунт.
Результат складывается в ветку `deploy`, её и тянет Plesk.

Document root субдомена смотрит в `new.scm4.md/server/public`, где рядом лежат
`index.html` собранного React и `index.php` Laravel. Кому какой запрос
достаётся — разводится в `nginx-plesk.conf`.

**В ветке `deploy` нет и не будет трёх вещей:** `server/.env`, `server/vendor/`
и симлинка `server/public/storage`. Первое — секреты, второе и третье — в
`.gitignore`. Всё три создаются на сервере руками один раз.

## Первичная установка

### 1. nginx-директивы

Websites & Domains → new.scm4.md → Apache & nginx Settings → поле
«Additional nginx directives» → вставить содержимое `nginx-plesk.conf` → Apply.

PHP должен работать в режиме **FPM application served by nginx**. В этом режиме
Apache в обработке запросов не участвует и `.htaccess` не читается вовсе,
поэтому вся маршрутизация задаётся именно здесь.

### 2. База данных

Websites & Domains → Databases → Add Database. Имя, пользователь, пароль.

Поле **Related site** — только группировка в интерфейсе Plesk, на доступность
оно не влияет: PHP подключается к MySQL по логину и паролю, а не «через домен».
База, привязанная к `scm4.md`, работает с `new.scm4.md` ровно так же.

На той же странице посмотреть **хост сервера БД**. Если это не `localhost` —
MySQL на host.md бывает вынесен отдельно — подставить его в `DB_HOST` вместо
`127.0.0.1` из шаблона.

### 3. `server/.env`

`APP_KEY` генерируется локально и вставляется целиком, вместе с префиксом
`base64:`:

```bash
php artisan key:generate --show
```

Дальше на сервере:

```bash
cd ~/new.scm4.md/server
cp .env.production.example .env
nano .env    # APP_KEY, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST
```

### 4. Зависимости, миграции, права

**Внимание: `php` в командной строке — не тот PHP, что у сайта.** Планировщик и
SSH на CloudLinux запускают системный 7.2, и `vendor/composer/platform_check.php`
честно падает с `requires a PHP version ">= 8.3.0"`. Везде нужен полный путь к
плесковскому бинарнику — у `alt-php` из PHP Selector нет `pdo_mysql`:

    /opt/plesk/php/8.4/bin/php

Проверить, что установлено и с какими расширениями:

```bash
for P in /opt/alt/php84/usr/bin/php /opt/plesk/php/8.4/bin/php; do
  echo "== $P"; $P -v 2>&1 | head -1
  $P -m 2>/dev/null | grep -Ex 'pdo_mysql|mbstring|openssl|fileinfo|gd|intl' | tr '\n' ' '; echo
done
```

```bash
cd ~/new.scm4.md/server

composer install --no-dev --optimize-autoloader
# если composer не в PATH — в репозитории лежит свой:
# php composer.phar install --no-dev --optimize-autoloader

php artisan optimize:clear    # снять кеш конфига, снятый до заполнения .env
php artisan migrate --force   # --force обязателен: APP_ENV=production
php artisan storage:link      # иначе картинки из админки не отдаются

chmod -R ug+rw storage bootstrap/cache
```

Порядок важен: `optimize:clear` до `migrate`, иначе миграции пойдут со старыми
доступами из `bootstrap/cache/config.php`.

### 5. Пользователь админки

```bash
php artisan make:filament-user
```

Команда спросит имя, e-mail и пароль. Если shell недоступен и команда
запускается через Plesk → Scheduled Tasks → Run a command, интерактивный ввод не
сработает — передать значения флагами:

```bash
php artisan make:filament-user --name="Admin" --email="..." --password="..."
```

**После создания обязательно проставить роль.** `canAccessPanel()` в
`app/Models/User.php` требует `role === 'admin'`, а колонка `role` в миграции
создана с `default('client')` — про неё `make:filament-user` ничего не знает.
Пароль такой пользователь пройдёт, а на панель его не пустят:

```bash
php artisan tinker --execute='$u = App\Models\User::where("email","<e-mail>")->firstOrFail(); $u->role = "admin"; $u->save(); echo $u->role;'
```

Этой же командой меняется и пароль (`$u->password = "..."`) — каст
`'password' => 'hashed'` в модели захеширует его сам. С Filament 4.11.2 у панели
включён `->profile()`, так что после первого входа пароль меняется уже из
интерфейса, в меню пользователя справа сверху.

**Не запускать `db:seed`:** сидер в `database/seeders/DatabaseSeeder.php` создаёт
фабричного `test@example.com` со случайным паролем, войти под ним нельзя.

### 6. Проверка

| Адрес | Ожидаемый ответ |
| --- | --- |
| `https://new.scm4.md/ru` | Главная страница сайта |
| `https://new.scm4.md/up` | Страница health-check Laravel |
| `https://new.scm4.md/api/partners` | `[]` или JSON-массив |
| `https://new.scm4.md/admin` | Форма входа Filament |

Пустой `[]` — это успех, а не ошибка: таблица просто ещё не наполнена.

## Диагностика

**`/ru` открывается, а `/api/*` отдаёт 500.** Первое вообще не доходит до PHP:
по последнему `location` в `nginx-plesk.conf` любой неизвестный путь отдаётся
как `index.html`, и статика продолжила бы работать при полностью мёртвом
Laravel. Ответ 500, а не 404 и не HTML главной страницы, означает, что
nginx-директивы применены верно и PHP-FPM запускается, — ломается само
приложение. Смотреть только в `server/`.

**Текст ошибки.** В бою стоит `APP_DEBUG=false` и `LOG_LEVEL=error`, поэтому
браузер показывает пустой 500, а стектрейс лежит в логе:

```bash
tail -n 50 ~/new.scm4.md/server/storage/logs/laravel.log
```

Если файла нет вообще — нет прав на запись в `storage/` либо нет `vendor/`.

**Частые причины 500 по убыванию вероятности:**

1. Нет `server/.env` или в нём неверные доступы к БД.
2. Не выполнены миграции. `Partner::all()` падает на `Base table 'partners'
   doesn't exist`; это же убивает и админку — при `SESSION_DRIVER=database` и
   `CACHE_STORE=database` без таблиц `sessions` и `cache` не отрисуется даже
   форма входа.
3. Нет `server/vendor/` — `composer install` на сервере не запускался.
4. В `bootstrap/cache/config.php` замёрз конфиг, снятый до заполнения `.env`;
   правки `.env` при этом ни на что не влияют. Лечится `optimize:clear`.

**Админка открывается, но вход не проходит.** Проверить `SESSION_DOMAIN` в
`.env` — там должен стоять текущий хост, — и что субдомен работает по HTTPS:
рядом стоит `SESSION_SECURE_COOKIE=true`, по http такая кука не ставится.

## Обновления

Plesk тянет ветку `deploy`. После pull:

```bash
cd ~/new.scm4.md/server
composer install --no-dev --optimize-autoloader   # если менялся composer.lock
php artisan migrate --force                       # если добавились миграции
php artisan optimize:clear
```

`.env`, `vendor/` и симлинк `public/storage` переживают обновление и заново не
создаются.

## Переезд на основной домен

1. Сменить `VITE_API_URL` и `VITE_STORAGE_URL` в `.github/workflows/deploy.yml` —
   это единственное место в репозитории, где захардкожен адрес продакшна:
   `VITE_*` читаются на этапе сборки и зашиваются в бандл, в рантайме их
   поменять нельзя.
2. В `server/.env` сменить `APP_URL`, `SESSION_DOMAIN` и `CORS_ALLOWED_ORIGINS`.
3. Перенести директивы из `nginx-plesk.conf` в настройки нового домена.
4. `php artisan optimize:clear`.
