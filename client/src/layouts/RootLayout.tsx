import React from 'react'
import { Link } from '@tanstack/react-router'
import { Home, BookOpen, Info } from 'lucide-react'
import AppHeader from "../components/AppHeader.tsx";
import {AppFooter} from "../components/AppFooter.tsx";
import { useLocale, useT } from '../i18n'

interface RootLayoutProps {
    children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
    const lang = useLocale()
    const t = useT()

    return (
        <div className="container_lm mx-auto pb-12">
            {/* 1. Top Navigation Bar (Fixed) */}
           <AppHeader />

            {/* 2. Main Content Scroll Area */}
            <main className="md:px-0 px-5">
                {children}
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 safe-bottom">
                <div className="flex justify-around items-center h-16 px-4">
                    <NavItem to="/$lang" params={{ lang }} icon={<Home size={22} />} label={t('nav.home')} />
                    <NavItem to="/$lang/pages" params={{ lang }} icon={<BookOpen size={22} />} label={t('nav.pages')} />
                    <NavItem to="/$lang/about" params={{ lang }} icon={<Info size={22} />} label={t('nav.about')} />
                </div>
            </nav>

            <AppFooter />
        </div>
    )
}

function NavItem({ to, params, icon, label }: { to: string, params: Record<string, string>, icon: React.ReactNode, label: string }) {
    return (
        <Link
            to={to}
            params={params}
            className="flex flex-col items-center gap-1 text-slate-400 transition-colors [&.active]:text-blue-600 [&.active]:font-bold"
        >
            {icon}
            <span className="text-[10px] uppercase tracking-wider">{label}</span>
        </Link>
    )
}
