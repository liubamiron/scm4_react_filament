import { Link } from '@tanstack/react-router'
import { useEvents } from '../features/pages/hook/useEvents.ts'
import { localized, useLocale, useT } from '../i18n'
import { transformImageUrls } from '../utils/transformImageUrls.ts'
import { formatEventDate } from '../utils/formatEventDate.ts'

export function EventsPage() {
    const { data: events, isLoading, error } = useEvents()
    const lang = useLocale()
    const t = useT()

    const storageUrl = import.meta.env.VITE_STORAGE_URL

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-slate-500">
                    {t('common.loading')}
                </p>
            </div>
        )
    }

    if (error || !events) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-red-500">
                    {t('common.loadError')}
                </p>
            </div>
        )
    }

    if (events.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <p className="text-center text-slate-500">
                    {t('events.empty')}
                </p>
            </div>
        )
    }

    const sortedEvents = [...events].sort(
        (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
    )

    const featuredEvent = sortedEvents[0]
    const otherEvents = sortedEvents.slice(1)

    const getImageUrl = (image?: string | null) => {
        if (!image) return null

        return `${storageUrl}/${image.replace(/^\/+/, '')}`
    }

    return (
        <main className="bg-slate-50 min-h-screen">
            <div className="container mx-auto px-4 py-10 md:py-14">

                {/* Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="h-8 w-1 rounded-full bg-blue-600" />

                        <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                            {t('events.title')}
                        </span>
                    </div>

                    {/*<h1 className="text-3xl md:text-4xl font-extrabold text-[#003366]">*/}
                    {/*    {t('events.title')}*/}
                    {/*</h1>*/}

                    <div className="mt-4 h-px w-full bg-slate-200" />
                </header>

                {/* Featured article */}
                <Link
                    to="/$lang/events/$slug"
                    params={{
                        lang,
                        slug: featuredEvent.slug,
                    }}
                    className="group block mb-12"
                >
                    <article className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl
                    overflow-hidden shadow-sm border border-slate-100">

                        {/* Image */}
                        <div className="relative h-72 sm:h-96 lg:h-[420px] overflow-hidden bg-slate-200 flex items-center justify-center">
                            {getImageUrl(featuredEvent.image) ? (
                                <img
                                    src={getImageUrl(featuredEvent.image)!}
                                    alt={localized(featuredEvent, 'title', lang)}
                                    className="max-w-[500px] max-h-full w-auto h-auto object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    {t('common.noImage')}
                                </div>
                            )}

                            <div className="absolute top-5 left-5">
        <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow">
            {t('events.title')}
        </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center p-7 md:p-10">
                            <time
                                dateTime={featuredEvent.date}
                                className="text-sm font-medium text-blue-600"
                            >
                                {formatEventDate(
                                    featuredEvent.date,
                                    lang
                                )}
                            </time>

                            <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight text-[#003366] group-hover:text-blue-600 transition-colors">
                                {localized(
                                    featuredEvent,
                                    'title',
                                    lang
                                )}
                            </h2>

                            <div
                                className="mt-5 prose prose-slate max-w-none line-clamp-4"
                                dangerouslySetInnerHTML={{
                                    __html: transformImageUrls(
                                        localized(
                                            featuredEvent,
                                            'description',
                                            lang
                                        )
                                    ),
                                }}
                            />

                            <div className="mt-8">
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                                    {t('events.readMore')}
                                    <span className="text-lg transition-transform group-hover:translate-x-1">
                                        →
                                    </span>
                                </span>
                            </div>
                        </div>
                    </article>
                </Link>

                {/* Articles */}
                {otherEvents.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="hidden sm:block h-px flex-1 ml-6 bg-slate-200" />
                        </div>

                        <div className="space-y-8">
                            {otherEvents.map((event) => {
                                const title = localized(event, 'title', lang)
                                const imageUrl = getImageUrl(event.image)

                                return (
                                    <Link
                                        key={event.id}
                                        to="/$lang/events/$slug"
                                        params={{
                                            lang,
                                            slug: event.slug,
                                        }}
                                        className="group block"
                                    >
                                        <article className="grid grid-cols-1 lg:grid-cols-[30%_70%] bg-white rounded-2xl  border border-slate-100">

                                            <div className="relative h-72 sm:h-96 lg:h-[320px]
                                            overflow-hidden bg-slate-200 flex items-center justify-center">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={title}
                                                        className="max-w-[200px] max-h-full w-auto h-auto object-contain"
                                                    />
                                                ) : (
                                                    <div className="text-slate-400">
                                                        {t('common.noImage')}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col justify-center p-7 md:p-10">
                                                <time
                                                    dateTime={event.date}
                                                    className="text-sm font-medium text-blue-600"
                                                >
                                                    {formatEventDate(event.date, lang)}
                                                </time>

                                                <h2 className="mt-3 text-2xl font-bold leading-tight text-[#003366] group-hover:text-blue-600 transition-colors">
                                                    {title}
                                                </h2>

                                                <div
                                                    className="mt-5 prose prose-slate max-w-none line-clamp-4"
                                                    dangerouslySetInnerHTML={{
                                                        __html: transformImageUrls(
                                                            localized(event, 'description', lang)
                                                        ),
                                                    }}
                                                />

                                                <div className="mt-8">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                                {t('events.readMore')}
                                <span className="text-lg group-hover:translate-x-1 transition-transform">
                                    →
                                </span>
                            </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}