import { useEffect } from 'react'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { isLocale, persistLocale, resolveLocale } from '../i18n'

export const Route = createFileRoute('/$lang')({
    beforeLoad: ({ params, location }) => {
        if (isLocale(params.lang)) return

        // The first segment is not a language, so this is a legacy or bare URL
        // such as "/about". Keep the path and prefix it with a locale.
        // `href` takes a raw path, which `to` (typed against the route tree)
        // cannot express here.
        throw redirect({
            href: `/${resolveLocale()}${location.pathname}`,
            replace: true,
        })
    },
    component: LocaleLayout,
})

function LocaleLayout() {
    const { lang } = Route.useParams()

    useEffect(() => {
        if (isLocale(lang)) persistLocale(lang)
    }, [lang])

    return <Outlet />
}
