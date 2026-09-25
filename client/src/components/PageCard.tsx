import { Link } from "@tanstack/react-router";
import { localized, useLocale } from "../i18n";
import { htmlToText } from "../utils/htmlToText.ts";
import { Emblem } from "./Emblem.tsx";
import type { ServicePage } from "../types";

// Thumbnail + title + 3-line excerpt, linking to the page. Used wherever a
// group of CMS pages is listed (home page services, "Despre noi"). A page
// without a thumbnail gets a short strip with the hospital emblem instead.
export function PageCard({ page }: { page: ServicePage }) {
    const lang = useLocale();
    const storageUrl = import.meta.env.VITE_STORAGE_URL;

    const title = localized(page, "title", lang);

    return (
        <Link to="/$lang/pages/$slug" params={{ lang, slug: page.slug }} className="group block">
            <article className="card h-full overflow-hidden hover:border-brand-700">
                {/* Same framing as the news cards: the whole image on a tinted,
                    padded background, scaled down but never cropped or upscaled. */}
                {page.image ? (
                    <div className="flex h-56 items-center justify-center overflow-hidden bg-brand-50 p-4 md:p-6">
                        <img
                            src={`${storageUrl}/${page.image}`}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            className="max-h-full max-w-full rounded-md object-contain shadow-sm"
                        />
                    </div>
                ) : (
                    <div className="flex h-28 items-center justify-center bg-brand-50">
                        <Emblem className="h-16 w-16 bg-brand-200" />
                    </div>
                )}

                <div className="p-6 text-center">
                    <h3 className="font-serif text-xl font-semibold text-brand-900 group-hover:text-brand-700">
                        {title}
                    </h3>

                    <div className="title-rule mx-auto" />

                    <p className="mt-4 line-clamp-3 leading-relaxed text-slate-600">
                        {htmlToText(localized(page, "content", lang))}
                    </p>
                </div>
            </article>
        </Link>
    );
}
