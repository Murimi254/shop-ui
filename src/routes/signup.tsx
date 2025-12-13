import { AuthPage } from "@/features/auth/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: AuthPage,
});

// function RouteComponent() {
//   return <div>Hello "/signup"!</div>
// }
