import { createFileRoute, redirect } from '@tanstack/react-router'
import { resolveLocale } from '../i18n'

/**
 * "/" carries no language, so send the visitor to their locale's home page.
 */
export const Route = createFileRoute('/')({
    beforeLoad: () => {
        throw redirect({
            to: '/$lang',
            params: { lang: resolveLocale() },
            replace: true,
        })
    },
})
