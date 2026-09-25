import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { useLocale, useT } from "../i18n";
import { Emblem } from "./Emblem.tsx";

// Google Maps search for the street address; opens the app on phones.
const MAPS_URL =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("str. Columna 150, Chișinău, Moldova");

// Top of the home page: who we are and the two things visitors look for first.
export function HomeHero() {
    const lang = useLocale();
    const t = useT();

    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 to-brand-700 px-6 py-12 text-white md:px-12 md:py-16">
            <Emblem className="pointer-events-none absolute -right-10 top-1/2 h-72 w-72 -translate-y-1/2 bg-white/10 md:right-8 md:h-80 md:w-80" />

            <div className="relative max-w-2xl space-y-5">
                <p className="eyebrow text-brand-200">{t("site.name1")}</p>
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
                    {t("site.name2")}
                </h1>
                <p className="text-lg text-white/85">{t("home.heroText")}</p>

                <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                        to="/$lang/pages/$slug"
                        params={{ lang, slug: "contacte" }}
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-900 hover:bg-brand-50"
                    >
                        <Phone className="h-4 w-4" />
                        {t("nav.contacts")}
                    </Link>
                    <a
                        href={MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/60 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                    >
                        <MapPin className="h-4 w-4" />
                        {t("contact.mapTitle")}
                    </a>
                </div>
            </div>
        </section>
    );
}
