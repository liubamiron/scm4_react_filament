import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './config'

const LANG_SEGMENT = new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})(?=/|$)`)

/**
 * `<link rel="alternate" hreflang>` entries for the given path: one per
 * supported locale plus `x-default`, which points at the DEFAULT_LOCALE
 * version since "/" itself only redirects client-side and is not a page.
 *
 * Every page exists in every locale at the same path (the API returns both
 * languages in one payload), so the alternates are the current path with the
 * language segment swapped. The query string is dropped on purpose: page 1
 * of a paginated list is the canonical URL, and that is what the alternate
 * should point at.
 */
export function hreflangLinks(pathname: string) {
    if (typeof window === 'undefined') return []

    const rest = pathname.replace(LANG_SEGMENT, '').replace(/\/$/, '')
    const url = (locale: string) => `${window.location.origin}/${locale}${rest}`

    return [
        ...SUPPORTED_LOCALES.map((locale) => ({ rel: 'alternate', hrefLang: locale, href: url(locale) })),
        { rel: 'alternate', hrefLang: 'x-default', href: url(DEFAULT_LOCALE) },
    ]
}
