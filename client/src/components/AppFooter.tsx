import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePartners } from "../features/pages/hook/usePartners.ts";
import { useLocale, useT } from "../i18n";
import type { UiKey } from "../i18n";

// Footer links mirror the header, minus the dropdown groups.
type FooterLink = { labelKey: UiKey } & (
    | { to: "/$lang" | "/$lang/about" | "/$lang/transparenta" | "/$lang/events" }
    | { slug: string }
);

const footerLinks: FooterLink[] = [
    { labelKey: "nav.home", to: "/$lang" },
    { labelKey: "nav.about", to: "/$lang/about" },
    { labelKey: "nav.transparency", to: "/$lang/transparenta" },
    { labelKey: "nav.events", to: "/$lang/events" },
    { labelKey: "nav.donations", slug: "donatii" },
    { labelKey: "nav.contacts", slug: "contacte" },
];

export function AppFooter() {
    const { data: partners } = usePartners();
    const lang = useLocale();
    const t = useT();

    const storageUrl = import.meta.env.VITE_STORAGE_URL;
    const activePartners = (partners ?? []).filter((p) => p.is_active !== false);

    const linkClass = "text-sm text-blue-100/80 transition hover:text-white";

    return (
        <footer className="mt-16">
            {/* PARTNERS */}
            {activePartners.length > 0 && (
                <section className="rounded-t-2xl border border-b-0 border-slate-200 bg-white px-6 py-10">
                    <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        {t("footer.partners")}
                    </p>
                    <div className="flex flex-wrap items-stretch justify-center gap-4">
                        {activePartners.map((partner) => (
                            <a
                                key={partner.id}
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={partner.name}
                                className="flex h-24 w-40 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                            >
                                <img
                                    src={`${storageUrl}/${partner.logo}`}
                                    alt={partner.name}
                                    loading="lazy"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* MAIN */}
            <div className={`overflow-hidden bg-[#053258] text-white ${activePartners.length > 0 ? "rounded-b-2xl" : "rounded-2xl"}`}>
                <div className="grid gap-10 px-6 py-12 md:grid-cols-3 md:px-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/$lang" params={{ lang }} className="inline-flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                                <img src="/img/scm4_logo.jpg" alt="IMSP SCM Nr.4" className="h-full w-full object-contain" />
                            </span>
                            <span className="text-lg font-bold leading-tight">IMSP SCM Nr.4</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-blue-100/80">{t("site.name")}</p>
                        <p className="text-sm italic leading-relaxed text-blue-100/60">{t("footer.tagline")}</p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200/70">
                            {t("footer.navigation")}
                        </h3>
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-1">
                            {footerLinks.map((item) => (
                                <li key={item.labelKey}>
                                    {"slug" in item ? (
                                        <Link
                                            to="/$lang/pages/$slug"
                                            params={{ lang, slug: item.slug }}
                                            className={linkClass}
                                        >
                                            {t(item.labelKey)}
                                        </Link>
                                    ) : (
                                        <Link to={item.to} params={{ lang }} className={linkClass}>
                                            {t(item.labelKey)}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200/70">
                            {t("footer.contact")}
                        </h3>
                        <ul className="space-y-3 text-sm text-blue-100/80">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                                <span>{t("footer.address")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-blue-300" />
                                <a href={`tel:${t("footer.phone").replace(/[^\d+]/g, "")}`} className="transition hover:text-white">
                                    {t("footer.phone")}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-blue-300" />
                                <a href={`mailto:${t("footer.email")}`} className="transition hover:text-white">
                                    {t("footer.email")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-blue-100/60 md:px-10">
                    © {new Date().getFullYear()} IMSP SCM Nr.4 — {t("footer.rights")}
                </div>
            </div>
        </footer>
    );
}
