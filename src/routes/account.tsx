import { AccountPage } from "@/pages/AccountPage";
import { requireAuth } from "@/utils/require-auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: RouteComponent,
  beforeLoad: requireAuth,
});

function RouteComponent() {
  return <AccountPage />;
}
