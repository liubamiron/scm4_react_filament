import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePartners } from "../features/pages/hook/usePartners.ts";
import { localePath, navigation } from "./navigation.ts";
import { PartnersStrip } from "./PartnersStrip.tsx";
import { useLocale, useT } from "../i18n";

// Header menu entries that are left out of the footer link list.
const FOOTER_HIDDEN = ["/servicii", "/sections", "/donations"];

// Mirrors the header: same horizontal inset (px-5), same brand-200 bar with
// brand-900 text, square edges, and the same link size as the header menu.
export function AppFooter() {
    const { data: partners } = usePartners();
    const lang = useLocale();
    const t = useT();

    const activePartners = (partners ?? []).filter((p) => p.is_active !== false);

    const linkClass = "font-medium text-white/85 transition hover:text-white";
    const subLinkClass = "text-white/70 transition hover:text-white";

    // The footer shows a trimmed copy of the header menu.
    const footerNav = navigation.filter((item) => !FOOTER_HIDDEN.includes(item.href));
    const groups = footerNav.filter((item) => item.children);
    const plain = footerNav.filter((item) => !item.children);

    return (
        <footer className="mt-16">
            {/* PARTNERS */}
            {activePartners.length > 0 && (
                <section aria-label={t("footer.partners")} className="px-5 py-12">
                    <PartnersStrip partners={activePartners} />
                </section>
            )}

            {/* BODY */}
            <div className="bg-brand-500 text-white">
                <div className="grid gap-10 px-5 pb-12 pt-6 md:grid-cols-[1fr_2.2fr_1fr]">
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

                    {/* Navigation — the header menu minus FOOTER_HIDDEN. Each group with
                        sub-pages gets its own column, the plain links share one, so
                        the block stays as short as the contact column beside it. */}
                    <div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
                            {groups.map((item) => (
                                <div key={item.href}>
                                    <Link to={localePath(lang, item.href)} className={linkClass}>
                                        {t(item.labelKey)}
                                    </Link>
                                    <ul className="mt-2 space-y-1.5 text-sm">
                                        {item.children!.map((child) => (
                                            <li key={child.slug}>
                                                <Link
                                                    to="/$lang/pages/$slug"
                                                    params={{ lang, slug: child.slug }}
                                                    className={subLinkClass}
                                                >
                                                    {t(child.labelKey)}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <ul className="space-y-1.5">
                                {plain.map((item) => (
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
                    </div>

                    {/* Contact */}
                    <div>
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
