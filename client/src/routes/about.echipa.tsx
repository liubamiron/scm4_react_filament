import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/echipa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about/echipa"!</div>
}
