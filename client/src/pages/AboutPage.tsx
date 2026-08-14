import { useT } from '../i18n'

export function AboutPage() {
    const t = useT()

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-bold text-blue-900">
                {t('about.title')}
            </h1>

            <p className="text-slate-700">
                {t('about.intro')}
            </p>
        </div>
    )
}
