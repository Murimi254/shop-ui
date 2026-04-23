import { ContactPage } from "@/pages/ContactPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ContactPage />;
}
