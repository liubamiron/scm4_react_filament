import { Link } from "@tanstack/react-router";
import { localized, useLocale, useT } from "../i18n";
import { transformImageUrls } from "../utils/transformImageUrls.ts";
import type { ServicePage } from "../types";

// Thumbnail + title + 3-line excerpt, linking to the page. Used wherever a
// group of CMS pages is listed (home page services, "Despre noi").
export function PageCard({ page }: { page: ServicePage }) {
    const lang = useLocale();
    const t = useT();
    const storageUrl = import.meta.env.VITE_STORAGE_URL;

    const title = localized(page, "title", lang);

    return (
        <Link to="/$lang/pages/$slug" params={{ lang, slug: page.slug }} className="group block">
            <article className="card h-full overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
                {/* 16:10 matches the ratio the admin form crops thumbnails to,
                    so uploads are shown whole instead of being cut off. */}
                <div className="aspect-[16/10] w-full overflow-hidden bg-brand-50">
                    {page.image ? (
                        <img
                            src={`${storageUrl}/${page.image}`}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                            {t("common.noImage")}
                        </div>
                    )}
                </div>

                <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-brand-900 transition group-hover:text-brand-700">
                        {title}
                    </h3>

                    <div className="title-rule mx-auto" />

                    <div
                        className="content-prose mt-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                            __html: transformImageUrls(localized(page, "content", lang)),
                        }}
                    />
                </div>
            </article>
        </Link>
    );
}
