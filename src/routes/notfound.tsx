import { NotFoundPage } from "@/components/not-found/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/notfound")({
  component: NotFoundPage,
});

// function RouteComponent() {
//   return <div>Hello "/not-fount"!</div>
// }
