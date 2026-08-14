import { DEFAULT_LOCALE, type Locale } from './config'

/**
 * Reads a translated column off a record coming from the API.
 *
 * The database stores one column per language (`title_ro` / `title_ru`,
 * `content_ro` / `content_ru`, ...). The `_ru` columns are nullable, so an
 * untranslated record falls back to the default locale rather than rendering
 * an empty block.
 */
export function localized(
    record: object | null | undefined,
    field: string,
    locale: Locale,
): string {
    if (!record) return ''

    const source = record as Record<string, unknown>

    const value = source[`${field}_${locale}`]
    if (typeof value === 'string' && value.trim() !== '') return value

    const fallback = source[`${field}_${DEFAULT_LOCALE}`]
    return typeof fallback === 'string' ? fallback : ''
}
