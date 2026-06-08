import { Link } from "@tanstack/react-router";
import {usePartners} from "../features/pages/hook/usePartners.ts";

export function AppFooter() {
    const { data, isLoading } = usePartners()

    const storageUrl = import.meta.env.VITE_STORAGE_URL;

    if (isLoading) {
        return (
            <div className="flex gap-4">
                Loading partners...
            </div>
        )
    }

    return (
        <footer className="bg-white pt-12 pb-6 border-t border-slate-100">
                {/* 1. Partners Section (Logos) */}
            <div className="flex flex-wrap gap-6 items-center justify-center mb-6">
                {data?.map((partner) => (
                    <a
                        key={partner.id}
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center p-2"
                    >
                        <img
                            src={`${storageUrl}/${partner.logo}`}
                            alt={partner.name}
                            className="h-auto w-30 border border-gray-200 rounded-lg p-2"
                        />
                    </a>
                ))}
            </div>

                {/* 2. Navigation Links */}
                <nav className="flex justify-center gap-6 text-slate-600 font-medium mb-8">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <Link to="/pages/$slug" params={{ slug: 'donatii' }} className="hover:text-blue-600 transition-colors">Donații</Link>
                    <Link to="/pages/$slug" params={{ slug: 'contacte' }} className="hover:text-blue-600 transition-colors">Contacte</Link>
                </nav>

                {/* 3. Bottom Copyright */}
                <div className="text-center border-t border-slate-50 pt-8">
                    <p className="text-slate-500 text-sm">
                        Instituția Medico-Sanitară Publică Spitalul Clinic Municipal Nr.4
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                        © {new Date().getFullYear()} — Toate drepturile rezervate.
                    </p>
                </div>
        </footer>
    );
}