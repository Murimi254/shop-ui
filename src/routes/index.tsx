import App from "@/App";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

// function RouteComponent() {
//   return <div>Hello "/"!</div>;
// }
