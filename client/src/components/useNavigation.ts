import { useMenuPages } from '../features/pages/hook/useMenuPages'
import { localized, useLocale } from '../i18n'
import type { UiKey } from '../i18n'
import { navigation } from './navigation'

export type ResolvedNavChild = { label: string; slug: string }

/**
 * A menu entry ready to render. `children` set → a dropdown of sub-pages
 * (`href`, when present, is the group's own listing route). No `children` →
 * a plain link to `href`.
 */
export type ResolvedNavItem = { labelKey: UiKey; href?: string; children?: ResolvedNavChild[] }

export type Menu = 'header' | 'footer'

const FLAG: Record<Menu, 'show_in_header' | 'show_in_footer'> = {
    header: 'show_in_header',
    footer: 'show_in_footer',
}

/**
 * The site menu with CMS categories resolved against the admin panel's pages
 * flagged for the given menu:
 *
 *  - several pages of that type → dropdown listing them
 *  - exactly one page          → direct link to that page
 *  - none                      → link to the category's listing route, or
 *                                hidden when it has none
 *
 * Fixed entries pass through unchanged. While the menu request is in flight,
 * categories behave as if they had no pages, so the header renders at once.
 */
export function useNavigation(menu: Menu): ResolvedNavItem[] {
    const lang = useLocale()
    const { data: pages } = useMenuPages()

    const listed = (pages ?? []).filter((page) => page[FLAG[menu]])

    return navigation.flatMap(({ labelKey, href, pageType }) => {
        if (!pageType) return [{ labelKey, href }]

        const ofType = listed.filter((page) => page.type === pageType)

        if (ofType.length > 1) {
            return [
                {
                    labelKey,
                    href,
                    children: ofType.map((page) => ({ label: localized(page, 'title', lang), slug: page.slug })),
                },
            ]
        }

        if (ofType.length === 1) return [{ labelKey, href: `/pages/${ofType[0].slug}` }]

        return href ? [{ labelKey, href }] : []
    })
}
