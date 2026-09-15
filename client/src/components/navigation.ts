import type { LinkProps } from '@tanstack/react-router'
import type { UiKey } from '../i18n'

export type NavChild = { labelKey: UiKey; slug: string }
export type NavItem = { labelKey: UiKey; href: string; children?: NavChild[] }

/**
 * Several menu entries (/servicii, /sections, /legislation, /donations,
 * /partnership) point at routes that have not been built yet, so
 * the target cannot be checked against the route tree. They 404 exactly as
 * they did before the locale prefix was introduced.
 */
export const localePath = (lang: string, href: string) =>
    `/${lang}${href}` as unknown as LinkProps['to']

// Shared by the header menu and the footer link list.
export const navigation: NavItem[] = [
    {
        labelKey: 'nav.about',
        href: '/about',
        children: [
            { labelKey: 'sub.history', slug: 'istoric' },
            { labelKey: 'sub.team', slug: 'echipa' },
            { labelKey: 'sub.mission', slug: 'misiunea' },
        ],
    },
    { labelKey: 'nav.transparency', href: '/transparenta' },
    {
        labelKey: 'nav.services',
        href: '/servicii',
        children: [
            { labelKey: 'sub.geriatric', slug: 'serviciu-geriatric' },
            { labelKey: 'sub.palliative', slug: 'ingrijiri-paliative' },
            { labelKey: 'sub.forPatients', slug: 'pentru-pacienti' },
        ],
    },
    { labelKey: 'nav.sections', href: '/sections' },
    { labelKey: 'nav.legislation', href: '/pages/legislatie' },
    { labelKey: 'nav.events', href: '/events' },
    { labelKey: 'nav.donations', href: '/donations' },
    {
        labelKey: 'nav.partnership',
        href: '/partnership',
        children: [
            { labelKey: 'sub.collaboration', slug: 'colaborare' },
            { labelKey: 'sub.volunteering', slug: 'voluntariat' },
        ],
    },
]
