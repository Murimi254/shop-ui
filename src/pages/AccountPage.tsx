import { useLogoutMutation } from "@/api/exclusive";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/hooks";
import { cn } from "@/utils/utility-functions";
import { useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
type Section = "profile" | "address" | "payment" | "returns" | "cancellations" | "wishlist";

export function AccountPage() {
  const user = useAppSelector(state => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("profile");

  const [form, setForm] = useState({
    firstName: user?.fullName.split(" ")[0] ?? "",
    lastName: user?.fullName.split(" ")[1] ?? "",
    email: user?.email ?? "",
    address: user?.fullName ?? "", //TODO PASS THE ADDRESS FROM THE BACKEND
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    // dispatch(
    //   updateProfile({
    //     firstName: form.firstName,
    //     lastName: form.lastName,
    //     email: form.email,
    //     address: form.address,
    //   }),
    // );
    // TODO: PATCH /api/user/profile
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      await navigate({ to: "/login" });
    }
  };

  const NAV = [
    {
      heading: "Manage My Account",
      items: [
        { key: "profile" as Section, label: "My Profile" },
        { key: "address" as Section, label: "Address Book" },
        { key: "payment" as Section, label: "My Payment Options" },
      ],
    },
    {
      heading: "My Orders",
      items: [
        { key: "returns" as Section, label: "My Returns" },
        { key: "cancellations" as Section, label: "My Cancellations" },
      ],
    },
    {
      heading: "",
      items: [{ key: "wishlist" as Section, label: "My WishList" }],
    },
  ];

  return (
    <div className="max-w-300 mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "My Account" }]} />
        <p className="text-sm">
          Welcome!{" "}
          <span className="text-[#db4444] font-medium">
            {user?.fullName.split(" ")[0]} {user?.fullName.split(" ")[1]}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-12 mt-4">
        {/* ─── Sidebar ─── */}
        <aside>
          {NAV.map(group => (
            <div key={group.heading} className="mb-5">
              {group.heading && <p className="font-semibold text-sm mb-3">{group.heading}</p>}
              <ul className="space-y-2 pl-2">
                {group.items.map(item => (
                  <li key={item.key}>
                    <button
                      onClick={() => setActiveSection(item.key)}
                      className={cn(
                        "text-sm transition-colors",
                        activeSection === item.key ? "text-[#db4444] font-medium" : "text-gray-600 hover:text-black",
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm text-gray-500 hover:text-[#db4444] transition-colors mt-4 disabled:opacity-60"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </aside>

        {/* ─── Main Content ─── */}
        <div className="bg-white shadow-sm rounded-sm p-8">
          {activeSection === "profile" && (
            <>
              <h2 className="text-[#db4444] font-semibold text-lg mb-6">Edit Your Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">First Name</label>
                  <Input value={form.firstName} onChange={handleChange("firstName")} className="bg-[#f5f5f5] border-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Last Name</label>
                  <Input value={form.lastName} onChange={handleChange("lastName")} className="bg-[#f5f5f5] border-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input type="email" value={form.email} onChange={handleChange("email")} className="bg-[#f5f5f5] border-none" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Address</label>
                  <Input value={form.address} onChange={handleChange("address")} className="bg-[#f5f5f5] border-none" />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-4">Password Changes</h3>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Current Password"
                    value={form.currentPassword}
                    onChange={handleChange("currentPassword")}
                    className="bg-[#f5f5f5] border-none"
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={form.newPassword}
                    onChange={handleChange("newPassword")}
                    className="bg-[#f5f5f5] border-none"
                  />
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    className="bg-[#f5f5f5] border-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4">
                <button className="text-sm hover:text-[#db4444] transition-colors">Cancel</button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </>
          )}

          {activeSection !== "profile" && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">{NAV.flatMap(g => g.items).find(i => i.key === activeSection)?.label}</p>
              <p className="text-sm mt-2">This section will be wired to the backend.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
