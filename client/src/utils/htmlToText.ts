// Plain text of a TinyMCE body, for card excerpts. Rendering the HTML itself
// would drag the article's images and tables into the card, which
// `line-clamp` cannot cut. Block ends get a space so paragraphs don't merge.
export function htmlToText(html: string): string {
    const spaced = html.replace(/<\/(p|div|li|h[1-6]|td|th|tr|blockquote)>|<br\s*\/?>/gi, ' $&');
    const doc = new DOMParser().parseFromString(spaced, 'text/html');

    return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}
