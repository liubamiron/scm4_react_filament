// Links built from the hospital's `footer.*` contact strings, shared by the
// home page info cards and the mobile menu.

// Google Maps search for the street address; opens the app on phones.
export const MAPS_URL =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("str. Columna 150, Chișinău, Moldova");

export function telHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
