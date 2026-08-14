export const SUPPORTED_LOCALES = ['ro', 'ru'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ro'

export const LOCALE_STORAGE_KEY = 'language'

export const LOCALE_LABELS: Record<Locale, string> = {
    ro: 'RO',
    ru: 'RU',
}

export function isLocale(value: unknown): value is Locale {
    return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

/**
 * The locale to use when the URL does not carry one yet (a bare visit to "/").
 * Preference order: last explicit choice, then browser language, then default.
 */
export function resolveLocale(): Locale {
    if (typeof window === 'undefined') return DEFAULT_LOCALE

    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(stored)) return stored

    const browser = window.navigator.language?.slice(0, 2).toLowerCase()
    if (isLocale(browser)) return browser

    return DEFAULT_LOCALE
}

export function persistLocale(locale: Locale) {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
}
