# Развёртывание на Plesk (host.md)

Процедура установки сайта на `scm4.md` и того, что приходится повторять при
обновлениях.

Сайт живёт в собственном каталоге домена — `~/httpdocs/`. Тестовый субдомен
`new.scm4.md`, с которого проект начинался, больше не нужен: как от него
отказаться, не потеряв базу и картинки, — в разделе «Перезаливка на scm4.md».

Файл лежит рядом с `nginx-plesk.conf` по той же причине, что и он: панель Plesk
ничего не версионирует, и восстанавливать настройку пришлось бы по памяти.

## Как устроен деплой

Клиент собирается в GitHub Actions (`.github/workflows/deploy.yml`), а не на
сервере — `node_modules` весит около 300 МБ при квоте 2 ГБ на весь аккаунт.
Результат складывается в ветку `deploy`, её и тянет Plesk.

Document root домена `scm4.md` смотрит в `httpdocs/server/public`, где рядом лежат
`index.html` собранного React и `index.php` Laravel. Кому какой запрос
достаётся — разводится в `nginx-plesk.conf`.

**В ветке `deploy` нет и не будет трёх вещей:** `server/.env`, `server/vendor/`
и симлинка `server/public/storage`. Первое — секреты, второе и третье — в
`.gitignore`. Всё три создаются на сервере руками один раз.

## Первичная установка

### 1. nginx-директивы

Websites & Domains → scm4.md → Apache & nginx Settings → поле
«Additional nginx directives» → вставить содержимое `nginx-plesk.conf` → Apply.

PHP должен работать в режиме **FPM application served by nginx**. В этом режиме
Apache в обработке запросов не участвует и `.htaccess` не читается вовсе,
поэтому вся маршрутизация задаётся именно здесь.

### 2. База данных

Websites & Domains → Databases → Add Database. Имя, пользователь, пароль.

Поле **Related site** — только группировка в интерфейсе Plesk, на доступность
оно не влияет: PHP подключается к MySQL по логину и паролю, а не «через домен».
Поэтому база `scmmd_new`, созданная когда-то под субдомен, без переименования
работает и с `scm4.md`.

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
cd ~/httpdocs/server
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
cd ~/httpdocs/server

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
| `https://scm4.md/ru` | Главная страница сайта |
| `https://scm4.md/up` | Страница health-check Laravel |
| `https://scm4.md/api/partners` | `[]` или JSON-массив |
| `https://scm4.md/admin` | Форма входа Filament |

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
tail -n 50 ~/httpdocs/server/storage/logs/laravel.log
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
`.env` — там должен стоять текущий хост, — и что домен работает по HTTPS:
рядом стоит `SESSION_SECURE_COOKIE=true`, по http такая кука не ставится.

## Обновления

Plesk тянет ветку `deploy`. После pull:

```bash
cd ~/httpdocs/server
composer install --no-dev --optimize-autoloader   # если менялся composer.lock
php artisan migrate --force                       # если добавились миграции
php artisan optimize:clear
```

`.env`, `vendor/` и симлинк `public/storage` переживают обновление и заново не
создаются.

## Перезаливка на scm4.md (отказ от new.scm4.md)

Раньше document root `scm4.md` смотрел в каталог тестового субдомена
`new.scm4.md/server/public`, и удалить субдомен было нельзя — Plesk удаляет
вместе с ним его каталог, то есть живой сайт. Поэтому проект ставится заново
в собственный каталог домена `~/httpdocs/`, а из старой установки переносятся
только три вещи: **база** (`scmmd_new` остаётся как есть, её не трогаем),
**`server/.env`** и **загруженные файлы** `server/storage/app/public`.

Пока новая установка не проверена, старая продолжает работать — откат
занимает одну смену document root.

Адрес в бандл не зашит: `VITE_API_URL=/api` и `VITE_STORAGE_URL=/storage` в
`deploy.yml` относительные, пересборка не нужна.

1. **Бэкап.** Backup Manager, или хотя бы дамп `scmmd_new`
   (Databases → Export Dump) и архив `~/new.scm4.md/server/storage/app/public`.
   Если в `~/httpdocs` лежит что-то от старого сайта — скачать и это.
2. **Освободить `~/httpdocs`.** Удалить из него всё (после бэкапа), чтобы
   файлы старого сайта не смешались с новыми.
3. **Git.** Websites & Domains → `scm4.md` → Git → Add Repository: тот же
   репозиторий, ветка `deploy`, Deployment path — `/httpdocs`, режим
   автоматического деплоя. Нажать Pull / Deploy.
4. **Перенести `.env` и картинки** (путь PHP — см. «Зависимости, миграции, права»):

   ```bash
   cp ~/new.scm4.md/server/.env ~/httpdocs/server/.env
   cp -a ~/new.scm4.md/server/storage/app/public/. ~/httpdocs/server/storage/app/public/

   cd ~/httpdocs/server
   composer install --no-dev --optimize-autoloader
   /opt/plesk/php/8.4/bin/php artisan optimize:clear
   /opt/plesk/php/8.4/bin/php artisan migrate --force
   /opt/plesk/php/8.4/bin/php artisan storage:link
   chmod -R ug+rw storage bootstrap/cache
   /opt/plesk/php/8.4/bin/php artisan optimize
   ```

   `.env` копируется целиком, вместе с `APP_KEY`: с другим ключом Laravel не
   расшифрует уже выданные куки. `storage:link` создаёт ссылку с абсолютным
   путём, поэтому старую не переносить — только создать заново.
   В `.env` проверить `APP_URL=https://scm4.md`, `SESSION_DOMAIN=scm4.md`,
   `CORS_ALLOWED_ORIGINS=https://scm4.md`, `APP_DEBUG=false`.
5. **Hosting Settings** `scm4.md` → Document root → `httpdocs/server/public`.
   PHP Settings (PHP 8.4, «FPM application served by nginx») и nginx-директивы
   из `nginx-plesk.conf` привязаны к домену, а не к каталогу, — проверить, что
   они на месте.
6. **Scheduled Tasks.** Если есть задачи с путём `~/new.scm4.md/...`
   (`schedule:run`, `queue:work`) — поменять на `~/httpdocs/...`.
7. **Проверка** — таблица из раздела «Проверка» выше, плюс картинки на
   главной и вход в `/admin`.
8. **Абсолютные ссылки в контенте.** TinyMCE пишет относительные
   `../storage/...`, но проверить стоит:

   ```sql
   SELECT id, slug FROM pages
   WHERE content_ro LIKE '%new.scm4.md%' OR content_ru LIKE '%new.scm4.md%';
   ```

   Найденное исправить через
   `UPDATE pages SET content_ro = REPLACE(content_ro, 'https://new.scm4.md', '')`
   (и так же `content_ru`, и другие таблицы с `content_*`).
9. **Удалить субдомен.** Сначала Databases → `scmmd_new` → **Related site**
   сменить на `scm4.md`, чтобы база не ушла вместе с субдоменом. Затем удалить
   Git-репозиторий у `new.scm4.md` и сам субдомен — вместе с ним Plesk удалит
   `~/new.scm4.md/` и освободит квоту.
