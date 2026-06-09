import {useFeaturedServices} from "../features/pages/hook/useFeaturedPages.ts";
import {Link} from "@tanstack/react-router";
import {useLanguage} from "../hooks/useLanguage.ts";

export function HomePage() {
    const { data: services, isLoading } = useFeaturedServices();
    const language = useLanguage()

    console.log(language);

    if (isLoading) return <div>Se încarcă...</div>;

    // FILTER: Only keep items where is_featured is 1 (or true)
    const featuredServices = services?.filter((item) => item.is_featured === 1 || item.is_featured === true);

    const storageUrl = import.meta.env.VITE_STORAGE_URL;

    return (
        <div className="bg-slate-50 py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center text-[#003366] mb-12">
                    Serviciile noastre
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredServices?.map((service) => {
                        return (
                            <Link
                                key={service.id}
                                to="/pages/$slug"
                                params={{ slug: service.slug }}
                                className="block"
                            >
                                <div className="bg-white rounded-xl shadow-lg flex flex-col">

                                    <div className="h-56 w-full overflow-hidden bg-slate-200">
                                        {service.image ? (
                                            <img
                                                src={`${storageUrl}/${service.image}`}
                                                alt={service.title_ro}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400">
                                                Fără imagine
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 text-center">
                                        <h3 className="text-xl font-bold text-[#003366]">
                                            {service[`title_${language}`]}
                                        </h3>

                                        <div className="w-16 h-0.5 bg-blue-500 mx-auto my-4" />

                                        <p className="text-slate-600 line-clamp-2">
                                            {service[`content_${language}`]?.replace(/<[^>]*>/g, '')}
                                        </p>
                                    </div>

                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}