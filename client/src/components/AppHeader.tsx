import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Globe, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import { LOCALE_LABELS, SUPPORTED_LOCALES, useLocale, useSwitchLocale, useT } from '../i18n'
import { localePath } from './navigation'
import { useNavigation } from './useNavigation'
import { MAPS_URL, telHref } from './contactLinks'
import { SiteLogo } from './SiteLogo'

function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [isLangOpen, setIsLangOpen] = useState(false)

    const lang = useLocale()
    const switchLocale = useSwitchLocale()
    const t = useT()
    const navigation = useNavigation('header')

    // The open mobile menu covers the whole screen; stop the page behind it
    // from scrolling.
    useEffect(() => {
        if (!isMenuOpen) return
        const previous = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previous
        }
    }, [isMenuOpen])

    const closeMenu = () => {
        setIsMenuOpen(false)
        setOpenDropdown(null)
    }

    const toggleDropdown = (name: string) => {
        setOpenDropdown((prev) => (prev === name ? null : name))
    }

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b-2 border-gold-500 bg-brand-950 px-5 py-2.5 text-sm tracking-wide text-white/85">
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
                        <div className="absolute right-0 mt-2 bg-white text-slate-700 border border-slate-200 rounded-md shadow-lg overflow-hidden min-w-[80px] z-50">
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
                <Link to="/$lang" params={{ lang }} aria-label={t('site.name')} className="py-3">
                    <SiteLogo />
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
                    aria-label={t('common.openMenu')}
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu size={28} />
                </button>
            </nav>

            {/* Mobile Menu — a full-screen sheet over the site (and the bottom
                tab bar) with its own logo row and close button. Same entries
                as the desktop menu: groups expand to their sub-pages, plain
                items link directly. Contacts sit at the bottom. */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5">
                        <Link to="/$lang" params={{ lang }} aria-label={t('site.name')} onClick={closeMenu} className="py-3">
                            <SiteLogo emblemClassName="h-9 w-10 bg-brand-700" textClassName="text-lg text-brand-900" />
                        </Link>
                        <div className="flex items-center gap-3">
                            {/* The top bar's language switcher is hidden under the sheet. */}
                            <div role="group" aria-label={t('common.language')} className="flex rounded-full border border-slate-200 p-0.5">
                                {SUPPORTED_LOCALES.map((code) => (
                                    <button
                                        key={code}
                                        onClick={() => switchLocale(code)}
                                        aria-pressed={lang === code}
                                        className={`rounded-full px-3 py-1 text-sm font-semibold uppercase ${
                                            lang === code ? 'bg-brand-700 text-white' : 'text-slate-600'
                                        }`}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                            <button className="p-2 text-slate-600" aria-label={t('common.closeMenu')} onClick={closeMenu}>
                                <X size={28} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-3">
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
                                            onClick={closeMenu}
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
                                                        onClick={closeMenu}
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

                        <ul className="mt-4 space-y-3 border-t border-slate-100 px-4 pt-5 text-sm text-slate-700">
                            <li>
                                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-brand-700">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                                    {t('footer.address')}
                                </a>
                            </li>
                            <li>
                                <a href={telHref(t('footer.phone'))} className="flex items-center gap-3 font-semibold hover:text-brand-700">
                                    <Phone className="h-4 w-4 shrink-0 text-brand-700" />
                                    {t('footer.phone')}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${t('footer.email')}`} className="flex items-center gap-3 hover:text-brand-700">
                                    <Mail className="h-4 w-4 shrink-0 text-brand-700" />
                                    {t('footer.email')}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </header>
    )
}

export default AppHeader
