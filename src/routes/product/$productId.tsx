import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/product/$productId")({
  component: RouteComponent,
  //TODO Have a loader that fetches the product using the id
});

function RouteComponent() {
  return <ProductDetailPage />;
}
