import { useCallback } from 'react'
import { useNavigate, useParams, useRouterState } from '@tanstack/react-router'
import { DEFAULT_LOCALE, isLocale, persistLocale, type Locale } from './config'
import { translate, type UiKey } from './ui'

/**
 * The active locale. The URL is the single source of truth — every page lives
 * under `/$lang`, so the first path segment always tells us the language.
 */
export function useLocale(): Locale {
    const params = useParams({ strict: false }) as { lang?: string }
    const pathname = useRouterState({ select: (state) => state.location.pathname })

    if (isLocale(params.lang)) return params.lang

    // Components rendered above the `$lang` route (header, footer) may read the
    // locale before the param is resolved, so fall back to the raw path.
    const segment = pathname.split('/')[1]
    return isLocale(segment) ? segment : DEFAULT_LOCALE
}

/** `t('nav.about')` — static interface strings for the active locale. */
export function useT() {
    const locale = useLocale()
    return useCallback((key: UiKey) => translate(locale, key), [locale])
}

/**
 * Switches language while staying on the current page: only the `lang` param
 * changes, so `/ro/pages/istoric` becomes `/ru/pages/istoric`.
 */
export function useSwitchLocale() {
    const navigate = useNavigate()

    return useCallback(
        (next: Locale) => {
            persistLocale(next)
            navigate({
                to: '.',
                params: (prev: Record<string, unknown>) => ({ ...prev, lang: next }),
            })
        },
        [navigate],
    )
}
