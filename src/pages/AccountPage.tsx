import { useState } from "react";
import type React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, MapPin, Package, User } from "lucide-react";
import { useGetOrderQuery, useLogoutMutation } from "@/api/exclusive";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { formatPrice, cn } from "@/utils/utility-functions";

type Section = "profile" | "shipment" | "orders" | "wishlist";

const LAST_ORDER_ID_KEY = "exclusive:lastOrderId";

const NAV: Array<{ key: Section; label: string; icon: React.ReactNode }> = [
  { key: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { key: "shipment", label: "Shipment", icon: <MapPin className="h-4 w-4" /> },
  { key: "orders", label: "Orders", icon: <Package className="h-4 w-4" /> },
  { key: "wishlist", label: "Wishlist", icon: <Heart className="h-4 w-4" /> },
];

export function AccountPage() {
  const user = useAppSelector(state => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const lastOrderId = localStorage.getItem(LAST_ORDER_ID_KEY) ?? "";
  const lastOrderQuery = useGetOrderQuery(lastOrderId, { skip: !lastOrderId });

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      await navigate({ to: "/login" });
    }
  };

  return (
    <div className="max-w-300 mx-auto px-4 py-8">
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
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm text-gray-500 hover:text-[#db4444] transition-colors mt-6 disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </aside>

        <div className="bg-white shadow-sm rounded-sm p-8">
          {activeSection === "profile" && (
            <section>
              <h2 className="text-[#db4444] font-semibold text-lg mb-6">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoTile label="Full name" value={user?.fullName ?? "Not available"} />
                <InfoTile label="Email" value={user?.email ?? "Not available"} />
                <InfoTile label="Role" value={user?.role ?? "Not available"} />
              </div>
            </section>
          )}

          {activeSection === "shipment" && (
            <section>
              <h2 className="text-[#db4444] font-semibold text-lg mb-3">Shipment</h2>
              <p className="text-sm text-gray-600 mb-6">
                Checkout saves your latest shipping address before placing an order. A saved-address view can be added after the backend exposes a customer shipment fetch endpoint.
              </p>
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

              {!lastOrderId && <p className="text-sm text-gray-600">No recent order is stored on this browser yet.</p>}
              {lastOrderQuery.isLoading && <p className="text-sm text-gray-600">Loading recent order...</p>}
              {lastOrderQuery.data && (
                <div className="rounded border border-gray-200 p-4">
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase text-gray-500">Recent order</p>
                      <p className="break-all text-sm font-medium">{lastOrderQuery.data._id}</p>
                    </div>
                    <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">{lastOrderQuery.data.orderStatus}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{lastOrderQuery.data.paymentMethod}</span>
                    <span className="font-semibold">{formatPrice(lastOrderQuery.data.totalAmount)}</span>
                  </div>
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

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-gray-100 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
