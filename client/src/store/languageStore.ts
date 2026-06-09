import { create } from 'zustand'

type Language = 'ro' | 'ru'

interface LanguageState {
    language: Language
    setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
    language: 'ro',
    setLanguage: (language) => {
        localStorage.setItem('language', language)
        set({ language })
    },
}))