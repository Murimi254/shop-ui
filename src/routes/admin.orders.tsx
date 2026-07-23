import { RequireAdmin } from "@/components/auth-guards";
import { AdminOrdersPage } from "@/pages/AdminOrdersPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAdmin>
      <AdminOrdersPage />
    </RequireAdmin>
  );
}
