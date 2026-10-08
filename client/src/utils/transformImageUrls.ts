/**
 * Transform relative storage URLs to absolute backend URLs
 */
export function transformImageUrls(content: string): string {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const storageUrl = import.meta.env.VITE_STORAGE_URL;
    
    if (!storageUrl && !apiBaseUrl) {
        return content;
    }

    const baseUrl = storageUrl
        ? storageUrl.replace(/\/storage\/?$/, '')
        : apiBaseUrl?.replace(/\/api\/?$/, '') || '';

    // `href` too: PDFs linked from the editor are saved as `../storage/...` like images.
    return content.replace(/(src|href)=(['"])(?:\.\.\/)*storage\//g, `$1=$2${baseUrl}/storage/`);
}
