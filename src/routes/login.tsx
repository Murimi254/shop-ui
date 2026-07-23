import { RedirectAuthenticated } from "@/components/auth-guards";
import { LoginPage } from "@/pages/login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RedirectAuthenticated>
      <LoginPage />
    </RedirectAuthenticated>
  );
}
