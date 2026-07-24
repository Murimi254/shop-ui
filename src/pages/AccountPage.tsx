import { useState } from "react";
import type React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, MapPin, Package, User } from "lucide-react";
import { useGetCustomerOrdersQuery, useLogoutMutation } from "@/api/exclusive";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectLastShipmentId, setLastOrderId } from "@/store/slices/checkoutSlice";
import { checkoutStorage } from "@/utils/checkout-storage";
import { formatPrice, cn } from "@/utils/utility-functions";

type Section = "profile" | "shipment" | "orders" | "wishlist";

const NAV: Array<{ key: Section; label: string; icon: React.ReactNode }> = [
  { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { key: "shipment", label: "Shipment", icon: <MapPin className="h-4 w-4" /> },
  { key: "orders", label: "Orders", icon: <Package className="h-4 w-4" /> },
  { key: "wishlist", label: "Wishlist", icon: <Heart className="h-4 w-4" /> },
];

export function AccountPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const lastShipmentId = useAppSelector(selectLastShipmentId);
  const customerOrdersQuery = useGetCustomerOrdersQuery();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      await navigate({ to: "/login" });
    }
  };

  function rememberOrder(orderId: string) {
    dispatch(setLastOrderId(orderId));
    checkoutStorage.setLastOrderId(orderId);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "My Account" }]} />
        <p className="text-sm">
          Welcome <span className="text-[#db4444] font-medium">{user?.fullName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-12 mt-4">
        <aside>
          <p className="font-semibold text-sm mb-3">My Account</p>
          <ul className="space-y-2">
            {NAV.map(item => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm transition-colors",
                    activeSection === item.key ? "bg-[#db4444]/10 text-[#db4444] font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-black",
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="bg-white shadow-sm rounded-sm p-8">
          {activeSection === "profile" && (
            <section>
              <h2 className="text-[#db4444] font-semibold text-lg mb-6">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoTile label="Full name" value={user?.fullName ?? "Not available"} />
                <InfoTile label="Email" value={user?.email ?? "Not available"} />
                <InfoTile label="Role" value={user?.role ?? "Not available"} />
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex min-h-[88px] w-full items-center justify-between gap-4 rounded border border-[#db4444] bg-[#db4444] p-4 text-left text-white shadow-sm transition-colors hover:bg-[#c03535] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db4444]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                  aria-label={isLoggingOut ? "Logging out" : "Logout"}
                >
                  <span>
                    <span className="block text-xs text-white/80">Account</span>
                    <span className="mt-1 block text-sm font-semibold">{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <LogOut className="h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </section>
          )}

          {activeSection === "shipment" && (
            <section>
              <h2 className="text-[#db4444] font-semibold text-lg mb-3">Shipment</h2>
              <p className="text-sm text-gray-600 mb-6">
                Checkout saves your latest shipping address before placing an order. A saved-address view can be added after the backend exposes a customer shipment fetch endpoint.
              </p>
              {lastShipmentId && (
                <div className="mb-6 rounded border border-gray-200 p-4">
                  <p className="text-xs uppercase text-gray-500">Latest shipment ID</p>
                  <p className="break-all text-sm font-medium">{lastShipmentId}</p>
                </div>
              )}
              <Button asChild>
                <Link to="/checkout">Go to checkout</Link>
              </Button>
            </section>
          )}

          {activeSection === "orders" && (
            <section>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-[#db4444] font-semibold text-lg">Orders</h2>
                <Button variant="outline" asChild>
                  <Link to="/order-status">Open order status</Link>
                </Button>
              </div>

              {customerOrdersQuery.isLoading && <p className="text-sm text-gray-600">Loading your orders...</p>}
              {customerOrdersQuery.error && <p className="text-sm text-[#db4444]">Could not load your order history.</p>}
              {customerOrdersQuery.data?.orders.length === 0 && (
                <div className="rounded border border-gray-200 p-6 text-sm text-gray-600">
                  <p>{customerOrdersQuery.data.message ?? "You have not placed any orders yet."}</p>
                </div>
              )}
              {customerOrdersQuery.data && customerOrdersQuery.data.orders.length > 0 && (
                <div className="space-y-3">
                  {customerOrdersQuery.data.orders.map(order => (
                    <div key={order._id} className="rounded border border-gray-200 p-4">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs uppercase text-gray-500">{formatOrderDate(order.createdAt)}</p>
                          <p className="break-all text-sm font-medium">{order._id}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{order.orderStatus}</span>
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{order.paymentStatus}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm">
                          <span>{order.paymentMethod}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/order-status" onClick={() => rememberOrder(order._id)}>
                            View status
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === "wishlist" && (
            <section>
              <h2 className="text-[#db4444] font-semibold text-lg mb-3">Wishlist</h2>
              <p className="text-sm text-gray-600 mb-6">Your wishlist remains available on its dedicated page.</p>
              <Button asChild>
                <Link to="/wishlist">View wishlist</Link>
              </Button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function formatOrderDate(value?: string) {
  if (!value) return "Order";
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-gray-100 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
