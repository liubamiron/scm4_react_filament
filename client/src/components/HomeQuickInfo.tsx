import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, Phone, Siren } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocale, useT } from "../i18n";
import type { UiKey } from "../i18n/ui";

// Google Maps search for the street address; opens the app on phones.
const MAPS_URL =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("str. Columna 150, Chișinău, Moldova");

type InfoItem = {
    icon: LucideIcon;
    labelKey: UiKey;
    // Label under the icon in the compact phone-width strip.
    shortLabel: string;
    value: string;
    href?: string;
    external?: boolean;
    urgent?: boolean;
    // Adds a "all contacts" link to the contact page under the value.
    withContactsLink?: boolean;
};

// Address (opens the map), phone, e-mail and the emergency number at the top
// of the home page. Values are the same `footer.*` strings the footer shows.
// The phone card also links to the contact page, which lists every number.
export function HomeQuickInfo() {
    const t = useT();
    const lang = useLocale();

    const items: InfoItem[] = [
        { icon: MapPin, labelKey: "home.infoAddress", shortLabel: t("home.infoShortAddress"), value: t("footer.address"), href: MAPS_URL, external: true },
        {
            icon: Phone,
            labelKey: "home.infoPhone",
            shortLabel: t("home.infoShortPhone"),
            value: t("footer.phone"),
            href: `tel:${t("footer.phone").replace(/[^\d+]/g, "")}`,
            withContactsLink: true,
        },
        { icon: Mail, labelKey: "home.infoEmail", shortLabel: t("home.infoEmail"), value: t("footer.email"), href: `mailto:${t("footer.email")}` },
        { icon: Siren, labelKey: "home.infoEmergency", shortLabel: "112", value: "112", href: "tel:112", urgent: true },
    ];

    return (
        <>
        {/* Phones: one row of icon buttons instead of four full-width cards,
            so the services are visible without scrolling. The bottom nav
            already links to the contact page. */}
        <section className="grid grid-cols-4 gap-2 sm:hidden">
            {items.map(({ icon: Icon, labelKey, shortLabel, href, external, urgent }) => (
                <a
                    key={labelKey}
                    href={href}
                    aria-label={t(labelKey)}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="card flex flex-col items-center gap-1.5 px-1 py-3"
                >
                    <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            urgent ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-700"
                        }`}
                    >
                        <Icon className="h-5 w-5" />
                    </span>
                    <span
                        className={`max-w-full truncate text-xs font-semibold ${
                            urgent ? "text-red-600" : "text-brand-900"
                        }`}
                    >
                        {shortLabel}
                    </span>
                </a>
            ))}
        </section>

        <section className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ icon: Icon, labelKey, value, href, external, urgent, withContactsLink }) => {
                const body = (
                    <>
                        <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                urgent ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-700"
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {t(labelKey)}
                            </span>
                            <span className={`block font-semibold ${urgent ? "text-red-600" : "text-brand-900"}`}>
                                {value}
                            </span>
                        </span>
                    </>
                );

                const className = "card flex items-center gap-4 p-5";

                // Two links can't nest, so this card is a plain box holding the
                // phone link and the contact page link side by side.
                if (withContactsLink) {
                    return (
                        <div key={labelKey} className={className}>
                            <span
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700"
                            >
                                <Icon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {t(labelKey)}
                                </span>
                                <a href={href} className="block font-semibold text-brand-900 hover:text-brand-700">
                                    {value}
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
                    );
                }

                return href ? (
                    <a
                        key={labelKey}
                        href={href}
                        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                        className={`${className} hover:border-brand-700`}
                    >
                        {body}
                    </a>
                ) : (
                    <div key={labelKey} className={className}>
                        {body}
                    </div>
                );
            })}
        </section>
        </>
    );
}
