// The hospital's caduceus. The source image is white on transparent, so it is
// used as a mask: the colour comes from the `bg-*` class passed in.
export function Emblem({ className = "" }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={className}
            style={{
                maskImage: "url(/img/logo_white.png)",
                WebkitMaskImage: "url(/img/logo_white.png)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
            }}
        />
    );
}
