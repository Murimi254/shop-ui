import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});
