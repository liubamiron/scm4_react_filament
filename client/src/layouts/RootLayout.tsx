import React from 'react'
import { Link } from '@tanstack/react-router'
import { Home, CalendarDays, Info, Phone } from 'lucide-react'
import AppHeader from "../components/AppHeader.tsx";
import {AppFooter} from "../components/AppFooter.tsx";
import { useLocale, useT } from '../i18n'

interface RootLayoutProps {
    children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
    const lang = useLocale()
    const t = useT()

    // Extra bottom padding on phones keeps the footer clear of the fixed tab bar.
    return (
        <div className="container_lm mx-auto pb-24 md:pb-12">
            {/* 1. Top Navigation Bar (Fixed) */}
           <AppHeader />

            {/* 2. Main Content Scroll Area — pages supply their own vertical rhythm via `.page`. */}
            {/* px-5 matches the header/footer inset so titles line up with the bar text. */}
            <main className="min-h-[60vh] px-5">
                {children}
            </main>

            {/* Phone tab bar — shortcuts only; the full menu is the header hamburger. */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200 safe-bottom">
                <div className="flex justify-around items-center h-16 px-4">
                    <NavItem to="/$lang" params={{ lang }} exact icon={<Home size={22} />} label={t('nav.home')} />
                    <NavItem to="/$lang/about" params={{ lang }} icon={<Info size={22} />} label={t('nav.about')} />
                    <NavItem to="/$lang/events" params={{ lang }} icon={<CalendarDays size={22} />} label={t('nav.events')} />
                    <NavItem to="/$lang/pages/$slug" params={{ lang, slug: 'contacte' }} icon={<Phone size={22} />} label={t('nav.contacts')} />
                </div>
            </nav>

            <AppFooter />
        </div>
    )
}

// `exact` stops the home tab from lighting up on every page under `/$lang`.
function NavItem({ to, params, icon, label, exact = false }: { to: string, params: Record<string, string>, icon: React.ReactNode, label: string, exact?: boolean }) {
    return (
        <Link
            to={to}
            params={params}
            activeOptions={{ exact }}
            className="flex flex-col items-center gap-1 text-slate-400 [&.active]:text-brand-900 [&.active]:font-bold"
        >
            {icon}
            <span className="text-[10px] uppercase tracking-wider">{label}</span>
        </Link>
    )
}
