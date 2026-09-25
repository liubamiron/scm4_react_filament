import { Emblem } from "./Emblem.tsx";

// Caduceus + "IMSP SCM Nr.4" wordmark. The emblem is a mask, so the same
// artwork is dark blue in the header and white in the footer.
export function SiteLogo({
    emblemClassName = "h-12 w-13 bg-brand-700",
    textClassName = "text-2xl text-brand-900",
}: {
    emblemClassName?: string;
    textClassName?: string;
}) {
    return (
        <span className="inline-flex items-center gap-3">
            <Emblem className={`shrink-0 ${emblemClassName}`} />
            <span className={`whitespace-nowrap font-serif font-semibold tracking-wide ${textClassName}`}>
                IMSP SCM Nr.4
            </span>
        </span>
    );
}
