import { useT } from '../i18n'

export function AboutPage() {
    const t = useT()

    return (
        <div className="page">
            <header>
                <h1 className="page-title">{t('about.title')}</h1>
                <div className="title-rule" />
            </header>

            <p className="leading-relaxed text-slate-700">{t('about.intro')}</p>
        </div>
    )
}
