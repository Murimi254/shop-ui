import { RequireAuth } from "@/components/auth-guards";
import { OrderStatusPage } from "@/pages/OrderStatusPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/order-status")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAuth>
      <OrderStatusPage />
    </RequireAuth>
  );
}
