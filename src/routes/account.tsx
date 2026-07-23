import { RequireAuth } from "@/components/auth-guards";
import { AccountPage } from "@/pages/AccountPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  );
}
