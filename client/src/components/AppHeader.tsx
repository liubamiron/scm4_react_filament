import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import { LOCALE_LABELS, SUPPORTED_LOCALES, useLocale, useSwitchLocale, useT } from '../i18n'
import { localePath } from './navigation'
import { useNavigation } from './useNavigation'

function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [isLangOpen, setIsLangOpen] = useState(false)

    const lang = useLocale()
    const switchLocale = useSwitchLocale()
    const t = useT()
    const navigation = useNavigation('header')

    const toggleDropdown = (name: string) => {
        setOpenDropdown((prev) => (prev === name ? null : name))
    }

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-brand-200 px-5 py-3 text-sm font-medium text-brand-900 md:text-base">
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
                            className={`${
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
                                            ? 'font-bold text-brand-700'
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
            <nav className="flex items-center justify-between px-5">
                <Link to="/$lang" params={{ lang }} className="flex items-center gap-3">
                    <img
                        src="/img/scm4_logo.jpg"
                        alt={t('site.name')}
                        width={742}
                        height={212}
                        fetchPriority="high"
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
                                    className="flex items-center gap-1 rounded-md px-2 py-2 font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                                >
                                    {t(item.labelKey)}
                                    <ChevronDown
                                        size={14}
                                        className={`text-slate-400 ${
                                            openDropdown === item.labelKey ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            ) : (
                                <Link
                                    to={localePath(lang, item.href!)}
                                    className="rounded-md px-2 py-2 font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
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
                                            className="block px-4 py-2 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                                        >
                                            {child.label}
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

            {/* Mobile Menu — same entries as the desktop menu: groups expand to
                their sub-pages, plain items link directly. Capped in height so
                the sticky header never traps the list off-screen. */}
            {isMenuOpen && (
                <div className="lg:hidden max-h-[calc(100vh-8rem)] overflow-y-auto border-t border-slate-100 bg-white px-4 py-3">
                    <ul className="space-y-1">
                        {navigation.map((item) => (
                            <li key={item.labelKey}>
                                {item.children ? (
                                    <button
                                        onClick={() => toggleDropdown(item.labelKey)}
                                        aria-expanded={openDropdown === item.labelKey}
                                        className="flex w-full items-center justify-between rounded-md px-4 py-3 font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                                    >
                                        {t(item.labelKey)}
                                        <ChevronDown
                                            size={16}
                                            className={`text-slate-400 ${
                                                openDropdown === item.labelKey ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                ) : (
                                    <Link
                                        to={localePath(lang, item.href!)}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block rounded-md px-4 py-3 font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                                    >
                                        {t(item.labelKey)}
                                    </Link>
                                )}

                                {item.children && openDropdown === item.labelKey && (
                                    <ul className="ml-4 border-l-2 border-brand-100 pl-2">
                                        {item.children.map((child) => (
                                            <li key={child.slug}>
                                                <Link
                                                    to="/$lang/pages/$slug"
                                                    params={{ lang, slug: child.slug }}
                                                    onClick={() => {
                                                        setOpenDropdown(null)
                                                        setIsMenuOpen(false)
                                                    }}
                                                    className="block rounded-md px-4 py-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                                                >
                                                    {child.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    )
}

export default AppHeader
