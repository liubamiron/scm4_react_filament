import { useState } from 'react'
import {useTransparency} from "../features/pages/hook/useTransparency.ts";
import { localized, useLocale, useT } from "../i18n";

export function TransparencyPage() {
    const {data: categories, isLoading, error} = useTransparency()
    const [activeTab, setActiveTab] = useState<number | null>(null)
    const lang = useLocale()
    const t = useT()

    const storageUrl = import.meta.env.VITE_STORAGE_URL

    if (isLoading) return <div className="p-8 text-center">{t('common.loading')}</div>
    if (error || !categories) return <div className="p-8 text-center text-red-500">{t('common.loadError')}</div>

    // Set initial tab if not set
    if (activeTab === null && categories.length > 0) {
        setActiveTab(categories[0].id)
    }

    const currentCategory = categories.find(cat => cat.id === activeTab)

    return (
        <div className="container mx-auto px-4 py-10 space-y-12">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveTab(category.id)}
                        className={`px-6 py-2 border rounded-md transition-colors ${
                            activeTab === category.id
                                ? 'bg-blue-300 text-white border-blue-300'
                                : 'bg-white text-slate-700 border-blue-400 hover:bg-blue-50'
                        }`}
                    >
                        {localized(category, 'name', lang)}
                    </button>
                ))}
            </div>

            {/* Document List */}
            <div className="max-w-4xl mx-auto space-y-4">
                {currentCategory?.documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="flex items-center justify-between py-4 border-b border-slate-100"
                    >
                        <span className="text-lg text-slate-700 font-medium">
                            {localized(doc, 'title', lang)}
                        </span>
                        <a
                            href={`${storageUrl}/${doc.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-2 border border-blue-400 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                        >
                            {t('transparency.view')}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}
