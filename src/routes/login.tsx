import { LoginPage } from "@/pages/login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

// function RouteComponent() {
//   return <div>Hello "/login"!</div>
// }
