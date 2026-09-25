import { Mail, MapPin, Phone, Siren } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "../i18n";
import type { UiKey } from "../i18n/ui";

type InfoItem = {
    icon: LucideIcon;
    labelKey: UiKey;
    value: string;
    href?: string;
    urgent?: boolean;
};

// Address, phone, e-mail and the emergency number, right under the hero.
// Values are the same `footer.*` strings the footer shows.
export function HomeQuickInfo() {
    const t = useT();

    const items: InfoItem[] = [
        { icon: MapPin, labelKey: "home.infoAddress", value: t("footer.address") },
        {
            icon: Phone,
            labelKey: "home.infoPhone",
            value: t("footer.phone"),
            href: `tel:${t("footer.phone").replace(/[^\d+]/g, "")}`,
        },
        { icon: Mail, labelKey: "home.infoEmail", value: t("footer.email"), href: `mailto:${t("footer.email")}` },
        { icon: Siren, labelKey: "home.infoEmergency", value: "112", href: "tel:112", urgent: true },
    ];

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ icon: Icon, labelKey, value, href, urgent }) => {
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

                return href ? (
                    <a key={labelKey} href={href} className={`${className} hover:border-brand-700`}>
                        {body}
                    </a>
                ) : (
                    <div key={labelKey} className={className}>
                        {body}
                    </div>
                );
            })}
        </section>
    );
}
