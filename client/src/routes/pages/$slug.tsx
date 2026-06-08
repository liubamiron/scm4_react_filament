import { createFileRoute } from '@tanstack/react-router'
import {DynamicPage} from "../../pages/DinamicPage.tsx";

export const Route = createFileRoute('/pages/$slug')({
    component: DynamicPage,
})