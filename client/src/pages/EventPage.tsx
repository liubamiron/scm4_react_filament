import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Route } from '../routes/$lang/events/$slug'
import { useEvent } from '../features/pages/hook/useEvents.ts'
import { transformImageUrls } from '../utils/transformImageUrls'
import { PageStatus } from '../components/PageStatus.tsx'
import { localized, useLocale, useT } from '../i18n'
import { formatEventDate } from '../utils/formatEventDate.ts'

export function EventPage() {
    const { slug } = Route.useParams()
    const lang = useLocale()
    const t = useT()

    const { data: event, isLoading, error } = useEvent(slug)

    if (isLoading) {
        return <PageStatus>{t('common.loadingContent')}</PageStatus>
    }

    if (error || !event) {
        return <PageStatus error>{t('common.notFound')}</PageStatus>
    }

    const title = localized(event, 'title', lang)

    return (
        <div className="page">
            <Link to="/$lang/events" params={{ lang }} className="link-accent">
                <ArrowLeft className="h-4 w-4" />
                {t('events.back')}
            </Link>

            <header>
                <time dateTime={event.date} className="text-sm font-semibold text-brand-700">
                    {formatEventDate(event.date, lang)}
                </time>
                <h1 className="page-title mt-2">{title}</h1>
                <div className="title-rule" />
            </header>

            <article
                className="content-prose"
                dangerouslySetInnerHTML={{
                    __html: transformImageUrls(localized(event, 'content', lang)),
                }}
            />
        </div>
    )
}
