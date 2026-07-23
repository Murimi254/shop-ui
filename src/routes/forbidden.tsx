import { ForbiddenPage } from "@/pages/ForbiddenPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forbidden")({
  component: ForbiddenPage,
});
