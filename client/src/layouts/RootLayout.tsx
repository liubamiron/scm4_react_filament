import React from 'react'
import { Link } from '@tanstack/react-router'
import { Home, BookOpen, Info } from 'lucide-react'
import AppHeader from "../components/AppHeader.tsx";
import {AppFooter} from "../components/AppFooter.tsx";

interface RootLayoutProps {
    children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
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
                    <NavItem to="/" icon={<Home size={22} />} label="Acasă" />
                    <NavItem to="/pages" icon={<BookOpen size={22} />} label="Pagini" />
                    <NavItem to="/about" icon={<Info size={22} />} label="Despre Noi" />
                </div>
            </nav>

            <AppFooter />
        </div>
    )
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            to={to}
            className="flex flex-col items-center gap-1 text-slate-400 transition-colors [&.active]:text-blue-600 [&.active]:font-bold"
        >
            {icon}
            <span className="text-[10px] uppercase tracking-wider">{label}</span>
        </Link>
    )
}