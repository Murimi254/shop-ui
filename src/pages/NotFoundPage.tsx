import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function NotFoundPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "404 Error" }]} />

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-[110px] font-bold leading-none tracking-tight mb-6">404 Not Found</h1>
        <p className="text-sm text-gray-500 mb-10 max-w-sm">Your visited page not found. You may go home page.</p>
        <Button size="lg" asChild>
          <Link to="/">Back to home page</Link>
        </Button>
      </div>
    </div>
  );
}
