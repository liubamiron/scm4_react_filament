import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal} from 'react'
import {useTransparency} from "../features/pages/hook/useTransparency.ts";

export function TransparencyPage() {
    const {data: categories, isLoading, error} = useTransparency()
    const [activeTab, setActiveTab] = useState<number | null>(null)

    if (isLoading) return <div className="p-8 text-center">Se încarcă...</div>
    if (error || !categories) return <div className="p-8 text-center text-red-500">Eroare la încărcare.</div>

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
                        {category.name_ro}
                    </button>
                ))}
            </div>

            {/* Content Title */}
            {/*<div className="text-center">*/}
            {/*    <h1 className="text-4xl font-light text-slate-800">*/}
            {/*        {currentCategory?.name_ro}*/}
            {/*    </h1>*/}
            {/*</div>*/}

            {/* Document List */}
            <div className="max-w-4xl mx-auto space-y-4">
                {currentCategory?.documents.map((doc: { id: Key | null | undefined; title_ro: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; file_path: string | undefined; }) => (
                    <div
                        key={doc.id}
                        className="flex items-center justify-between py-4 border-b border-slate-100"
                    >
                        <span className="text-lg text-slate-700 font-medium">
                            {doc.title_ro}
                        </span>
                        <a
                            href={doc.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-2 border border-blue-400 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
                        >
                            Vizualizează
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}