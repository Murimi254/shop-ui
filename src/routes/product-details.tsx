import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/product-details')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/product-details"!</div>
}
