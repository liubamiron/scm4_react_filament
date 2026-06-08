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

    return content.replace(/src=(['"])(?:\.\.\/)*storage\//g, `src=$1${baseUrl}/storage/`);
}
