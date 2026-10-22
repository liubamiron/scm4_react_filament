import { Link } from '@tanstack/react-router'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Route } from '../routes/$lang/events/index.tsx'
import { useEvents } from '../features/pages/hook/useEvents.ts'
import { PageStatus } from '../components/PageStatus.tsx'
import { localized, useLocale, useT } from '../i18n'
import { transformImageUrls } from '../utils/transformImageUrls.ts'
import { formatEventDate } from '../utils/formatEventDate.ts'
import { htmlToText } from '../utils/htmlToText.ts'
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

// Fills its parent box. The image is shown whole (never cropped), centered
// inside `padding`, and only ever scaled down, never up, so small uploads keep
// their quality. A blurred copy of the same image fills the space around it,
// so portrait and landscape photos both sit in a filled, even frame.
// The inner layer is absolutely positioned so `max-h-full` on the image always
// resolves against a definite height.
function EventImage({ src, alt, padding = 'p-4' }: { src: string | null; alt: string; padding?: string }) {
    const t = useT()

    return (
        <div className="relative h-full w-full overflow-hidden bg-brand-50">
            {src ? (
                <>
                    <img
                        src={src}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl"
                    />
                    <div className={`absolute inset-0 flex items-center justify-center ${padding}`}>
                        <img
                            src={src}
                            alt={alt}
                            loading="lazy"
                            decoding="async"
                            className="max-h-full max-w-full rounded object-contain"
                        />
                    </div>
                </>
            ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    {t('common.noImage')}
                </div>
            )}
        </div>
    )
}

// Events page row: every row has the same height and the same fixed-width
// image column; `reversed` puts the image on the right so rows alternate sides.
function EventRow({ event, reversed }: { event: EventItem; reversed: boolean }) {
    const { lang, title, excerpt, imageUrl } = useEventCardData(event)
    const t = useT()

    return (
        <Link to="/$lang/events/$slug" params={{ lang, slug: event.slug }} className="group block">
            <article
                className={`card grid grid-cols-1 overflow-hidden hover:border-brand-700 md:h-[220px] ${
                    reversed
                        ? 'md:grid-cols-[minmax(0,1fr)_300px]'
                        : 'md:grid-cols-[300px_minmax(0,1fr)]'
                }`}
            >
                <div className={`h-52 md:h-full ${reversed ? 'md:order-2' : ''}`}>
                    <EventImage src={imageUrl} alt={title} padding="p-4" />
                </div>

                <div className="flex min-h-0 flex-col justify-center p-5 md:px-8 md:py-6">
                    <time dateTime={event.date} className="text-sm font-semibold text-brand-700">
                        {formatEventDate(event.date, lang)}
                    </time>

                    <h2 className="mt-1 font-serif text-lg font-semibold leading-tight text-brand-900 group-hover:text-brand-700 line-clamp-2 md:text-xl">
                        {title}
                    </h2>

                    <div
                        className="content-prose mt-2 text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: excerpt }}
                    />

                    <span className="link-accent mt-3">
                        {t('events.readMore')}
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </div>
            </article>
        </Link>
    )
}

// Thin full-width row for the home page "latest news" list: thumbnail beside
// date, title, a short plain-text excerpt and a "read more" link.
export function EventListItem({ event }: { event: EventItem }) {
    const { lang, title, imageUrl } = useEventCardData(event)
    const t = useT()
    const excerpt = htmlToText(localized(event, 'description', lang))

    return (
        <Link to="/$lang/events/$slug" params={{ lang, slug: event.slug }} className="group block">
            <article className="card flex items-center gap-6 overflow-hidden p-4 hover:border-brand-700">
                <div className="h-24 w-32 shrink-0 overflow-hidden rounded-md sm:h-28 sm:w-44">
                    <EventImage src={imageUrl} alt={title} padding="p-1.5" />
                </div>

                <div className="min-w-0 flex-1">
                    <time dateTime={event.date} className="text-xs font-semibold text-brand-700">
                        {formatEventDate(event.date, lang)}
                    </time>
                    <h3 className="mt-0.5 font-bold leading-snug text-brand-900 group-hover:text-brand-700 line-clamp-1">
                        {title}
                    </h3>
                    {excerpt && (
                        <p className="mt-1 text-sm text-slate-600 line-clamp-1">{excerpt}</p>
                    )}
                </div>

                <span className="link-accent hidden shrink-0 pr-3 md:inline-flex">
                    {t('events.readMore')}
                    <ArrowRight className="h-4 w-4" />
                </span>
            </article>
        </Link>
    )
}
