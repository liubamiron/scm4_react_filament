import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Partner } from "../types";

// Plain row of partner logos, like the original site: no cards, no heading,
// just logos on white so the strip reads as part of the footer.
//
// On phones the row doesn't fit, so it becomes a horizontal, swipeable
// gallery (scroll-snap) with prev/next arrows. From `md` up the logos wrap
// and center, and the arrows disappear.
export function PartnersStrip({ partners }: { partners: Partner[] }) {
    const storageUrl = import.meta.env.VITE_STORAGE_URL;
    const trackRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    // Arrows are only shown while the track actually overflows.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const update = () => {
            const { scrollLeft, scrollWidth, clientWidth } = track;
            setCanPrev(scrollLeft > 4);
            setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
        };

        update();
        track.addEventListener("scroll", update, { passive: true });
        // Observe the logos as well as the track: the track's own size doesn't
        // change when a lazily loaded logo makes the content overflow.
        const observer = new ResizeObserver(update);
        observer.observe(track);
        for (const child of track.children) observer.observe(child);

        return () => {
            track.removeEventListener("scroll", update);
            observer.disconnect();
        };
    }, [partners.length]);

    const scrollByPage = (direction: 1 | -1) => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
    };

    const arrowClass =
        "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-brand-900 shadow-sm transition hover:bg-brand-50 md:hidden";

    return (
        <div className="relative">
            {canPrev && (
                <button type="button" onClick={() => scrollByPage(-1)} aria-label="←" className={`${arrowClass} left-1`}>
                    <ChevronLeft className="h-5 w-5" />
                </button>
            )}
            {canNext && (
                <button type="button" onClick={() => scrollByPage(1)} aria-label="→" className={`${arrowClass} right-1`}>
                    <ChevronRight className="h-5 w-5" />
                </button>
            )}

            <div
                ref={trackRef}
                className="flex snap-x snap-mandatory items-center gap-10 overflow-x-auto px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center md:gap-x-16 md:gap-y-10 md:overflow-visible md:px-0"
            >
                {partners.map((partner) => (
                    <a
                        key={partner.id}
                        href={partner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={partner.name}
                        className="flex h-20 shrink-0 snap-center items-center opacity-90 transition hover:opacity-100"
                    >
                        <img
                            src={`${storageUrl}/${partner.logo}`}
                            alt={partner.name}
                            loading="lazy"
                            className="h-full w-auto max-w-[180px] object-contain"
                        />
                    </a>
                ))}
            </div>
        </div>
    );
}
