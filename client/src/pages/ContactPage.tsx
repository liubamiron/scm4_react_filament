import {transformImageUrls} from "../utils/transformImageUrls.ts";
import {ContactForm} from "../components/ContactForm.tsx";

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
            <div className="grid md:grid-cols-2 gap-4">
                {contacts.map((item: any) => (
                    <div
                        key={item.nr}
                        className="p-4 border border-blue-400 rounded-xl bg-slate-50 space-y-2"
                    >
                        <p className="font-semibold">{item.name_ro}</p>
                        <p className="text-sm ">{item.dept_ro}</p>

                        <pre className="text-sm whitespace-pre-wrap text-slate-700">
                            {item.phones}
                        </pre>
                    </div>
                ))}
            </div>


            {/* MAP + CONTENT */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* MAP */}
                <div className="h-[350px] rounded-xl overflow-hidden shadow">
                    <iframe
                        className="w-full h-full"
                        loading="lazy"
                        title="map"
                        src="https://www.google.com/maps?q=Strada+Columna+150+Chisinau&output=embed"
                    />
                </div>

                {/* HTML CONTENT */}
                <div
                    className=" max-w-none bg-white p-4 border border-blue-400 rounded-xl shadow"
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