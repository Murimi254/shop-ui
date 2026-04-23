import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItems, selectCartSubtotal, removeFromCart, updateQuantity, applyCoupon } from "@/store/slices/cartSlice";
import { formatPrice } from "@/utils/utility-functions";

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const [coupon, setCoupon] = useState("");

  const shipping = subtotal >= 140 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Cart" }]} />

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl font-semibold mb-4">Your cart is empty</p>
          <Button asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* ─── Cart Table ─── */}
          <div className="shadow-sm rounded overflow-hidden mb-8">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm">
              <span>Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Subtotal</span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-4 gap-4 items-center px-6 py-5 bg-white">
                  {/* Product */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="w-5 h-5 rounded-full bg-[#db4444] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#c03535] transition-colors"
                    >
                      <X size={12} />
                    </button>
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded bg-[#f5f5f5]" />
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </div>

                  {/* Price */}
                  <span className="text-center text-sm">{formatPrice(item.price)}</span>

                  {/* Quantity stepper */}
                  <div className="flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden w-20">
                      <span className="flex-1 text-center text-sm font-medium py-2">{String(item.quantity).padStart(2, "0")}</span>
                      <div className="flex flex-col border-l border-gray-300">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="px-2 py-0.5 hover:bg-gray-100"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="px-2 py-0.5 hover:bg-gray-100 border-t border-gray-200"
                        >
                          <ChevronDown size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <span className="text-right text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Actions Row ─── */}
          <div className="flex justify-between mb-8">
            <Button variant="outline" asChild>
              <Link to="/">Return To Shop</Link>
            </Button>
            <Button variant="outline">Update Cart</Button>
          </div>

          {/* ─── Coupon + Summary ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coupon */}
            <div className="flex gap-4 items-start">
              <Input placeholder="Coupon Code" value={coupon} onChange={e => setCoupon(e.target.value)} className="max-w-[200px]" />
              <Button onClick={() => dispatch(applyCoupon(coupon))} disabled={!coupon.trim()}>
                Apply Coupon
              </Button>
            </div>

            {/* Cart Total */}
            <div className="border border-gray-200 rounded p-6">
              <h3 className="text-lg font-semibold mb-5">Cart Total</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span>Shipping:</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link to="/checkout">Proceed to checkout</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
