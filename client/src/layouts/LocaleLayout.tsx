import { useEffect } from 'react'
import { Outlet, useParams } from '@tanstack/react-router'
import { isLocale, persistLocale } from '../i18n'

// Remembers the locale from the URL so `/` can redirect to it next time.
export function LocaleLayout() {
    const { lang } = useParams({ from: '/$lang' })

    useEffect(() => {
        if (isLocale(lang)) persistLocale(lang)
    }, [lang])

    return <Outlet />
}
