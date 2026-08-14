import { Link } from '@tanstack/react-router'
import { Route } from '../routes/$lang/events/$slug'
import { useEvent } from '../features/pages/hook/useEvents.ts'
import { transformImageUrls } from '../utils/transformImageUrls'
import { localized, useLocale, useT } from '../i18n'
import { formatEventDate } from '../utils/formatEventDate.ts'

export function EventPage() {
    const { slug } = Route.useParams()
    const lang = useLocale()
    const t = useT()

    const { data: event, isLoading, error } = useEvent(slug)

    // const storageUrl = import.meta.env.VITE_STORAGE_URL

    if (isLoading) {
        return <div className="p-8 text-center animate-pulse">{t('common.loadingContent')}</div>
    }

    if (error || !event) {
        return <div className="p-8 text-center text-red-500">{t('common.notFound')}</div>
    }

    const title = localized(event, 'title', lang)

    return (
        <div className="container mx-auto px-4 py-10 space-y-6 pb-12">
            <Link
                to="/$lang/events"
                params={{ lang }}
                className="inline-block text-blue-500 hover:underline"
            >
                ← {t('events.back')}
            </Link>

            <header className="space-y-2">


                <h1 className="text-3xl font-extrabold text-[#003366]">{title}</h1>

                <div className="h-0.5 w-20 bg-blue-400 rounded-full" />
            </header>

            {/*{event.image && (*/}
            {/*    <img*/}
            {/*        src={`${storageUrl}/${event.image}`}*/}
            {/*        alt={title}*/}
            {/*        className="w-auto max-h-[350px] object-cover rounded-xl"*/}
            {/*    />*/}
            {/*)}*/}

            <article
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{
                    __html: transformImageUrls(localized(event, 'content', lang)),
                }}
            />

            <time className="text-sm text-blue-500" dateTime={event.date}>
                {formatEventDate(event.date, lang)}
            </time>
        </div>
    )
}
