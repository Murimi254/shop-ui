import { useEffect, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, ChevronDown, ChevronUp, Loader2, X } from "lucide-react";
import { useCartPreviewMutation } from "@/api/exclusive";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { removeFromCart, selectCartItems, selectCartSubtotal, updateQuantity } from "@/store/slices/cartSlice";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatPrice } from "@/utils/utility-functions";

export function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const [previewCart, previewState] = useCartPreviewMutation();

  const cartPayload = useMemo(
    () => ({
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    }),
    [items],
  );

  useEffect(() => {
    if (cartPayload.items.length > 0) {
      previewCart(cartPayload);
    }
  }, [cartPayload, previewCart]);

  const preview = previewState.data;
  const shipping = preview?.shippingCost ?? 0;
  const total = preview?.total ?? subtotal + shipping;
  const canCheckout = Boolean(preview && !previewState.isLoading && !previewState.error);

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
          <div className="shadow-sm rounded overflow-hidden mb-8">
            <div className="grid grid-cols-4 gap-4 bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm">
              <span>Product</span>
              <span className="text-center">Price</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Subtotal</span>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-4 gap-4 items-center px-6 py-5 bg-white">
                  <div className="flex items-center gap-4 min-w-0">
                    <button
                      type="button"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="w-5 h-5 rounded-full bg-[#db4444] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#c03535] transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={12} />
                    </button>
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded bg-[#f5f5f5]" />
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </div>

                  <span className="text-center text-sm">{formatPrice(item.price)}</span>

                  <div className="flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden w-20">
                      <span className="flex-1 text-center text-sm font-medium py-2">{String(item.quantity).padStart(2, "0")}</span>
                      <div className="flex flex-col border-l border-gray-300">
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          disabled={Boolean(item.maxQuantity && item.quantity >= item.maxQuantity)}
                          className="px-2 py-0.5 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <ChevronUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          className="px-2 py-0.5 hover:bg-gray-100 border-t border-gray-200"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <ChevronDown size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <span className="text-right text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <Button variant="outline" asChild>
              <Link to="/">Return To Shop</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
            <div>
              {previewState.isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validating cart
                </div>
              )}
              {previewState.error && (
                <div className="flex items-start gap-2 rounded border border-[#db4444]/30 bg-[#db4444]/5 p-4 text-sm text-[#db4444]">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{getApiErrorMessage(previewState.error, "Could not validate this cart. Please adjust the items and try again.")}</span>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded p-6">
              <h3 className="text-lg font-semibold mb-5">Cart Total</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatPrice(preview?.subtotal ?? subtotal)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span>Shipping:</span>
                  <span className="font-medium">{previewState.isLoading ? "Checking" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">{formatPrice(total)}</span>
                </div>
              </div>
              {canCheckout ? (
                <Button className="w-full" size="lg" asChild>
                  <Link to="/checkout">Proceed to checkout</Link>
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  Proceed to checkout
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
