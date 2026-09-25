import type { Locale } from './config'

/**
 * Static interface chrome only — labels that have no row in the database.
 * Everything editable in the admin panel (page titles, content, document
 * names, ...) comes from the API instead, via `localized()`.
 */
const ro = {
    'site.name': 'Instituția Medico-Sanitară Publică Spitalul Clinic Municipal Nr.4',
    'site.name1': 'Instituția Medico-Sanitară Publică',
    'site.name2': 'Spitalul Clinic Municipal Nr.4',
    'site.title': 'Spitalul Clinic Municipal Nr.4 — IMSP SCM Nr.4, Chișinău',
    'site.description': 'Instituția Medico-Sanitară Publică Spitalul Clinic Municipal Nr.4 din Chișinău: servicii medicale, secții, noutăți și contacte.',

    'nav.about': 'Despre Noi',
    'nav.transparency': 'Transparență',
    'nav.services': 'Servicii',
    'nav.sections': 'Secții',
    'nav.legislation': 'Legislație',
    'nav.events': 'Evenimente',
    'nav.donations': 'Donații',
    'nav.partnership': 'Parteneriat',
    'nav.home': 'Acasă',
    'nav.contacts': 'Contacte',

    'common.loading': 'Se încarcă...',
    'common.loadingContent': 'Se încarcă conținutul...',
    'common.loadingPartners': 'Se încarcă partenerii...',
    'common.loadError': 'Eroare la încărcare.',
    'common.notFound': 'Pagina nu a fost găsită.',
    'common.noImage': 'Fără imagine',
    'common.language': 'Limba',
    'common.openMenu': 'Deschide meniul',
    'common.closeMenu': 'Închide meniul',

    'home.servicesTitle': 'Serviciile noastre',
    'home.newsTitle': 'Noutăți și evenimente',
    'home.newsAll': 'Toate noutățile',
    'home.infoAddress': 'Adresa',
    'home.infoPhone': 'Telefon / fax',
    'home.infoAllContacts': 'Toate contactele',
    'home.infoShortAddress': 'Hartă',

    'transparency.view': 'Vizualizează',
    'transparency.empty': 'Nu există documente în această categorie.',

    'events.title': 'Evenimente',
    'events.empty': 'Nu există evenimente publicate.',
    'events.readMore': 'Citește mai mult',
    'events.back': 'Înapoi la evenimente',
    'events.pagination': 'Paginare evenimente',
    'events.prevPage': 'Pagina anterioară',
    'events.nextPage': 'Pagina următoare',

    'contact.nr': 'Nr.',
    'contact.name': 'Nume / Prenume',
    'contact.role': 'Funcția',
    'contact.section': 'Secția',
    'contact.phone': 'Telefon',
    'contact.staffTitle': 'Persoane de contact',
    'contact.infoTitle': 'Date de contact',
    'contact.mapTitle': 'Cum ne găsiți',
    'contact.formTitle': 'Trimite un mesaj',
    'contact.formSubtitle': 'Completați formularul și vă vom răspunde în cel mai scurt timp.',
    'contact.formName': 'Nume și prenume',
    'contact.formEmail': 'E-mail',
    'contact.formMessage': 'Mesaj',
    'contact.formSend': 'Trimite',
    'contact.formSending': 'Se trimite…',
    'contact.formSent': 'Mesajul a fost trimis. Vă mulțumim!',
    'contact.formSendAnother': 'Trimite alt mesaj',
    'contact.formError': 'Mesajul nu a putut fi trimis. Încercați din nou.',

    'about.title': 'Despre noi',
    'about.empty': 'Nu există încă pagini în această secțiune.',

    'footer.rights': 'Toate drepturile rezervate.',
    'footer.partners': 'Partenerii noștri',
    'footer.navigation': 'Navigare',
    'footer.contact': 'Contacte',
    'footer.address': 'str. Columna, nr. 150, mun. Chișinău, MD-2024',
    'footer.phone': '(022) 29 56 78',
    'footer.email': 'scm4@ms.md',
} as const

