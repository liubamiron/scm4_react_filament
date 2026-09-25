import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { useLocale, useT } from "../i18n";
import { MAPS_URL, telHref } from "./contactLinks.ts";

const iconBoxClass = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700";
const labelClass = "block text-xs font-semibold uppercase tracking-wide text-slate-500";

// Address (opens the map) and phone at the top of the home page, pushed to the
// two edges of the container. Values are the same `footer.*` strings the
// footer shows; the phone card also links to the contact page, which lists
// every number and the e-mail.
export function HomeQuickInfo() {
    const t = useT();
    const lang = useLocale();
    const phone = t("footer.phone");

    return (
        <>
            {/* Phones: two small pills, so the services are visible without scrolling. */}
            <section className="flex items-center justify-between gap-2 sm:hidden">
                <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("home.infoAddress")}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-brand-900"
                >
                    <MapPin className="h-4 w-4 text-brand-700" />
                    {t("home.infoShortAddress")}
                </a>
                <a
                    href={telHref(phone)}
                    aria-label={t("home.infoPhone")}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-brand-900"
                >
                    <Phone className="h-4 w-4 text-brand-700" />
                    {phone}
                </a>
            </section>

            <section className="hidden items-stretch justify-between gap-4 sm:flex">
                <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card flex items-center gap-4 p-5 hover:border-brand-700"
                >
                    <span className={iconBoxClass}>
                        <MapPin className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                        <span className={labelClass}>{t("home.infoAddress")}</span>
                        <span className="block font-semibold text-brand-900">{t("footer.address")}</span>
                    </span>
                </a>

                {/* Two links can't nest, so this card is a plain box holding the
                    phone link and the contact page link. */}
                <div className="card flex items-center gap-4 p-5">
                    <span className={iconBoxClass}>
                        <Phone className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                        <span className={labelClass}>{t("home.infoPhone")}</span>
                        <a href={telHref(phone)} className="block font-semibold text-brand-900 hover:text-brand-700">
                            {phone}
                        </a>
                        <Link
                            to="/$lang/pages/$slug"
                            params={{ lang, slug: "contacte" }}
                            className="link-accent mt-1 text-xs"
                        >
                            {t("home.infoAllContacts")}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </span>
                </div>
            </section>
        </>
    );
}
