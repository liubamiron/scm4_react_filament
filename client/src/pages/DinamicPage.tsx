import { Route } from '../routes/$lang/pages/$slug'
import {usePage} from "../features/pages/hook/usePage.ts";
import { transformImageUrls } from '../utils/transformImageUrls';
import {ContactPage} from "./ContactPage.tsx";
import { PageStatus } from '../components/PageStatus.tsx'
import { localized, useLocale, useT } from '../i18n'

export function DynamicPage() {
    const { slug } = Route.useParams()
    const lang = useLocale()
    const t = useT()

    const { data: page, isLoading, error } = usePage(slug)

    if (isLoading) {
        return <PageStatus>{t('common.loadingContent')}</PageStatus>
    }

    if (error || !page) {
        return <PageStatus error>{t('common.notFound')}</PageStatus>
    }

    if (slug === "contacte") {
        return <ContactPage page={page} />;
    }

    return (
        <div className="page">
            <header>
                <h1 className="page-title">{localized(page, 'title', lang)}</h1>
                <div className="title-rule" />
            </header>

            <article
                className="content-prose"
                dangerouslySetInnerHTML={{ __html: transformImageUrls(localized(page, 'content', lang)) }}
            />
        </div>
    )
}
