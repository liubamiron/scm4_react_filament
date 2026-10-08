import { createFileRoute } from '@tanstack/react-router'
import { LegislationPage } from '../../pages/LegislationPage.tsx'

export const Route = createFileRoute('/$lang/legislatie')({
    component: LegislationPage,
})
