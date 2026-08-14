import type { Locale } from '../i18n'

const LOCALE_TAGS: Record<Locale, string> = {
    ro: 'ro-RO',
    ru: 'ru-RU',
}

export function formatEventDate(date: string, lang: Locale) {
    const parsed = new Date(date)

    if (Number.isNaN(parsed.getTime())) {
        return date
    }

    return parsed.toLocaleDateString(LOCALE_TAGS[lang], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}
