import { LoginPage } from "@/features/auth/components/login/login-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

// function RouteComponent() {
//   return <div>Hello "/login"!</div>
// }
