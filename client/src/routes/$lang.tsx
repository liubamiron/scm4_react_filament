import { createFileRoute, redirect } from '@tanstack/react-router'
import { hreflangLinks, isLocale, resolveLocale } from '../i18n'
import { LocaleLayout } from '../layouts/LocaleLayout'

export const Route = createFileRoute('/$lang')({
    // The alternates depend on the full path, which only the innermost match
    // carries — this route's own match is just "/$lang".
    head: ({ matches }) => ({
        links: hreflangLinks(matches[matches.length - 1]?.pathname ?? ''),
    }),
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
