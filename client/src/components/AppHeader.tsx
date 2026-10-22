import { useEffect, useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronDown, Globe, Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import { LOCALE_LABELS, SUPPORTED_LOCALES, useLocale, useSwitchLocale, useT } from '../i18n'
import { localePath } from './navigation'
import { useNavigation } from './useNavigation'
import { MAPS_URL, telHref } from './contactLinks'
import { Emblem } from './Emblem'

const contactIconClass = 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700'
// The current section gets a gold underline rather than a dark block, so
// hover, an open dropdown and the active page no longer look the same.
const menuItemClass =
    'relative flex w-full items-center justify-center gap-1 whitespace-nowrap px-4 py-4 text-[15px] font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white ' +
    'after:absolute after:inset-x-5 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-gold-500 after:opacity-0 after:transition-opacity ' +
    '[&.active]:text-white [&.active]:after:opacity-100'

function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [isLangOpen, setIsLangOpen] = useState(false)

    const lang = useLocale()
    const switchLocale = useSwitchLocale()
    const t = useT()
    const navigation = useNavigation('header')
    const pathname = useRouterState({ select: (s) => s.location.pathname })
    const navRef = useRef<HTMLElement>(null)

    // Desktop dropdowns close on a click outside the menu bar or on Escape.
    // Not while the mobile sheet is open: it shares `openDropdown` and lives
    // outside the nav.
    useEffect(() => {
        if (!openDropdown || isMenuOpen) return
        const onPointerDown = (e: PointerEvent) => {
            if (!navRef.current?.contains(e.target as Node)) setOpenDropdown(null)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpenDropdown(null)
        }
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [openDropdown, isMenuOpen])

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

    const phone = t('footer.phone')
    const email = t('footer.email')

    // Three rows, like scm1.md: a light utility bar (quick links + language),
    // the white identity row (emblem, full name, e-mail and phone) and a blue
    // menu bar. They are siblings rather than one <header> so each can be
    // sticky on its own: the menu bar on desktop, the logo row on phones.
    return (
        <>
            {/* Utility bar */}
            <div className="flex items-center justify-between bg-slate-100 px-5 py-2 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-6">
                    <Link to="/$lang" params={{ lang }} className="hover:text-brand-700">
                        {t('nav.home')}
                    </Link>
                    <Link to="/$lang/pages/$slug" params={{ lang, slug: 'contacte' }} className="hover:text-brand-700">
                        {t('nav.contacts')}
                    </Link>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        aria-label={t('common.language')}
                        className="flex items-center gap-1.5 hover:text-brand-700"
                    >
                        <Globe size={14} />
                        <span className="uppercase">{lang}</span>
                        <ChevronDown size={12} className={isLangOpen ? 'rotate-180' : ''} />
                    </button>

                    {isLangOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-sm font-normal text-slate-700 border border-slate-200 rounded-md shadow-lg overflow-hidden min-w-[80px] z-[55]">
                            {SUPPORTED_LOCALES.map((code) => (
                                <button
                                    key={code}
                                    onClick={() => {
                                        switchLocale(code)
                                        setIsLangOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-slate-100 ${
                                        lang === code ? 'font-bold text-brand-700' : ''
                                    }`}
                                >
                                    {LOCALE_LABELS[code]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Identity row */}
            <header className="sticky top-0 z-50 flex items-center justify-between gap-6 bg-white px-5 shadow-sm lg:static lg:shadow-none">
                <Link to="/$lang" params={{ lang }} aria-label={t('site.name')} className="flex items-center gap-3 py-3 lg:gap-4 lg:py-5">
                    <Emblem className="h-10 w-10 shrink-0 bg-brand-700 lg:h-14 lg:w-14" />
                    <span className="text-[13px] font-bold leading-snug text-brand-700 sm:text-base lg:text-lg xl:text-xl">
                        {t('site.name1')}
                        <br />
                        {t('site.name2')}
                    </span>
                </Link>

                <div className="hidden items-center gap-8 lg:flex">
                    <a href={`mailto:${email}`} className="group flex items-center gap-3">
                        <span className={contactIconClass}>
                            <Mail size={20} />
                        </span>
                        <span className="text-sm">
                            <span className="block text-slate-500">{t('header.email')}</span>
                            <span className="block font-semibold text-brand-700 group-hover:text-brand-900">{email}</span>
                        </span>
                    </a>
                    <a href={telHref(phone)} className="group flex items-center gap-3">
                        <span className={contactIconClass}>
                            <Phone size={20} />
                        </span>
                        <span className="text-sm">
                            <span className="block text-slate-500">{t('header.phone')}</span>
                            <span className="block font-semibold text-brand-700 group-hover:text-brand-900">{phone}</span>
                        </span>
                    </a>
                </div>

                {/* Mobile Button */}
                <button
                    className="lg:hidden p-2 text-slate-600"
                    aria-label={t('common.openMenu')}
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(true)}
                >
                    <Menu size={28} />
                </button>
            </header>

            {/* Desktop Menu */}
            <nav ref={navRef} className="sticky top-0 z-50 hidden bg-brand-700 shadow-md lg:block">
                <ul className="flex items-stretch">
                    {navigation.map((item) => (
                        <li key={item.labelKey} className="relative flex-auto">
                            {item.children ? (
                                <button
                                    onClick={() => toggleDropdown(item.labelKey)}
                                    aria-expanded={openDropdown === item.labelKey}
                                    className={`${menuItemClass} ${
                                        openDropdown === item.labelKey ? 'bg-white/10 text-white' : ''
                                    } ${
                                        // A group is the current section when one of its pages is open.
                                        item.children.some((child) => pathname.endsWith(`/pages/${child.slug}`))
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    {t(item.labelKey)}
                                    <ChevronDown
                                        size={16}
                                        className={`opacity-80 transition-transform ${
                                            openDropdown === item.labelKey ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            ) : (
                                <Link
                                    to={localePath(lang, item.href!)}
                                    className={menuItemClass}
                                >
                                    {t(item.labelKey)}
                                </Link>
                            )}

                            {/* DROPDOWN */}
                            {item.children && openDropdown === item.labelKey && (
                                <div className="absolute left-1/2 top-full z-50 min-w-[240px] -translate-x-1/2 overflow-hidden rounded-b-lg border-t-[3px] border-gold-500 bg-white py-2 shadow-xl ring-1 ring-black/5">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.slug}
                                            to="/$lang/pages/$slug"
                                            params={{
                                                lang,
                                                slug: child.slug,
                                            }}
                                            onClick={() => setOpenDropdown(null)}
                                            className="block border-l-[3px] border-transparent px-5 py-2.5 text-[15px] text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-700 [&.active]:border-brand-700 [&.active]:bg-brand-50 [&.active]:font-semibold [&.active]:text-brand-700"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Menu — a full-screen sheet over the site (and the bottom
                tab bar) with its own logo row and close button. Same entries
                as the desktop menu: groups expand to their sub-pages, plain
                items link directly. Contacts sit at the bottom. */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5">
                        <Link to="/$lang" params={{ lang }} aria-label={t('site.name')} onClick={closeMenu} className="flex items-center gap-3 py-3">
                            <Emblem className="h-10 w-10 shrink-0 bg-brand-700" />
                            <span className="text-[13px] font-bold leading-snug text-brand-700 sm:text-base">
                                {t('site.name1')}
                                <br />
                                {t('site.name2')}
                            </span>
                        </Link>
                        <button className="p-2 text-slate-600" aria-label={t('common.closeMenu')} onClick={closeMenu}>
                            <X size={28} />
                        </button>
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
        </>
    )
}

export default AppHeader
