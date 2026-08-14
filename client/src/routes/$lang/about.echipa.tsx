import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/about/echipa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about/echipa"!</div>
}
