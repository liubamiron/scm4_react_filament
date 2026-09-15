import { usePagesByType } from '../features/pages/hook/usePagesByType.ts'
import { PageCard } from '../components/PageCard.tsx'
import { PageStatus } from '../components/PageStatus.tsx'
import { useT } from '../i18n'

// Lists every CMS page filed under "Despre noi" (Page.type = 'about').
export function AboutPage() {
    const { data: pages, isLoading, error } = usePagesByType('about')
    const t = useT()

    return (
        <div className="page">
            <header>
                <h1 className="page-title">{t('about.title')}</h1>
                <div className="title-rule" />
            </header>

            {isLoading && <PageStatus>{t('common.loading')}</PageStatus>}
            {error && <PageStatus error>{t('common.loadError')}</PageStatus>}
            {pages && pages.length === 0 && <PageStatus>{t('about.empty')}</PageStatus>}

            {pages && pages.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {pages.map((page) => (
                        <PageCard key={page.id} page={page} />
                    ))}
                </div>
            )}
        </div>
    )
}
