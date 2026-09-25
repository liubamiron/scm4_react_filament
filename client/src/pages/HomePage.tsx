import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useFeaturedServices } from "../features/pages/hook/useFeaturedPages.ts";
import { useEvents } from "../features/pages/hook/useEvents.ts";
import { PageStatus } from "../components/PageStatus.tsx";
import { PageCard } from "../components/PageCard.tsx";
import { EventCard, EventListItem } from "./EventsPage.tsx";
import { HomeQuickInfo } from "../components/HomeQuickInfo.tsx";
import { useLocale, useT } from "../i18n";

// The newest event gets a large card, the rest a compact list beside it.
const LATEST_NEWS_COUNT = 4;

export function HomePage() {
    const { data: featuredServices, isLoading: isServicesLoading } = useFeaturedServices();
    const { data: events, isLoading: isEventsLoading } = useEvents();

    const lang = useLocale();
    const t = useT();

    const latestNews = [...(events ?? [])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, LATEST_NEWS_COUNT);
    const [featuredNews, ...otherNews] = latestNews;

    return (
        <div className="page">
            <HomeQuickInfo />

            {/* Services */}
            <section className="space-y-8">
                <h2 className="section-title text-center">{t("home.servicesTitle")}</h2>

                {isServicesLoading ? (
                    <PageStatus>{t("common.loading")}</PageStatus>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {featuredServices?.map((service) => (
                            <PageCard key={service.id} page={service} />
                        ))}
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
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                            {featuredNews && (
                                <div className={otherNews.length > 0 ? "lg:col-span-3" : "lg:col-span-5"}>
                                    <EventCard event={featuredNews} />
                                </div>
                            )}

                            {otherNews.length > 0 && (
                                <div className="flex flex-col gap-4 lg:col-span-2">
                                    {otherNews.map((event) => (
                                        <EventListItem key={event.id} event={event} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
