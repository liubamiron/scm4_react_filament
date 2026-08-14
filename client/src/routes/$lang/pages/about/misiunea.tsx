import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/pages/about/misiunea')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pages/about/mosiunea"!</div>
}
