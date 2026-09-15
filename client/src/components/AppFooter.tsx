import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePartners } from "../features/pages/hook/usePartners.ts";
import { localePath, navigation } from "./navigation.ts";
import { useLocale, useT } from "../i18n";

// Mirrors the header: same horizontal inset (px-5), same brand-200 bar with
// brand-900 text, square edges, and the same link size as the header menu.
export function AppFooter() {
    const { data: partners } = usePartners();
    const lang = useLocale();
    const t = useT();

    const storageUrl = import.meta.env.VITE_STORAGE_URL;
    const activePartners = (partners ?? []).filter((p) => p.is_active !== false);

    const linkClass = "font-medium text-white/85 transition hover:text-white";

    return (
        <footer className="mt-16">
            {/* PARTNERS */}
            {activePartners.length > 0 && (
                <section className="border-y border-slate-200 bg-white px-5 py-10">
                    <p className="eyebrow mb-6 text-center text-brand-900">{t("footer.partners")}</p>
                    <div className="flex flex-wrap items-stretch justify-center gap-4">
                        {activePartners.map((partner) => (
                            <a
                                key={partner.id}
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={partner.name}
                                className="flex h-24 w-40 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
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

            {/* BODY */}
            <div className="bg-brand-500 text-white">
                <div className="grid gap-10 px-5 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/$lang" params={{ lang }} className="inline-flex items-center gap-3">
                            {/* Transparent white emblem, generated from the header logo's caduceus. */}
                            <img src="/img/logo_white.png" alt="" className="h-12 w-auto object-contain" />
                            <span className="font-serif text-2xl font-semibold tracking-wide">IMSP SCM Nr.4</span>
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-white/85">
                            {t("site.name1")}
                            <br />
                            {t("site.name2")}
                        </p>
                    </div>

                    {/* Navigation — same entries as the header menu */}
                    <div>
                        <h3 className="text-[15px] eyebrow uppercase mb-4 text-[#003366]">{t("footer.navigation")}</h3>
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                            {navigation.map((item) => (
                                <li key={item.href}>
                                    <Link to={localePath(lang, item.href)} className={linkClass}>
                                        {t(item.labelKey)}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link to="/$lang/pages/$slug" params={{ lang, slug: "contacte" }} className={linkClass}>
                                    {t("nav.contacts")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-[15px] eyebrow uppercase mb-4 text-[#003366]">{t("footer.contact")}</h3>
                        <ul className="space-y-3 text-white/85">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-200" />
                                <span>{t("footer.address")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-brand-200" />
                                <a href={`tel:${t("footer.phone").replace(/[^\d+]/g, "")}`} className={linkClass}>
                                    {t("footer.phone")}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-brand-200" />
                                <a href={`mailto:${t("footer.email")}`} className={linkClass}>
                                    {t("footer.email")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR — identical to the header's top bar */}
            <div className="flex flex-col items-center justify-end gap-1 bg-brand-200 px-5 py-3 text-sm  text-gray-700 sm:flex-row md:text-base shadow-sm border-b-gray-600">
                <span>© {new Date().getFullYear()} — {t("footer.rights")}</span>
            </div>
        </footer>
    );
}
