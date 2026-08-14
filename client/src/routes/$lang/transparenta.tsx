import { createFileRoute } from '@tanstack/react-router'
import { TransparencyPage } from '../../pages/TransparencyPage.tsx'

export const Route = createFileRoute('/$lang/transparenta')({
    component: TransparencyPage,
})
