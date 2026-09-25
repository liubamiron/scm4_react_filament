import { Link } from "@tanstack/react-router";
import { localized, useLocale } from "../i18n";
import { htmlToText } from "../utils/htmlToText.ts";
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
                {/* 16:10 matches the ratio the admin form crops thumbnails to,
                    so uploads are shown whole instead of being cut off. */}
                {page.image ? (
                    <div className="aspect-[16/10] w-full overflow-hidden bg-brand-50">
                        <img
                            src={`${storageUrl}/${page.image}`}
                            alt={title}
                            width={1200}
                            height={750}
                            decoding="async"
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex h-28 items-center justify-center bg-brand-50">
                        {/* The emblem is white on transparent, so it is used as a
                            mask and tinted with a brand colour instead. */}
                        <div
                            aria-hidden="true"
                            className="h-16 w-16 bg-brand-200"
                            style={{
                                maskImage: "url(/img/logo_white.png)",
                                WebkitMaskImage: "url(/img/logo_white.png)",
                                maskSize: "contain",
                                WebkitMaskSize: "contain",
                                maskRepeat: "no-repeat",
                                WebkitMaskRepeat: "no-repeat",
                                maskPosition: "center",
                                WebkitMaskPosition: "center",
                            }}
                        />
                    </div>
                )}

                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-brand-900 group-hover:text-brand-700">
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
