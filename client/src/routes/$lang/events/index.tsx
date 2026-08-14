import { createFileRoute } from '@tanstack/react-router'
import { EventsPage } from '../../../pages/EventsPage.tsx'

export const Route = createFileRoute('/$lang/events/')({
    component: EventsPage,
})
