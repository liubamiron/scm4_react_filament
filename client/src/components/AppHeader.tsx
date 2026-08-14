import { useState } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import { LOCALE_LABELS, SUPPORTED_LOCALES, useLocale, useSwitchLocale, useT } from '../i18n'
import type { UiKey } from '../i18n'

type NavChild = { labelKey: UiKey; slug: string }
type NavItem = { labelKey: UiKey; href: string; children?: NavChild[] }

/**
 * Several menu entries (/servicii, /sections, /legislation, /donations,
 * /partnership) point at routes that have not been built yet, so
 * the target cannot be checked against the route tree. They 404 exactly as
 * they did before the locale prefix was introduced.
 */
const localePath = (lang: string, href: string) =>
    `/${lang}${href}` as unknown as LinkProps['to']

const navigation: NavItem[] = [
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
    {
        labelKey: 'nav.sections',
        href: '/sections',
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

function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [isLangOpen, setIsLangOpen] = useState(false)

    const lang = useLocale()
    const switchLocale = useSwitchLocale()
    const t = useT()

    const toggleDropdown = (name: string) => {
        setOpenDropdown((prev) => (prev === name ? null : name))
    }

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-[#8ec2d6] py-3 flex justify-between items-center font-medium text-[#003366] px-5">
        <span>
          {t('site.name')}
        </span>
                <div className="relative">
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        aria-label={t('common.language')}
                        className="flex items-center gap-2 hover:opacity-80"
                    >
                        <Globe size={14} />

                        <span className="font-semibold uppercase">
            {lang}
        </span>

                        <ChevronDown
                            size={12}
                            className={`transition-transform ${
                                isLangOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {isLangOpen && (
                        <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden min-w-[80px] z-50">
                            {SUPPORTED_LOCALES.map((code) => (
                                <button
                                    key={code}
                                    onClick={() => {
                                        switchLocale(code)
                                        setIsLangOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-slate-100 ${
                                        lang === code
                                            ? 'font-bold text-blue-600'
                                            : ''
                                    }`}
                                >
                                    {LOCALE_LABELS[code]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="mx-auto flex items-center justify-between pr-2">
                <Link to="/$lang" params={{ lang }} className="flex items-center gap-3">
                    <img
                        src="/img/scm4_logo.jpg"
                        alt={t('site.name')}
                        className="w-62.5 h-15.5"
                    />
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-1">
                    {navigation.map((item) => (
                        <li key={item.labelKey} className="relative">
                            {/* MAIN BUTTON */}
                            {item.children ? (
                                <button
                                    onClick={() => toggleDropdown(item.labelKey)}
                                    className="py-2 px-2 font-medium text-slate-600 hover:text-[#0e67b9] hover:bg-slate-100 rounded-md
                                    flex items-center gap-1"
                                >
                                    {t(item.labelKey)}
                                    <ChevronDown
                                        size={14}
                                        className={`text-slate-400 transition-transform ${
                                            openDropdown === item.labelKey ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            ) : (
                                <Link
                                    to={localePath(lang, item.href)}
                                    className="px-2 py-2 font-medium text-slate-600 hover:text-[#0e67b9] hover:bg-slate-100 rounded-md"
                                >
                                    {t(item.labelKey)}
                                </Link>
                            )}

                            {/* DROPDOWN */}
                            {item.children && openDropdown === item.labelKey && (
                                <div className="absolute left-0 top-full mt-2 bg-white border border-slate-100 shadow-xl rounded-lg py-2 min-w-[180px] z-50">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.slug}
                                            to="/$lang/pages/$slug"
                                            params={{
                                                lang,
                                                slug: child.slug,
                                            }}
                                            onClick={() => setOpenDropdown(null)}
                                            className="block px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                        >
                                            {t(child.labelKey)}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Mobile Button */}
                <button
                    className="lg:hidden p-2 text-slate-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t py-4 px-4 space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.labelKey}
                            to={localePath(lang, item.href)}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 font-medium text-slate-700 rounded-xl"
                        >
                            {t(item.labelKey)}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}

export default AppHeader
