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

// Fixed hrefs are joined to the locale as plain strings, so the target is not
// checked against the route tree.
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
    { labelKey: 'nav.donations', pageType: 'donations' },
    { labelKey: 'nav.partnership', pageType: 'partnership' },
    { labelKey: 'nav.contacts', pageType: 'contact' },
]
