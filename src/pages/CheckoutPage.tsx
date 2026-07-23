import React, { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Banknote, CheckCircle2, Loader2, Smartphone } from "lucide-react";
import {
  useCartPreviewMutation,
  useCreateOrderMutation,
  useCreateShipmentMutation,
  useInitiateSTKPushMutation,
} from "@/api/exclusive";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { clearCart, selectCartItems, selectCartSubtotal } from "@/store/slices/cartSlice";
import type { CreateOrderResponseData } from "@/types/types";
import { getApiErrorMessage } from "@/utils/api-error";
import { cn, formatPrice } from "@/utils/utility-functions";

type PaymentMethod = "MPESA" | "CASH";

type CheckoutForm = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
};

const initialForm: CheckoutForm = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  phoneNumber: "",
};

export function CheckoutPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MPESA");
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<CreateOrderResponseData | null>(null);

  const [previewCart, previewState] = useCartPreviewMutation();
  const [createShipment, createShipmentState] = useCreateShipmentMutation();
  const [createOrder, createOrderState] = useCreateOrderMutation();
  const [initiateSTKPush, initiateSTKPushState] = useInitiateSTKPushMutation();

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
  const isSubmitting = createShipmentState.isLoading || createOrderState.isLoading || initiateSTKPushState.isLoading;

  const handleChange = (field: keyof CheckoutForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    setSubmitError("");
  };

  async function handlePlaceOrder() {
    setSubmitError("");
    const validation = validateCheckoutForm(form);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    if (cartPayload.items.length === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    const normalizedPhoneNumber = normalizeKenyanPhoneNumber(form.phoneNumber);
    if (!normalizedPhoneNumber) {
      setFieldErrors(prev => ({ ...prev, phoneNumber: "Enter a valid Kenyan phone number, for example 0712345678." }));
      return;
    }

    try {
      await previewCart(cartPayload).unwrap();
      await createShipment({
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim() || undefined,
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
      }).unwrap();

      const order = await createOrder({
        items: cartPayload.items,
        paymentMethod,
      }).unwrap();

      if (paymentMethod === "MPESA") {
        await initiateSTKPush({
          orderId: order.orderId,
          phoneNumber: normalizedPhoneNumber,
        }).unwrap();
      }

      localStorage.setItem("exclusive:lastOrderId", order.orderId);
      setCreatedOrder(order);
      dispatch(clearCart());
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Could not place your order. Please try again."));
    }
  }

  if (createdOrder) {
    return (
      <div className="max-w-[900px] mx-auto px-4 py-16">
        <div className="border border-gray-200 rounded p-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
          <h1 className="text-2xl font-semibold mb-2">Order placed</h1>
          <p className="text-sm text-gray-600 mb-6">
            Order {createdOrder.orderId} is {createdOrder.paymentMethod === "MPESA" ? "waiting for MPESA payment confirmation." : "pending cash payment."}
          </p>
          <div className="mx-auto mb-8 max-w-sm space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span>Total:</span>
              <span className="font-semibold">{formatPrice(createdOrder.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="font-semibold">{createdOrder.paymentMethod}</span>
            </div>
          </div>
          <Button asChild>
            <Link to="/">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Account", to: "/account" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl font-semibold mb-4">Your cart is empty</p>
          <Button asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-semibold mb-8">Shipping Details</h2>
            <div className="space-y-5">
              <CheckoutField
                label="Address line 1"
                required
                value={form.addressLine1}
                error={fieldErrors.addressLine1}
                onChange={handleChange("addressLine1")}
              />
              <CheckoutField label="Address line 2" value={form.addressLine2} error={fieldErrors.addressLine2} onChange={handleChange("addressLine2")} />
              <CheckoutField label="City" required value={form.city} error={fieldErrors.city} onChange={handleChange("city")} />
              <CheckoutField label="County / State" required value={form.state} error={fieldErrors.state} onChange={handleChange("state")} />
              <CheckoutField label="Postal code" required value={form.postalCode} error={fieldErrors.postalCode} onChange={handleChange("postalCode")} />
              <CheckoutField
                label="Phone number"
                required
                type="tel"
                value={form.phoneNumber}
                error={fieldErrors.phoneNumber}
                onChange={handleChange("phoneNumber")}
              />
            </div>
          </div>

          <div className="pt-12">
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-[#f5f5f5] rounded" />
                    <div className="min-w-0">
                      <span className="block truncate text-sm">{item.name}</span>
                      <span className="text-xs text-gray-500">Qty {item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatPrice(preview?.subtotal ?? subtotal)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span>Shipping:</span>
                <span className="font-medium">{previewState.isLoading ? "Checking" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-base">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <PaymentOption
                checked={paymentMethod === "MPESA"}
                icon={<Smartphone className="h-4 w-4" />}
                label="MPESA"
                description="Send an STK prompt to the phone number above."
                onChange={() => setPaymentMethod("MPESA")}
              />
              <PaymentOption
                checked={paymentMethod === "CASH"}
                icon={<Banknote className="h-4 w-4" />}
                label="Cash on delivery"
                description="Order is paid manually when received."
                onChange={() => setPaymentMethod("CASH")}
              />
            </div>

            {(previewState.error || submitError) && (
              <div className="mb-6 flex items-start gap-2 rounded border border-[#db4444]/30 bg-[#db4444]/5 p-4 text-sm text-[#db4444]">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{submitError || getApiErrorMessage(previewState.error, "Could not validate this cart.")}</span>
              </div>
            )}

            <Button size="lg" className="w-full sm:w-fit px-10" onClick={handlePlaceOrder} disabled={previewState.isLoading || isSubmitting}>
              {previewState.isLoading || isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Placing order
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutField({
  label,
  required,
  error,
  ...props
}: React.ComponentProps<typeof Input> & {
  label: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">
        {label}
        {required && <span className="text-[#db4444]">*</span>}
      </label>
      <Input {...props} aria-invalid={Boolean(error)} className="bg-[#f5f5f5] border-none" />
      {error && <p className="mt-1 text-xs text-[#db4444]">{error}</p>}
    </div>
  );
}

function PaymentOption({
  checked,
  icon,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  icon: React.ReactNode;
  label: string;
  description: string;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded border p-4 transition-colors",
        checked ? "border-[#db4444] bg-[#db4444]/5" : "border-gray-200 hover:border-gray-300",
      )}
    >
      <input type="radio" checked={checked} onChange={onChange} className="mt-1 accent-[#db4444]" />
      <span className="mt-0.5 text-[#db4444]">{icon}</span>
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-gray-500">{description}</span>
      </span>
    </label>
  );
}

function validateCheckoutForm(form: CheckoutForm) {
  const errors: Partial<Record<keyof CheckoutForm, string>> = {};
  if (!form.addressLine1.trim()) errors.addressLine1 = "Address line 1 is required.";
  if (!form.city.trim()) errors.city = "City is required.";
  if (!form.state.trim()) errors.state = "County or state is required.";
  if (!form.postalCode.trim()) errors.postalCode = "Postal code is required.";
  if (!form.phoneNumber.trim()) errors.phoneNumber = "Phone number is required.";
  return { isValid: Object.keys(errors).length === 0, errors };
}

function normalizeKenyanPhoneNumber(value: string) {
  const cleaned = value.replace(/[\s-]/g, "");
  const withoutPlus = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  const normalized = withoutPlus.startsWith("0") ? `254${withoutPlus.slice(1)}` : withoutPlus;
  return /^254(?:7|1)\d{8}$/.test(normalized) ? normalized : null;
}
