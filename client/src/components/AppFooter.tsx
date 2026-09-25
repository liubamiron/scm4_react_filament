import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePartners } from "../features/pages/hook/usePartners.ts";
import { localePath } from "./navigation.ts";
import { useNavigation } from "./useNavigation.ts";
import { PartnersStrip } from "./PartnersStrip.tsx";
import { SiteLogo } from "./SiteLogo.tsx";
import { useLocale, useT, type UiKey } from "../i18n";

// Fixed menu entries that are left out of the footer link list. CMS pages are
// filtered by their own `show_in_footer` flag instead.
const FOOTER_HIDDEN: UiKey[] = ["nav.services", "nav.sections"];

// A link list longer than this flows into two columns and takes two grid cells.
const SINGLE_COLUMN_MAX = 4;

// Mirrors the header: same horizontal inset (px-5), the same brand-950 colour
// with a gold rule, square edges, and the same link size as the header menu.
export function AppFooter() {
    const { data: partners } = usePartners();
    const lang = useLocale();
    const t = useT();
    const navigation = useNavigation("footer");

    const activePartners = (partners ?? []).filter((p) => p.is_active !== false);

    const linkClass = "font-medium text-white/85 hover:text-white";
    const subLinkClass = "text-white/70 hover:text-white";

    // The footer shows a trimmed copy of the header menu.
    const footerNav = navigation.filter((item) => !FOOTER_HIDDEN.includes(item.labelKey));
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
            <div className="border-t-2 border-gold-500 bg-brand-950 text-white">
                <div className="grid gap-10 px-5 py-10 text-sm md:grid-cols-[1.1fr_2fr_1.1fr]">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/$lang" params={{ lang }}>
                            <SiteLogo emblemClassName="h-10 w-11 bg-white" textClassName="text-xl text-white" />
                        </Link>
                        <p className="leading-relaxed text-white/80">
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
                            {groups.map((item) => {
                                const wide = item.children!.length > SINGLE_COLUMN_MAX;

                                return (
                                    <div key={item.labelKey} className={wide ? "col-span-2" : undefined}>
                                        {item.href ? (
                                            <Link to={localePath(lang, item.href)} className={linkClass}>
                                                {t(item.labelKey)}
                                            </Link>
                                        ) : (
                                            <span className={linkClass}>{t(item.labelKey)}</span>
                                        )}
                                        {/* `columns-2` fills top-to-bottom, so the list reads in
                                            order; `break-inside-avoid` keeps a link on one column. */}
                                        <ul className={`mt-2 space-y-1.5 ${wide ? "columns-2 gap-x-6" : ""}`}>
                                            {item.children!.map((child) => (
                                                <li key={child.slug} className="break-inside-avoid">
                                                    <Link
                                                        to="/$lang/pages/$slug"
                                                        params={{ lang, slug: child.slug }}
                                                        className={subLinkClass}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}

                            {/* Plain links follow the same rule as a group's sub-pages:
                                past SINGLE_COLUMN_MAX they flow into two columns. */}
                            <ul
                                className={`space-y-1.5 ${
                                    plain.length > SINGLE_COLUMN_MAX ? "col-span-2 columns-2 gap-x-6" : ""
                                }`}
                            >
                                {plain.map((item) => (
                                    <li key={item.labelKey} className="break-inside-avoid">
                                        <Link to={localePath(lang, item.href!)} className={linkClass}>
                                            {t(item.labelKey)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <ul className="space-y-2.5 text-white/85">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                                <span>{t("footer.address")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-gold-300" />
                                <a href={`tel:${t("footer.phone").replace(/[^\d+]/g, "")}`} className={linkClass}>
                                    {t("footer.phone")}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-gold-300" />
                                <a href={`mailto:${t("footer.email")}`} className={linkClass}>
                                    {t("footer.email")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="flex flex-col items-center justify-end gap-1 border-t border-white/10 bg-brand-950 px-5 py-4 text-xs tracking-wide text-white/55 sm:flex-row">
                <span>© {new Date().getFullYear()} — {t("footer.rights")}</span>
            </div>
        </footer>
    );
}
