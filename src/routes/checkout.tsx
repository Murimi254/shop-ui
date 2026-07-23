import { RequireAuth } from "@/components/auth-guards";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  );
}
