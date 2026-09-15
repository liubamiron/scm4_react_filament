import { MapPin, MessageSquare, Phone, Users } from "lucide-react";
import { ContactForm } from "../components/ContactForm.tsx";
import { transformImageUrls } from "../utils/transformImageUrls.ts";
import { localized, useLocale, useT } from "../i18n";
import type { ServicePage } from "../types";

type ContactRow = NonNullable<ServicePage["contact_list"]>[number];

// `usePage` returns the narrower `Page` type; only these fields are needed here.
type ContactPageData = Pick<ServicePage, "title_ro" | "title_ru" | "content_ro" | "content_ru"> &
    Pick<Partial<ServicePage>, "contact_list">;

// Phones come from a free-text repeater field: one per line, sometimes comma-separated.
function splitPhones(phones?: string): string[] {
    return (phones ?? "")
        .split(/[\n,;]+/)
        .map((p) => p.trim())
        .filter(Boolean);
}

function PhoneLinks({ phones, className = "" }: { phones?: string; className?: string }) {
    return (
        <ul className={`space-y-1 ${className}`}>
            {splitPhones(phones).map((phone) => (
                <li key={phone}>
                    <a
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap text-slate-700 transition hover:text-[#053258]"
                    >
                        <Phone className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                        {phone}
                    </a>
                </li>
            ))}
        </ul>
    );
}

function SectionHeading({ icon: Icon, children }: { icon: typeof Users; children: React.ReactNode }) {
    return (
        <h2 className="flex items-center gap-2.5 text-xl font-bold text-[#053258]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
            </span>
            {children}
        </h2>
    );
}

export function ContactPage({ page }: { page?: ContactPageData }) {
    const lang = useLocale();
    const t = useT();

    const contacts: ContactRow[] = page?.contact_list ?? [];
    const content = transformImageUrls(localized(page, "content", lang));

    return (
        <div className="space-y-14 pb-16">
            {/* TITLE */}
            <header className="mt-10 space-y-2">
                <h1 className="text-3xl font-extrabold text-[#053258] md:text-4xl">
                    {localized(page, "title", lang)}
                </h1>
                <div className="h-1 w-20 rounded-full bg-blue-400" />
            </header>

            {/* ADDRESS + MAP */}
            <section className="grid gap-6 lg:grid-cols-5">
                <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 md:p-8">
                    <SectionHeading icon={MapPin}>{t("contact.infoTitle")}</SectionHeading>
                    <div
                        className="prose prose-slate max-w-none leading-relaxed prose-p:my-1 prose-a:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
                    <div className="border-b border-slate-100 px-6 py-4">
                        <SectionHeading icon={MapPin}>{t("contact.mapTitle")}</SectionHeading>
                    </div>
                    <iframe
                        className="block h-[320px] w-full md:h-[400px]"
                        loading="lazy"
                        title="map"
                        src="https://www.google.com/maps?q=Strada+Columna+150+Chisinau&output=embed"
                    />
                </div>
            </section>

            {/* STAFF DIRECTORY */}
            {contacts.length > 0 && (
                <section className="space-y-5">
                    <SectionHeading icon={Users}>{t("contact.staffTitle")}</SectionHeading>

                    {/* Desktop table */}
                    <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                        <table className="w-full text-sm">
                            <thead className="bg-[#053258] text-left text-xs font-semibold uppercase tracking-wide text-white">
                                <tr>
                                    <th className="w-14 px-5 py-3.5">{t("contact.nr")}</th>
                                    <th className="px-5 py-3.5">{t("contact.name")}</th>
                                    <th className="px-5 py-3.5">{t("contact.role")}</th>
                                    <th className="px-5 py-3.5">{t("contact.section")}</th>
                                    <th className="px-5 py-3.5">{t("contact.phone")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {contacts.map((item) => (
                                    <tr key={item.nr} className="transition hover:bg-blue-50/40">
                                        <td className="px-5 py-4 font-medium text-slate-400">{item.nr}</td>
                                        <td className="px-5 py-4 font-semibold text-slate-900">{item.name}</td>
                                        <td className="px-5 py-4 text-slate-600">{item.role}</td>
                                        <td className="px-5 py-4">
                                            {item.section && (
                                                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                    {item.section}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <PhoneLinks phones={item.phones} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="grid gap-4 md:hidden">
                        {contacts.map((item) => (
                            <div
                                key={item.nr}
                                className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                {item.section && (
                                    <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        {item.section}
                                    </span>
                                )}
                                <div>
                                    <p className="font-semibold text-slate-900">{item.name}</p>
                                    {item.role && <p className="text-sm text-slate-600">{item.role}</p>}
                                </div>
                                <PhoneLinks phones={item.phones} className="text-sm" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CONTACT FORM */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-3">
                    <div className="space-y-3 lg:col-span-1">
                        <SectionHeading icon={MessageSquare}>{t("contact.formTitle")}</SectionHeading>
                        <p className="text-sm leading-relaxed text-slate-600">{t("contact.formSubtitle")}</p>
                    </div>
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
