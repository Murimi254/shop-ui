import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/ui/breadcrumb";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectCartItems, selectCartSubtotal, applyCoupon } from "@/store/slices/cartSlice";
import { formatPrice, cn } from "@/lib/utils";

type PaymentMethod = "bank" | "cod";

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [saveInfo, setSaveInfo] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    companyName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
  });

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handlePlaceOrder = () => {
    // TODO: dispatch placeOrder thunk → POST /api/orders
    console.log("Order placed", { form, paymentMethod, items });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Account", to: "/account" },
          { label: "My Account", to: "/account" },
          { label: "Product", to: "/" },
          { label: "View Cart", to: "/cart" },
          { label: "CheckOut" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* ─── Billing Details ─── */}
        <div>
          <h2 className="text-2xl font-semibold mb-8">Billing Details</h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                First Name<span className="text-[#db4444]">*</span>
              </label>
              <Input placeholder="" value={form.firstName} onChange={handleChange("firstName")} className="bg-[#f5f5f5] border-none" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Company Name</label>
              <Input value={form.companyName} onChange={handleChange("companyName")} className="bg-[#f5f5f5] border-none" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Street Address<span className="text-[#db4444]">*</span>
              </label>
              <Input value={form.streetAddress} onChange={handleChange("streetAddress")} className="bg-[#f5f5f5] border-none" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Apartment, floor, etc. (optional)</label>
              <Input value={form.apartment} onChange={handleChange("apartment")} className="bg-[#f5f5f5] border-none" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Town/City<span className="text-[#db4444]">*</span>
              </label>
              <Input value={form.city} onChange={handleChange("city")} className="bg-[#f5f5f5] border-none" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Phone Number<span className="text-[#db4444]">*</span>
              </label>
              <Input type="tel" value={form.phone} onChange={handleChange("phone")} className="bg-[#f5f5f5] border-none" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Email Address<span className="text-[#db4444]">*</span>
              </label>
              <Input type="email" value={form.email} onChange={handleChange("email")} className="bg-[#f5f5f5] border-none" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setSaveInfo(v => !v)}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer",
                  saveInfo ? "bg-[#db4444] border-[#db4444]" : "border-gray-300",
                )}
              >
                {saveInfo && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className="text-sm">Save this information for faster check-out next time</span>
            </label>
          </div>
        </div>

        {/* ─── Order Summary ─── */}
        <div className="pt-12">
          {/* Items */}
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-[#f5f5f5] rounded" />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-3 text-sm border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span>Shipping:</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-base">{formatPrice(subtotal)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-4 mb-6">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <input type="radio" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} className="accent-[#db4444]" />
                <span className="text-sm">Bank</span>
              </div>
              {/* Payment icons placeholder */}
              <div className="flex gap-1">
                {["bKash", "VISA", "MC", "Nagad"].map(p => (
                  <span key={p} className="text-[10px] border border-gray-200 px-1.5 py-0.5 rounded font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-[#db4444]" />
              <span className="text-sm">Cash on delivery</span>
            </label>
          </div>

          {/* Coupon */}
          <div className="flex gap-4 mb-6">
            <Input placeholder="Coupon Code" value={coupon} onChange={e => setCoupon(e.target.value)} className="flex-1" />
            <Button onClick={() => dispatch(applyCoupon(coupon))} disabled={!coupon.trim()}>
              Apply Coupon
            </Button>
          </div>

          <Button size="lg" className="w-fit px-10" onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
