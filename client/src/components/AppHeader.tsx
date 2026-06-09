import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Globe, Menu, X } from 'lucide-react'
import {useLanguageStore} from "../store/languageStore.ts";

function AppHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [isLangOpen, setIsLangOpen] = useState(false)

    const languages = [
        { code: 'ro', label: 'RO' },
        { code: 'ru', label: 'RU' },
    ]

    const { language, setLanguage } = useLanguageStore()

    const navigation = [
        {
            name: 'Despre Noi',
            href: '/about',
            children: [
                { title_ro: 'Istoric', slug: 'istoric' },
                { title_ro: 'Echipa', slug: 'echipa' },
                { title_ro: 'Misiunea', slug: 'misiunea' },
            ],
        },
        { name: 'Transparență', href: '/transparenta' },
        {
            name: 'Servicii',
            href: '/servicii',
            children: [
                { title_ro: 'Serviciu Geriatric', slug: 'serviciu-geriatric' },
                { title_ro: 'Îngrijiri Paliative', slug: 'ingrijiri-paliative' },
                { title_ro: 'Pentru Pacienți', slug: 'pentru-pacienti' },
            ],
        },
        { name: 'Secții', href: '/sections' },
        { name: 'Legislație', href: '/legislation' },
        { name: 'Evenimente', href: '/events' },
        { name: 'Donații', href: '/donations' },
        {
            name: 'Parteneriat',
            href: '/partnership',
            children: [
                { title_ro: 'Colaborare', slug: 'colaborare' },
                { title_ro: 'Voluntariat', slug: 'voluntariat' },
            ]
        },
    ]

    const toggleDropdown = (name: string) => {
        setOpenDropdown((prev) => (prev === name ? null : name))
    }


    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-[#8ec2d6] py-3 flex justify-between items-center font-medium text-[#003366] px-5">
        <span>
          Instituția Medico-Sanitară Publică Spitalul Clinic Municipal Nr.4
        </span>
                <div className="relative">
                    <button
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="flex items-center gap-2 hover:opacity-80"
                    >
                        <Globe size={14} />

                        <span className="font-semibold uppercase">
            {language}
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
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as 'ro' | 'ru')
                                        setIsLangOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-slate-100 ${
                                        language === lang.code
                                            ? 'font-bold text-blue-600'
                                            : ''
                                    }`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="mx-auto flex items-center justify-between pr-2">
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/img/scm4_logo.jpg"
                        alt="IMSP SCM Nr.4"
                        className="w-62.5 h-15.5"
                    />
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-1">
                    {navigation.map((item) => (
                        <li key={item.name} className="relative">
                            {/* MAIN BUTTON */}
                            {item.children ? (
                                <button
                                    onClick={() => toggleDropdown(item.name)}
                                    className="py-2 px-2 font-medium text-slate-600 hover:text-[#0e67b9] hover:bg-slate-100 rounded-md
                                    flex items-center gap-1"
                                >
                                    {item.name}
                                    <ChevronDown
                                        size={14}
                                        className={`text-slate-400 transition-transform ${
                                            openDropdown === item.name ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            ) : (
                                <Link
                                    to={item.href}
                                    className="px-2 py-2 font-medium text-slate-600 hover:text-[#0e67b9] hover:bg-slate-100 rounded-md"
                                >
                                    {item.name}
                                </Link>
                            )}

                            {/* DROPDOWN */}
                            {item.children && openDropdown === item.name && (
                                <div className="absolute left-0 top-full mt-2 bg-white border border-slate-100 shadow-xl rounded-lg py-2 min-w-[180px] z-50">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.slug}
                                            to="/pages/$slug"
                                            params={{
                                                slug: child.slug,
                                            }}
                                            onClick={() => setOpenDropdown(null)}
                                            className="block px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                        >
                                            {child.title_ro}
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
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-4 py-3 font-medium text-slate-700 rounded-xl"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    )
}

export default AppHeader