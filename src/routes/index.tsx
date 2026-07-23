import App from "@/App";
import { createFileRoute } from "@tanstack/react-router";

type CatalogSearch = {
  q?: string;
  category?: string;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => {
    const parsedSearch: CatalogSearch = {};
    if (typeof search.q === "string" && search.q.trim()) parsedSearch.q = search.q.trim();
    if (typeof search.category === "string" && search.category.trim()) parsedSearch.category = search.category.trim();
    return parsedSearch;
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <App />;
}
