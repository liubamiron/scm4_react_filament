import {ContactForm} from "../components/ContactForm.tsx";
import {transformImageUrls} from "../utils/transformImageUrls.ts";

export function ContactPage({ page }: { page: any }) {

    const contacts = page.contact_list ?? [];

    return (
        <div className="space-y-10 pb-12">

            {/* TITLE */}
            <header className="space-y-2 mt-10">
                <h1 className="text-3xl font-extrabold text-blue-pharma">
                    {page.title_ro}
                </h1>
                <div className="h-0.5 w-20 bg-blue-400 rounded-full" />
            </header>

            {/* CONTACT LIST */}
            <div className="space-y-4">

                {/* ================= DESKTOP TABLE ================= */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border border-blue-400 text-sm">

                        <thead className="bg-blue-50 text-left">
                        <tr>
                            <th className="p-3">Nr.</th>
                            <th className="p-3">Nume / Prenume</th>
                            <th className="p-3">Funcția</th>
                            <th className="p-3">Secția</th>
                            <th className="p-3">Telefon</th>
                        </tr>
                        </thead>

                        <tbody>
                        {contacts.map((item: any) => (
                            <tr key={item.nr} className="border-t">

                                <td className="p-3">{item.nr}</td>

                                <td className="p-3 font-semibold">
                                    {item.name}
                                </td>

                                <td className="p-3 text-slate-600">
                                    {item.role}
                                </td>

                                <td className="p-3 text-slate-500">
                                    {item.section}
                                </td>

                                <td className="p-3 whitespace-pre-wrap">
                                    {item.phones}
                                </td>

                            </tr>
                        ))}
                        </tbody>

                    </table>
                </div>

                {/* ================= MOBILE CARDS ================= */}
                <div className="grid md:hidden gap-4">
                    {contacts.map((item: any) => (
                        <div
                            key={item.nr}
                            className="p-4 border border-blue-400 rounded-xl bg-slate-50 space-y-2"
                        >
                            <div className="flex items-end justify-end text-slate-500">
                                {item.section}
                            </div>

                            <p className="font-semibold">{item.name}</p>

                            {item.role && (
                                <p className="text-sm text-slate-600">
                                    {item.role}
                                </p>
                            )}

                            <pre className="text-sm whitespace-pre-wrap text-slate-700">
                    {item.phones}
                </pre>
                        </div>
                    ))}
                </div>

            </div>

            {/* MAP + CONTENT */}
            <div className="grid md:grid-cols-2 gap-6">

                <div className="h-[350px] rounded-xl overflow-hidden shadow">
                    <iframe
                        className="w-full h-full"
                        loading="lazy"
                        title="map"
                        src="https://www.google.com/maps?q=Strada+Columna+150+Chisinau&output=embed"
                    />
                </div>

                <div
                    className="bg-white p-4 border border-blue-400 rounded-xl shadow"
                    dangerouslySetInnerHTML={{
                        __html: transformImageUrls(page.content_ro)
                    }}
                />
            </div>

            {/* CONTACT FORM */}
            <ContactForm />
        </div>
    );
}