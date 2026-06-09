import { Route } from '../routes/pages/$slug'
import {usePage} from "../features/pages/hook/usePage.ts";
import { transformImageUrls } from '../utils/transformImageUrls';
import {ContactPage} from "./ContactPage.tsx";

export function DynamicPage() {
    const { slug } = Route.useParams()

    const { data: page, isLoading, error } = usePage(slug)

    if (isLoading) {
        return (
            <div className="p-8 text-center animate-pulse">
                Se încarcă conținutul...
            </div>
        )
    }

    if (error || !page) {
        return (
            <div className="p-8 text-center text-red-500">
                Pagina nu a fost găsită.
            </div>
        )
    }

    if (slug === "contacte") {
        return <ContactPage page={page} />;
    }


    return (
        <div className="space-y-6 pb-12">
            <header className="space-y-2 mt-10">
                <h1 className="text-3xl font-extrabold text-blue-pharma">
                    {page.title_ro}
                </h1>

                <div className="h-0.5 w-20 bg-blue-400 rounded-full" />
            </header>

            <article
                className="prose prose-slate max-w-none "
                dangerouslySetInnerHTML={{ __html: transformImageUrls(page.content_ro) }}
            />

        </div>
    )
}