import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { usePartners } from "../features/pages/hook/usePartners.ts";
import { localePath, navigation } from "./navigation.ts";
import { useLocale, useT } from "../i18n";

export function AppFooter() {
    const { data: partners } = usePartners();
    const lang = useLocale();
    const t = useT();

    const storageUrl = import.meta.env.VITE_STORAGE_URL;
    const activePartners = (partners ?? []).filter((p) => p.is_active !== false);

    const headingClass = "mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#8ec2d6]";
    const linkClass = "text-slate-200 transition hover:text-white";

    return (
        <footer className="mt-16 space-y-8">
            {/* PARTNERS */}
            {activePartners.length > 0 && (
                <section className="rounded-2xl border border-slate-200 bg-white px-6 py-10 shadow-sm">
                    <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#003366]">{t("footer.partners")}</p>
                    <div className="flex flex-wrap items-stretch justify-center gap-4">
                        {activePartners.map((partner) => (
                            <a
                                key={partner.id}
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={partner.name}
                                className="flex h-24 w-40 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#8ec2d6] hover:shadow-md"
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

            {/* FOOTER */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                <div className="grid gap-10 bg-[#4786C7] px-6 py-10 md:grid-cols-[1.2fr_1fr_1fr] md:px-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/$lang" params={{ lang }} className="inline-block">
                            {/* Updated src to .png / .svg and removed bg-blue-400 */}
                            <img
                                src="/img/white_logo_2.jpeg"
                                alt={t("site.name")}
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-200">{t("site.name")}</p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className={headingClass}>{t("footer.navigation")}</h3>
                        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm font-medium">
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
                        <h3 className={headingClass}>{t("footer.contact")}</h3>
                        <ul className="space-y-3 text-sm text-slate-200">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8ec2d6]" />
                                <span>{t("footer.address")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 shrink-0 text-[#8ec2d6]" />
                                <a href={`tel:${t("footer.phone").replace(/[^\d+]/g, "")}`} className={linkClass}>
                                    {t("footer.phone")}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 shrink-0 text-[#8ec2d6]" />
                                <a href={`mailto:${t("footer.email")}`} className={linkClass}>
                                    {t("footer.email")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-1 bg-[#8ec2d6] px-5 py-3 text-sm font-medium text-[#003366] sm:flex-row">
                    <span>IMSP SCM Nr.4</span>
                    <span>© {new Date().getFullYear()} — {t("footer.rights")}</span>
                </div>
            </div>
        </footer>
    );
}