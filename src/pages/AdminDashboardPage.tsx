import { useGetAdminCategoriesQuery, useGetAdminOrdersQuery, useGetAdminProductsQuery } from "@/api/exclusive";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/utility-functions";
import { Link } from "@tanstack/react-router";
import { Boxes, FolderTree, ShoppingBag, WalletCards } from "lucide-react";
import type { ReactNode } from "react";

export function AdminDashboardPage() {
  const ordersQuery = useGetAdminOrdersQuery();
  const productsQuery = useGetAdminProductsQuery({ limit: 100 });
  const categoriesQuery = useGetAdminCategoriesQuery();

  const orders = ordersQuery.data?.orders ?? [];
  const products = productsQuery.data?.products ?? [];
  const categories = categoriesQuery.data ?? [];
  const pendingCashOrders = orders.filter(order => order.paymentMethod === "CASH" && order.paymentStatus === "PENDING");
  const revenue = orders.filter(order => order.paymentStatus === "SUCCESS").reduce((sum, order) => sum + order.totalAmount, 0);
  const lowStockProducts = products.filter(product => product.quantity <= 5);

  return (
    <AdminLayout
      title="Dashboard"
      description="Monitor store activity, pending payments, product stock, and catalog coverage."
      actions={
        <Button asChild>
          <Link to="/admin/products">Add product</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Orders" value={orders.length} icon={<ShoppingBag className="h-5 w-5" />} />
        <Metric label="Paid revenue" value={formatPrice(revenue)} icon={<WalletCards className="h-5 w-5" />} />
        <Metric label="Products" value={products.length} icon={<Boxes className="h-5 w-5" />} />
        <Metric label="Categories" value={categories.length} icon={<FolderTree className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-md border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold">Pending cash payments</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/orders">Review orders</Link>
            </Button>
          </div>
          {pendingCashOrders.length === 0 ? (
            <p className="text-sm text-gray-600">No cash payments need approval.</p>
          ) : (
            <div className="space-y-3">
              {pendingCashOrders.slice(0, 5).map(order => (
                <div key={order._id} className="flex items-center justify-between gap-4 rounded border border-gray-100 p-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{order.fullName}</p>
                    <p className="truncate text-xs text-gray-500">{order._id}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-md border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold">Low stock</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/products">Manage stock</Link>
            </Button>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-gray-600">All listed products have more than five units available.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map(product => (
                <div key={product._id} className="flex items-center justify-between gap-4 rounded border border-gray-100 p-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="truncate text-xs text-gray-500">{product.category}</p>
                  </div>
                  <span className="rounded bg-[#db4444]/10 px-2 py-1 text-xs font-medium text-[#db4444]">{product.quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-gray-700">{icon}</div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
