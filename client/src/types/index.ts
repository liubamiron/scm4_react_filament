export interface Page {
    id: number;
    slug: string;
    title_ro: string;
    title_ru: string;
    content_ro: string;
    content_ru: string;
    type: 'partnership' | 'info' | 'medical';
    updated_at: string;
}

export type { Locale as Language } from '../i18n/config';

export interface ServicePage {
    id: number;
    type: 'service' | 'about' | 'general' | 'section' | 'partnership' | 'contact';
    slug: string;
    is_featured: number | boolean;
    image: string | null;
    title_ro: string;
    content_ro: string;
    title_ru?: string | null;
    content_ru?: string | null;
    // Stored as a Filament repeater on the page; these rows are not translated.
    contact_list?: Array<{
        nr: number;
        section: string;
        name: string;
        role?: string;
        phones?: string;
    }> | null;

    created_at?: string;
    updated_at?: string;
}

export interface Partner {
    id: number
    name: string
    logo: string
    link: string
    sort_order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

/**
 * `content_*` is only returned by `/events/{id}` — the list endpoint drops it,
 * so it stays optional here.
 */
export interface EventItem {
    id: number
    slug: string
    title_ro: string
    title_ru?: string | null
    description_ro: string
    description_ru?: string | null
    content_ro?: string
    content_ru?: string | null
    date: string
    image: string | null
    created_at?: string
    updated_at?: string
}

export interface Transparency {
    id: number
    name_ro: string
    name_ru: string
    slug: string
    sort_order: number
    created_at: string
    updated_at: string,
    documents: [
        {
            id: number,
            transparency_category_id: number,
            title_ro: string,
            title_ru: string,
            file_path: string,
            is_active: number,
            created_at: string,
            updated_at: string

        }
    ]
}