export type UiKey = keyof typeof ro

const ru: Record<UiKey, string> = {
    'site.name': 'Публичное медико-санитарное учреждение Муниципальная клиническая больница №4',
    'site.name1': 'Публичное медико-санитарное учреждение',
    'site.name2': 'Муниципальная клиническая больница №4',
    'site.title': 'Муниципальная клиническая больница №4 — ПМСУ МКБ №4, Кишинёв',
    'site.description': 'Публичное медико-санитарное учреждение Муниципальная клиническая больница №4, Кишинёв: медицинские услуги, отделения, новости и контакты.',

    'nav.about': 'О нас',
    'nav.transparency': 'Прозрачность',
    'nav.services': 'Услуги',
    'nav.sections': 'Отделения',
    'nav.legislation': 'Законодательство',
    'nav.events': 'События',
    'nav.donations': 'Пожертвования',
    'nav.partnership': 'Партнёрство',
    'nav.home': 'Главная',
    'nav.contacts': 'Контакты',

    'common.loading': 'Загрузка...',
    'common.loadingContent': 'Загрузка содержимого...',
    'common.loadingPartners': 'Загрузка партнёров...',
    'common.loadError': 'Ошибка загрузки.',
    'common.notFound': 'Страница не найдена.',
    'common.noImage': 'Без изображения',
    'common.language': 'Язык',
    'common.openMenu': 'Открыть меню',
    'common.closeMenu': 'Закрыть меню',

    'home.servicesTitle': 'Наши услуги',
    'home.newsTitle': 'Новости и события',
    'home.newsAll': 'Все новости',
    'home.infoAddress': 'Адрес',
    'home.infoPhone': 'Телефон / факс',
    'home.infoAllContacts': 'Все контакты',
    'home.infoShortAddress': 'Карта',

    'transparency.view': 'Посмотреть',
    'transparency.empty': 'В этой категории пока нет документов.',

    'events.title': 'События',
    'events.empty': 'Опубликованных событий нет.',
    'events.readMore': 'Читать далее',
    'events.back': 'Назад к событиям',
    'events.pagination': 'Страницы событий',
    'events.prevPage': 'Предыдущая страница',
    'events.nextPage': 'Следующая страница',

    'contact.nr': '№',
    'contact.name': 'Имя / Фамилия',
    'contact.role': 'Должность',
    'contact.section': 'Отделение',
    'contact.phone': 'Телефон',
    'contact.staffTitle': 'Контактные лица',
    'contact.infoTitle': 'Контактные данные',
    'contact.mapTitle': 'Как нас найти',
    'contact.formTitle': 'Отправить сообщение',
    'contact.formSubtitle': 'Заполните форму, и мы ответим вам в ближайшее время.',
    'contact.formName': 'Имя и фамилия',
    'contact.formEmail': 'E-mail',
    'contact.formMessage': 'Сообщение',
    'contact.formSend': 'Отправить',
    'contact.formSending': 'Отправка…',
    'contact.formSent': 'Сообщение отправлено. Спасибо!',
    'contact.formSendAnother': 'Отправить ещё одно',
    'contact.formError': 'Не удалось отправить сообщение. Попробуйте ещё раз.',

    'about.title': 'О нас',
    'about.empty': 'В этом разделе пока нет страниц.',

    'footer.rights': 'Все права защищены.',
    'footer.partners': 'Наши партнёры',
    'footer.navigation': 'Навигация',
    'footer.contact': 'Контакты',
    'footer.address': 'ул. Колумна, 150, мун. Кишинёв, MD-2024',
    'footer.phone': '(022) 29 56 78',
    'footer.email': 'scm4@ms.md',
}

export const messages: Record<Locale, Record<UiKey, string>> = { ro, ru }

export function translate(locale: Locale, key: UiKey): string {
    return messages[locale][key] ?? ro[key]
}
