import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { RootLayout } from '../layouts/RootLayout'

export const Route = createRootRoute({
    component: () => (
        <RootLayout>
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
        </RootLayout>
    ),
})