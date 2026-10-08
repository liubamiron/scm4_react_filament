import { ExternalLink, FileText } from 'lucide-react'
import { useLawDocuments } from '../features/pages/hook/useLawDocuments.ts'
import { PageStatus } from '../components/PageStatus.tsx'
import { localized, useLocale, useT } from '../i18n'
import type { LawDocument } from '../types'

const storageUrl = import.meta.env.VITE_STORAGE_URL

// An uploaded PDF wins over the external link when both are filled in.
function documentHref(doc: LawDocument) {
    return doc.file_path ? `${storageUrl}/${doc.file_path}` : doc.url
}

export function LegislationPage() {
    const { data: documents, isLoading, error } = useLawDocuments()
    const lang = useLocale()
    const t = useT()

    if (isLoading) return <PageStatus>{t('common.loading')}</PageStatus>
    if (error || !documents) return <PageStatus error>{t('common.loadError')}</PageStatus>

    return (
        <div className="page">
            <header>
                <h1 className="page-title">{t('nav.legislation')}</h1>
                <div className="title-rule" />
            </header>

            <div className="card divide-y divide-slate-100">
                {documents.map((doc) => {
                    const href = documentHref(doc)
                    const Icon = doc.file_path ? FileText : ExternalLink

                    return (
                        <div
                            key={doc.id}
                            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <span className="flex items-start gap-3 font-medium text-slate-700">
                                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />
                                {localized(doc, 'title', lang)}
                            </span>
                            {href && (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline shrink-0 self-start sm:self-auto"
                                >
                                    {t('transparency.view')}
                                </a>
                            )}
                        </div>
                    )
                })}
                {documents.length === 0 && (
                    <p className="px-5 py-8 text-center text-slate-500">{t('legislation.empty')}</p>
                )}
            </div>
        </div>
    )
}
