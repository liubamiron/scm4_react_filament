import { useState } from 'react'
import { FileText } from 'lucide-react'
import {useTransparency} from "../features/pages/hook/useTransparency.ts";
import { PageStatus } from '../components/PageStatus.tsx'
import { localized, useLocale, useT } from "../i18n";

export function TransparencyPage() {
    const {data: categories, isLoading, error} = useTransparency()
    const [activeTab, setActiveTab] = useState<number | null>(null)
    const lang = useLocale()
    const t = useT()

    const storageUrl = import.meta.env.VITE_STORAGE_URL

    if (isLoading) return <PageStatus>{t('common.loading')}</PageStatus>
    if (error || !categories) return <PageStatus error>{t('common.loadError')}</PageStatus>

    // Set initial tab if not set
    if (activeTab === null && categories.length > 0) {
        setActiveTab(categories[0].id)
    }

    const currentCategory = categories.find(cat => cat.id === activeTab)

    return (
        <div className="page">
            <header>
                <h1 className="page-title">{t('nav.transparency')}</h1>
                <div className="title-rule" />
            </header>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                            activeTab === category.id
                                ? 'bg-brand-700 text-white shadow-sm'
                                : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700'
                        }`}
                    >
                        {localized(category, 'name', lang)}
                    </button>
                ))}
            </div>

            {/* Document list */}
            <div className="card divide-y divide-slate-100">
                {currentCategory?.documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <span className="flex items-start gap-3 font-medium text-slate-700">
                            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                            {localized(doc, 'title', lang)}
                        </span>
                        <a
                            href={`${storageUrl}/${doc.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline shrink-0 self-start sm:self-auto"
                        >
                            {t('transparency.view')}
                        </a>
                    </div>
                ))}
                {currentCategory && currentCategory.documents.length === 0 && (
                    <p className="px-5 py-8 text-center text-slate-500">{t('transparency.empty')}</p>
                )}
            </div>
        </div>
    )
}
