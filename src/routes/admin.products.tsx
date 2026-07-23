import { RequireAdmin } from "@/components/auth-guards";
import { AdminProductsPage } from "@/pages/AdminProductsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAdmin>
      <AdminProductsPage />
    </RequireAdmin>
  );
}
