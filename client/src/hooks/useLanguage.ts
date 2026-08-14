// src/hooks/useLanguage.ts
//
// Kept as an alias so existing imports keep working. The active language now
// comes from the `/$lang` URL segment rather than from a client-side store.

export { useLocale as useLanguage } from '../i18n'
