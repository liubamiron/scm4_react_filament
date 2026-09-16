import type { LinkProps } from '@tanstack/react-router'
import type { UiKey } from '../i18n'
import type { ServicePage } from '../types'

/**
 * One header/footer entry. Either a fixed link (`href`) or a CMS category
 * (`pageType`) whose entry is built from the admin panel's pages of that type
 * — see `useNavigation` for how a category turns into a link or a dropdown.
 * A category may also carry an `href` to its own listing route (e.g. /about),
 * used as the group heading link in the footer.
 */
export type NavItem = {
    labelKey: UiKey
    href?: string
    pageType?: ServicePage['type']
}

/**
 * /donations points at a route that has not been built yet, so the target
 * cannot be checked against the route tree. It 404s exactly as it did before
 * the locale prefix was introduced.
 */
export const localePath = (lang: string, href: string) =>
    `/${lang}${href}` as unknown as LinkProps['to']

// Shared by the header menu and the footer link list. `general` pages are not a
// menu category — they are linked individually (Legislație) or not at all.
export const navigation: NavItem[] = [
    { labelKey: 'nav.about', href: '/about', pageType: 'about' },
    { labelKey: 'nav.transparency', href: '/transparenta' },
    { labelKey: 'nav.services', pageType: 'service' },
    { labelKey: 'nav.sections', pageType: 'section' },
    { labelKey: 'nav.legislation', href: '/pages/legislatie' },
    { labelKey: 'nav.events', href: '/events' },
    { labelKey: 'nav.donations', href: '/donations' },
    { labelKey: 'nav.partnership', pageType: 'partnership' },
    { labelKey: 'nav.contacts', pageType: 'contact' },
]
