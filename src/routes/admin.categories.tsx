import { RequireAdmin } from "@/components/auth-guards";
import { AdminCategoriesPage } from "@/pages/AdminCategoriesPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/categories")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAdmin>
      <AdminCategoriesPage />
    </RequireAdmin>
  );
}
