import { useFeaturedServices } from "../features/pages/hook/useFeaturedPages.ts";
import { Link } from "@tanstack/react-router";
import { localized, useLocale, useT } from "../i18n";
import { transformImageUrls } from "../utils/transformImageUrls.ts";
import { useEvents } from "../features/pages/hook/useEvents.ts";
import { formatEventDate } from "../utils/formatEventDate.ts";

const LATEST_NEWS_COUNT = 3;

export function HomePage() {
    const { data: services, isLoading } = useFeaturedServices();
    const { data: events } = useEvents();

    const lang = useLocale();
    const t = useT();

    const storageUrl = import.meta.env.VITE_STORAGE_URL;

    const getImageUrl = (image?: string | null) => {
        if (!image) return null;

        return `${storageUrl}/${image.replace(/^\/+/, "")}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-slate-500">
                    {t("common.loading")}
                </p>
            </div>
        );
    }

    const featuredServices = services?.filter(
        (item) =>
            item.is_featured === 1 ||
            item.is_featured === true
    );

    const latestNews = [...(events ?? [])]
        .sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
        )
        .slice(0, LATEST_NEWS_COUNT);

    return (
        <main className="bg-slate-50 min-h-screen py-16">
            <div className="container mx-auto px-4">

                {/* Services */}
                <section>
                    <h2 className="text-4xl font-bold text-center text-[#003366] mb-12">
                        {t("home.servicesTitle")}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredServices?.map((service) => {
                            const title = localized(
                                service,
                                "title",
                                lang
                            );

                            return (
                                <Link
                                    key={service.id}
                                    to="/$lang/pages/$slug"
                                    params={{
                                        lang,
                                        slug: service.slug,
                                    }}
                                    className="block group"
                                >
                                    <article className="bg-white rounded-xl shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow duration-300">
                                        <div className="h-56 w-full overflow-hidden bg-slate-200">
                                            {service.image ? (
                                                <img
                                                    src={`${storageUrl}/${service.image}`}
                                                    alt={title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-400">
                                                    {t("common.noImage")}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-bold text-[#003366]">
                                                {title}
                                            </h3>

                                            <div className="w-16 h-0.5 bg-blue-500 mx-auto my-4" />

                                            <div
                                                className="prose prose-slate max-w-none line-clamp-3"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        transformImageUrls(
                                                            localized(
                                                                service,
                                                                "content",
                                                                lang
                                                            )
                                                        ),
                                                }}
                                            />
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Latest news */}
                {latestNews.length > 0 && (
                    <section className="mt-20">

                        {/* Header */}
                        <div className="flex items-end justify-between gap-6 mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#003366]">
                                {t("home.newsTitle")}
                            </h2>

                            <Link
                                to="/$lang/events"
                                params={{ lang }}
                                className="shrink-0 text-sm font-semibold text-blue-600 hover:underline"
                            >
                                {t("home.newsAll")} →
                            </Link>
                        </div>

                        {/* News */}
                        <div className="space-y-8">
                            {latestNews.map((event, index) => {
                                const title = localized(
                                    event,
                                    "title",
                                    lang
                                );

                                const imageUrl = getImageUrl(
                                    event.image
                                );

                                const isReversed = index % 2 === 1;

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
                                        <article
                                            className={`
                                                grid grid-cols-1
                                                ${isReversed
                                                ? "lg:grid-cols-[70%_30%]"
                                                : "lg:grid-cols-[30%_70%]"
                                            }
                                                bg-white rounded-2xl
                                                overflow-hidden
                                                border border-slate-100
                                                shadow-sm
                                                hover:shadow-lg
                                                transition-shadow
                                                duration-300
                                            `}
                                        >
                                            {/* Image */}
                                            <div
                                                className={`
                                                    relative
                                                    overflow-hidden
                                                    bg-slate-200
                                                    flex
                                                    items-center
                                                    justify-center
                                                    ${isReversed
                                                    ? "lg:col-start-2"
                                                    : "lg:col-start-1"
                                                }
                                                `}
                                            >
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={title}
                                                        className="max-w-[300px]  h-auto
                                                        object-contain"
                                                    />
                                                ) : (
                                                    <div className="text-slate-400">
                                                        {t("common.noImage")}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div
                                                className={`
                                                    flex flex-col justify-center
                                                    p-7 md:p-10
                                                    ${isReversed
                                                    ? "lg:col-start-1 lg:row-start-1"
                                                    : "lg:col-start-2 lg:row-start-1"
                                                }
                                                `}
                                            >
                                                <time
                                                    dateTime={event.date}
                                                    className="text-sm font-medium text-blue-600"
                                                >
                                                    {formatEventDate(
                                                        event.date,
                                                        lang
                                                    )}
                                                </time>

                                                <h3 className="mt-3 text-2xl md:text-3xl font-bold leading-tight text-[#003366] group-hover:text-blue-600 transition-colors">
                                                    {title}
                                                </h3>

                                                <div
                                                    className="mt-5 prose prose-slate max-w-none line-clamp-4"
                                                    dangerouslySetInnerHTML={{
                                                        __html:
                                                            transformImageUrls(
                                                                localized(
                                                                    event,
                                                                    "description",
                                                                    lang
                                                                )
                                                            ),
                                                    }}
                                                />

                                                <div className="mt-8">
                                                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                                                        {t("events.readMore")}

                                                        <span className="text-lg group-hover:translate-x-1 transition-transform">
                                                            →
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}