import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { RootLayout } from '../layouts/RootLayout'

export const Route = createRootRoute({
    component: () => (
        <RootLayout>
            {/* Renders what child routes declare in `head()` (hreflang links). */}
            <HeadContent />
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </RootLayout>
    ),
})