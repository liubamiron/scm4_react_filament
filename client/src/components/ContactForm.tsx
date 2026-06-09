import { useState } from "react";

export function ContactForm() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold text-blue-pharma">
                Trimite un mesaj
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="name"
                    placeholder="Nume"
                    className="w-full border p-3 rounded-lg"
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    className="w-full border p-3 rounded-lg"
                    onChange={handleChange}
                />

                <textarea
                    name="message"
                    placeholder="Mesaj"
                    rows={5}
                    className="w-full border p-3 rounded-lg"
                    onChange={handleChange}
                />

                <button
                    className="bg-blue-pharma text-white px-6 py-3 rounded-lg"
                >
                    Trimite
                </button>
            </form>
        </div>
    );
}