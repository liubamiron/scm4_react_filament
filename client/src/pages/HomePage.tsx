import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useFeaturedServices } from "../features/pages/hook/useFeaturedPages.ts";
import { useEvents } from "../features/pages/hook/useEvents.ts";
import { PageStatus } from "../components/PageStatus.tsx";
import { EventCard } from "./EventsPage.tsx";
import { localized, useLocale, useT } from "../i18n";
import { transformImageUrls } from "../utils/transformImageUrls.ts";

const LATEST_NEWS_COUNT = 3;

export function HomePage() {
    const { data: featuredServices, isLoading: isServicesLoading } = useFeaturedServices();
    const { data: events, isLoading: isEventsLoading } = useEvents();

    const lang = useLocale();
    const t = useT();

    const storageUrl = import.meta.env.VITE_STORAGE_URL;

    const latestNews = [...(events ?? [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, LATEST_NEWS_COUNT);

    return (
        <div className="page">
            {/* Services */}
            <section className="space-y-8">
                <h2 className="section-title text-center">{t("home.servicesTitle")}</h2>

                {isServicesLoading ? (
                    <PageStatus>{t("common.loading")}</PageStatus>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {featuredServices?.map((service) => {
                            const title = localized(service, "title", lang);

                            return (
                                <Link
                                    key={service.id}
                                    to="/$lang/pages/$slug"
                                    params={{ lang, slug: service.slug }}
                                    className="group block"
                                >
                                    <article className="card h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
                                        {/* 16:10 matches the ratio the admin form crops thumbnails to,
                                            so uploads are shown whole instead of being cut off. */}
                                        <div className="aspect-[16/10] w-full overflow-hidden bg-brand-50">
                                            {service.image ? (
                                                <img
                                                    src={`${storageUrl}/${service.image}`}
                                                    alt={title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-slate-400">
                                                    {t("common.noImage")}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 text-center">
                                            <h3 className="text-xl font-bold text-brand-900 transition group-hover:text-brand-700">
                                                {title}
                                            </h3>

                                            <div className="title-rule mx-auto" />

                                            <div
                                                className="content-prose mt-4 line-clamp-3"
                                                dangerouslySetInnerHTML={{
                                                    __html: transformImageUrls(localized(service, "content", lang)),
                                                }}
                                            />
                                        </div>
                                    </article>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Latest news */}
            {(isEventsLoading || latestNews.length > 0) && (
                <section className="space-y-8 pt-6">
                    <div className="flex items-end justify-between gap-6">
                        <h2 className="section-title">{t("home.newsTitle")}</h2>

                        <Link to="/$lang/events" params={{ lang }} className="link-accent shrink-0">
                            {t("home.newsAll")}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {isEventsLoading ? (
                        <PageStatus>{t("common.loading")}</PageStatus>
                    ) : (
                        <div className="space-y-6">
                            {latestNews.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
