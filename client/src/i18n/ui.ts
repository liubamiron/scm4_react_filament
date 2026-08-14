import type { Locale } from './config'

/**
 * Static interface chrome only — labels that have no row in the database.
 * Everything editable in the admin panel (page titles, content, document
 * names, ...) comes from the API instead, via `localized()`.
 */
const ro = {
    'site.name': 'Instituția Medico-Sanitară Publică Spitalul Clinic Municipal Nr.4',

    'nav.about': 'Despre Noi',
    'nav.transparency': 'Transparență',
    'nav.services': 'Servicii',
    'nav.sections': 'Secții',
    'nav.legislation': 'Legislație',
    'nav.events': 'Evenimente',
    'nav.donations': 'Donații',
    'nav.partnership': 'Parteneriat',
    'nav.home': 'Acasă',
    'nav.pages': 'Pagini',
    'nav.contacts': 'Contacte',

    'sub.history': 'Istoric',
    'sub.team': 'Echipa',
    'sub.mission': 'Misiunea',
    'sub.geriatric': 'Serviciu Geriatric',
    'sub.palliative': 'Îngrijiri Paliative',
    'sub.forPatients': 'Pentru Pacienți',
    'sub.collaboration': 'Colaborare',
    'sub.volunteering': 'Voluntariat',

    'common.loading': 'Se încarcă...',
    'common.loadingContent': 'Se încarcă conținutul...',
    'common.loadingPartners': 'Se încarcă partenerii...',
    'common.loadError': 'Eroare la încărcare.',
    'common.notFound': 'Pagina nu a fost găsită.',
    'common.noImage': 'Fără imagine',
    'common.language': 'Limba',

    'home.servicesTitle': 'Serviciile noastre',
    'home.newsTitle': 'Noutăți și evenimente',
    'home.newsAll': 'Toate noutățile',

    'transparency.view': 'Vizualizează',

    'events.title': 'Evenimente',
    'events.empty': 'Nu există evenimente publicate.',
    'events.readMore': 'Citește mai mult',
    'events.back': 'Înapoi la evenimente',

    'contact.nr': 'Nr.',
    'contact.name': 'Nume / Prenume',
    'contact.role': 'Funcția',
    'contact.section': 'Secția',
    'contact.phone': 'Telefon',

    'about.title': 'Despre noi',
    'about.intro': 'Aceasta este pagina Despre noi.',

    'footer.rights': 'Toate drepturile rezervate.',
} as const

export type UiKey = keyof typeof ro

const ru: Record<UiKey, string> = {
    'site.name': 'Публичное медико-санитарное учреждение Муниципальная клиническая больница №4',

    'nav.about': 'О нас',
    'nav.transparency': 'Прозрачность',
    'nav.services': 'Услуги',
    'nav.sections': 'Отделения',
    'nav.legislation': 'Законодательство',
    'nav.events': 'События',
    'nav.donations': 'Пожертвования',
    'nav.partnership': 'Партнёрство',
    'nav.home': 'Главная',
    'nav.pages': 'Страницы',
    'nav.contacts': 'Контакты',

    'sub.history': 'История',
    'sub.team': 'Команда',
    'sub.mission': 'Миссия',
    'sub.geriatric': 'Гериатрическая служба',
    'sub.palliative': 'Паллиативная помощь',
    'sub.forPatients': 'Для пациентов',
    'sub.collaboration': 'Сотрудничество',
    'sub.volunteering': 'Волонтёрство',

    'common.loading': 'Загрузка...',
    'common.loadingContent': 'Загрузка содержимого...',
    'common.loadingPartners': 'Загрузка партнёров...',
    'common.loadError': 'Ошибка загрузки.',
    'common.notFound': 'Страница не найдена.',
    'common.noImage': 'Без изображения',
    'common.language': 'Язык',

    'home.servicesTitle': 'Наши услуги',
    'home.newsTitle': 'Новости и события',
    'home.newsAll': 'Все новости',

    'transparency.view': 'Посмотреть',

    'events.title': 'События',
    'events.empty': 'Опубликованных событий нет.',
    'events.readMore': 'Читать далее',
    'events.back': 'Назад к событиям',

    'contact.nr': '№',
    'contact.name': 'Имя / Фамилия',
    'contact.role': 'Должность',
    'contact.section': 'Отделение',
    'contact.phone': 'Телефон',

    'about.title': 'О нас',
    'about.intro': 'Это страница «О нас».',

    'footer.rights': 'Все права защищены.',
}

export const messages: Record<Locale, Record<UiKey, string>> = { ro, ru }

export function translate(locale: Locale, key: UiKey): string {
    return messages[locale][key] ?? ro[key]
}
