import { WishlistPage } from "@/pages/WishlistPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wishlist")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WishlistPage />;
}
