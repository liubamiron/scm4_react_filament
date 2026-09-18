import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Route } from '../routes/$lang/events/index.tsx'
import { useEvents } from '../features/pages/hook/useEvents.ts'
import { PageStatus } from '../components/PageStatus.tsx'
import { localized, useLocale, useT } from '../i18n'
import { transformImageUrls } from '../utils/transformImageUrls.ts'
import { formatEventDate } from '../utils/formatEventDate.ts'
import type { EventItem } from '../types'

// Pagination is done on the client: `/events` returns the whole list (without
// bodies) in one small payload, which the home page reuses for "latest news".
const PAGE_SIZE = 8

export function EventsPage() {
    const { data: events, isLoading, error } = useEvents()
    const { page: requestedPage = 1 } = Route.useSearch()
    const t = useT()

    if (isLoading) return <PageStatus>{t('common.loading')}</PageStatus>
    if (error || !events) return <PageStatus error>{t('common.loadError')}</PageStatus>

    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const totalPages = Math.max(1, Math.ceil(sortedEvents.length / PAGE_SIZE))
    const page = Math.min(requestedPage, totalPages)
    const pageEvents = sortedEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
        <div className="page">
            <header>
                <h1 className="page-title">{t('events.title')}</h1>
                <div className="title-rule" />
            </header>

            {pageEvents.length === 0 && <PageStatus>{t('events.empty')}</PageStatus>}

            {pageEvents.length > 0 && (
                <div className="space-y-6">
                    {pageEvents.map((event, index) => (
                        <EventRow key={event.id} event={event} reversed={index % 2 === 1} />
                    ))}
                </div>
            )}

            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
        </div>
    )
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
    const lang = useLocale()
    const t = useT()

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    const pageLink = (n: number) => ({
        to: '/$lang/events' as const,
        params: { lang },
        // Page 1 is the canonical `/events` URL, without a query string.
        search: n > 1 ? { page: n } : {},
    })

    const arrowClass =
        'inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-brand-700 hover:bg-brand-50'

    return (
        <nav aria-label={t('events.pagination')} className="flex flex-wrap items-center justify-center gap-2">
            {page > 1 ? (
                <Link {...pageLink(page - 1)} aria-label={t('events.prevPage')} className={arrowClass}>
                    <ChevronLeft className="h-5 w-5" />
                </Link>
            ) : (
                <span className={`${arrowClass} opacity-40`}>
                    <ChevronLeft className="h-5 w-5" />
                </span>
            )}

            {pages.map((n) => (
                <Link
                    key={n}
                    {...pageLink(n)}
                    aria-current={n === page ? 'page' : undefined}
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold ${
                        n === page
                            ? 'bg-brand-700 text-white'
                            : 'border border-slate-200 text-brand-900 hover:bg-brand-50'
                    }`}
                >
                    {n}
                </Link>
            ))}

            {page < totalPages ? (
                <Link {...pageLink(page + 1)} aria-label={t('events.nextPage')} className={arrowClass}>
                    <ChevronRight className="h-5 w-5" />
                </Link>
            ) : (
                <span className={`${arrowClass} opacity-40`}>
                    <ChevronRight className="h-5 w-5" />
                </span>
            )}
        </nav>
    )
}

function useEventCardData(event: EventItem) {
    const lang = useLocale()
    const storageUrl = import.meta.env.VITE_STORAGE_URL

    return {
        lang,
        title: localized(event, 'title', lang),
        excerpt: transformImageUrls(localized(event, 'description', lang)),
        imageUrl: event.image ? `${storageUrl}/${event.image.replace(/^\/+/, '')}` : null,
    }
}

// Fills a fixed-size box on a tinted background. The image is shown whole
// (never cropped) and only ever scaled down, never up, so small uploads
// keep their quality.
function EventImage({ src, alt, eager = false }: { src: string | null; alt: string; eager?: boolean }) {
    const t = useT()

    return (
        <div className="flex h-full w-full items-center justify-center overflow-hidden bg-brand-50">
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    loading={eager ? 'eager' : 'lazy'}
                    className="max-h-full max-w-full object-contain"
                />
            ) : (
                <span className="text-slate-400">{t('common.noImage')}</span>
            )}
        </div>
    )
}

// Image boxes get explicit heights (not aspect-ratio) because `max-h-full`
// on the image only works against a definite height.
// Events page row: every row has the same height and the same image-column
// width; `reversed` puts the image on the right so rows alternate sides.
function EventRow({ event, reversed }: { event: EventItem; reversed: boolean }) {
    const { lang, title, excerpt, imageUrl } = useEventCardData(event)
    const t = useT()

    return (
        <Link to="/$lang/events/$slug" params={{ lang, slug: event.slug }} className="group block">
            <article
                className={`card grid grid-cols-1 overflow-hidden hover:shadow-md lg:h-[340px] ${
                    reversed
                        ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'
                        : 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'
                }`}
            >
                <div className={`h-56 sm:h-72 lg:h-full ${reversed ? 'lg:order-2' : ''}`}>
                    <EventImage src={imageUrl} alt={title} />
                </div>

                <div className="flex min-h-0 flex-col justify-center p-6 md:p-8">
                    <time dateTime={event.date} className="text-sm font-semibold text-brand-700">
                        {formatEventDate(event.date, lang)}
                    </time>

                    <h2 className="mt-2 text-xl font-bold leading-tight text-brand-900 group-hover:text-brand-700 line-clamp-2 md:text-2xl">
                        {title}
                    </h2>

                    <div
                        className="content-prose mt-4 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                    />

                    <span className="link-accent mt-6">
                        {t('events.readMore')}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
                    </span>
                </div>
            </article>
        </Link>
    )
}

// Vertical card for the home page "latest news" grid.
export function EventCard({ event }: { event: EventItem }) {
    const { lang, title, excerpt, imageUrl } = useEventCardData(event)
    const t = useT()

    return (
        <Link to="/$lang/events/$slug" params={{ lang, slug: event.slug }} className="group block h-full">
            <article className="card flex h-full flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-md">
                <div className="h-56 w-full">
                    <EventImage src={imageUrl} alt={title} />
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <time dateTime={event.date} className="text-sm font-semibold text-brand-700">
                        {formatEventDate(event.date, lang)}
                    </time>

                    <h3 className="mt-2 text-lg font-bold leading-snug text-brand-900 group-hover:text-brand-700 line-clamp-3">
                        {title}
                    </h3>

                    <div
                        className="content-prose mt-3 text-sm line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                    />

                    <span className="link-accent mt-auto pt-5">
                        {t('events.readMore')}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1" />
                    </span>
                </div>
            </article>
        </Link>
    )
}
