import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/about/istoric')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about/istoric"!</div>
}
