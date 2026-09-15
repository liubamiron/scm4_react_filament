// Full-page loading / error / empty message, same look on every page.
export function PageStatus({ children, error = false }: { children: React.ReactNode; error?: boolean }) {
    return (
        <div className={`page-status ${error ? "text-red-600" : "animate-pulse"}`}>
            <p>{children}</p>
        </div>
    );
}
