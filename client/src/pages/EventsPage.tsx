import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useEvents } from '../features/pages/hook/useEvents.ts'
import { PageStatus } from '../components/PageStatus.tsx'
import { localized, useLocale, useT } from '../i18n'
import { transformImageUrls } from '../utils/transformImageUrls.ts'
import { formatEventDate } from '../utils/formatEventDate.ts'
import type { EventItem } from '../types'

export function EventsPage() {
    const { data: events, isLoading, error } = useEvents()
    const t = useT()

    if (isLoading) return <PageStatus>{t('common.loading')}</PageStatus>
    if (error || !events) return <PageStatus error>{t('common.loadError')}</PageStatus>

    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const [featuredEvent, ...otherEvents] = sortedEvents

    return (
        <div className="page">
            <header>
                <h1 className="page-title">{t('events.title')}</h1>
                <div className="title-rule" />
            </header>

            {!featuredEvent && <PageStatus>{t('events.empty')}</PageStatus>}

            {featuredEvent && <EventCard event={featuredEvent} featured />}

            {otherEvents.length > 0 && (
                <div className="space-y-6">
                    {otherEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    )
}

// One card layout for both the list page and the home page: image on the
// left, text on the right; `featured` splits 50/50 with a taller image.
export function EventCard({ event, featured = false }: { event: EventItem; featured?: boolean }) {
    const lang = useLocale()
    const t = useT()
    const storageUrl = import.meta.env.VITE_STORAGE_URL

    const title = localized(event, 'title', lang)
    const imageUrl = event.image ? `${storageUrl}/${event.image.replace(/^\/+/, '')}` : null

    return (
        <Link to="/$lang/events/$slug" params={{ lang, slug: event.slug }} className="group block">
            <article
                className={`card grid grid-cols-1 overflow-hidden transition hover:shadow-md ${
                    featured ? 'lg:grid-cols-2' : 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'
                }`}
            >
                <div
                    className={`flex items-center justify-center overflow-hidden bg-brand-50 ${
                        featured ? 'h-64 sm:h-80 lg:h-full lg:min-h-[380px]' : 'h-56 lg:h-full lg:min-h-[240px]'
                    }`}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={title}
                            loading={featured ? 'eager' : 'lazy'}
                            className="h-full w-full object-contain p-6"
                        />
                    ) : (
                        <span className="text-slate-400">{t('common.noImage')}</span>
                    )}
                </div>

                <div className="flex flex-col justify-center p-6 md:p-8">
                    <time dateTime={event.date} className="text-sm font-semibold text-brand-700">
                        {formatEventDate(event.date, lang)}
                    </time>

                    <h2
                        className={`mt-2 font-bold leading-tight text-brand-900 transition group-hover:text-brand-700 ${
                            featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
                        }`}
                    >
                        {title}
                    </h2>

                    <div
                        className="content-prose mt-4 line-clamp-4"
                        dangerouslySetInnerHTML={{
                            __html: transformImageUrls(localized(event, 'description', lang)),
                        }}
                    />

                    <span className="link-accent mt-6">
                        {t('events.readMore')}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                </div>
            </article>
        </Link>
    )
}
