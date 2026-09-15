import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Send } from "lucide-react";
import { apiClient } from "../api/client.ts";
import { useT } from "../i18n";

// `website` is a honeypot — hidden from people, filled by bots. The API silently
// drops submissions where it is non-empty or that arrive too soon after render.
type FormState = { name: string; email: string; message: string; website: string };

const EMPTY: FormState = { name: "", email: "", message: "", website: "" };

export function ContactForm() {
    const t = useT();
    const [form, setForm] = useState<FormState>(EMPTY);
    const [startedAt, setStartedAt] = useState(() => Date.now());

    const send = useMutation({
        mutationFn: (data: FormState) =>
            apiClient<{ ok: boolean }>("/contact-messages", {
                method: "POST",
                body: JSON.stringify({ ...data, started_at: startedAt }),
            }),
        onSuccess: () => {
            setForm(EMPTY);
            setStartedAt(Date.now());
        },
    });

    const update = (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm({ ...form, [field]: e.target.value });

    const inputClass =
        "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 " +
        "placeholder:text-slate-400 transition focus:border-brand-200 focus:bg-white focus:outline-none " +
        "focus:ring-2 focus:ring-brand-100";

    if (send.isSuccess) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <p className="text-lg font-semibold text-emerald-800">{t("contact.formSent")}</p>
                <button
                    type="button"
                    onClick={() => send.reset()}
                    className="mt-2 text-sm font-medium text-emerald-700 underline-offset-2 hover:underline"
                >
                    {t("contact.formSendAnother")}
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                send.mutate(form);
            }}
            className="grid gap-4 sm:grid-cols-2"
        >
            {/* Honeypot: visually removed, excluded from tab order and screen readers. */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={update("website")}
                />
            </div>

            <label className="block sm:col-span-1">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">{t("contact.formName")}</span>
                <input
                    name="name"
                    required
                    maxLength={255}
                    value={form.name}
                    onChange={update("name")}
                    className={inputClass}
                />
            </label>

            <label className="block sm:col-span-1">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">{t("contact.formEmail")}</span>
                <input
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    value={form.email}
                    onChange={update("email")}
                    className={inputClass}
                />
            </label>

            <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">{t("contact.formMessage")}</span>
                <textarea
                    name="message"
                    required
                    maxLength={5000}
                    rows={6}
                    value={form.message}
                    onChange={update("message")}
                    className={`${inputClass} resize-y`}
                />
            </label>

            {send.isError && (
                <p className="text-sm text-red-600 sm:col-span-2">{t("contact.formError")}</p>
            )}

            <div className="sm:col-span-2">
                <button
                    type="submit"
                    disabled={send.isPending}
                    className="btn-primary"
                >
                    <Send className="h-4 w-4" />
                    {send.isPending ? t("contact.formSending") : t("contact.formSend")}
                </button>
            </div>
        </form>
    );
}
