import { RedirectAuthenticated } from "@/components/auth-guards";
import { SignUpPage } from "@/pages/sign-up";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RedirectAuthenticated>
      <SignUpPage />
    </RedirectAuthenticated>
  );
}
