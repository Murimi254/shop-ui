import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export function ForbiddenPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#db4444]/10 text-[#db4444]">
        <ShieldAlert className="h-7 w-7" />
      </div>
      <h1 className="text-2xl font-semibold">Access denied</h1>
      <p className="mt-3 text-sm text-gray-600">Your account does not have permission to view the admin area.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/">Back to shop</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/account">My account</Link>
        </Button>
      </div>
    </div>
  );
}
