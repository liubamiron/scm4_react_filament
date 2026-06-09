// src/hooks/useLanguage.ts

import { useLanguageStore } from '../store/languageStore'

export const useLanguage = () => {
    return useLanguageStore((state) => state.language)
}