import { CheckoutPage } from "@/pages/CheckoutPage";
import { requireAuth } from "@/utils/require-auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  component: RouteComponent,
  beforeLoad: requireAuth,
});

function RouteComponent() {
  return <CheckoutPage />;
}
