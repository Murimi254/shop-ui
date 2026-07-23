import { RequireAdmin } from "@/components/auth-guards";
import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <RequireAdmin>
      <Outlet />
    </RequireAdmin>
  );
}
