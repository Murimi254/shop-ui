import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utility-functions";
import { Link } from "@tanstack/react-router";
import { Boxes, FolderTree, LayoutDashboard, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";

type AdminLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
};

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Products", to: "/admin/products", icon: Boxes },
  { label: "Categories", to: "/admin/categories", icon: FolderTree },
] as const;

export function AdminLayout({ title, description, children, actions }: AdminLayoutProps) {
  return (
    <div className="bg-[#f5f5f5]">
      <div className="mx-auto grid min-h-[calc(100vh-70px)] max-w-[1200px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px,1fr]">
        <aside className="h-fit rounded-md border border-gray-200 bg-white p-3">
          <div className="px-2 py-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">Admin</p>
            <p className="mt-1 text-sm font-semibold">Store control</p>
          </div>
          <nav className="mt-2 space-y-1">
            {ADMIN_NAV.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded px-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-black",
                    "[&.active]:bg-[#db4444]/10 [&.active]:font-medium [&.active]:text-[#db4444]",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-gray-100 px-2 pt-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/">Back to shop</Link>
            </Button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">{description}</p>
            </div>
            {actions}
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
