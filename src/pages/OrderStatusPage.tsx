import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Download, Loader2, RefreshCw, XCircle } from "lucide-react";
import { API_BASE_URL } from "@/api/base-query-with-reauth";
import { useCancelOrderMutation, useGetOrderQuery } from "@/api/exclusive";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/hooks";
import { getApiErrorMessage } from "@/utils/api-error";
import { cn, formatPrice } from "@/utils/utility-functions";

const LAST_ORDER_ID_KEY = "exclusive:lastOrderId";

export function OrderStatusPage() {
  const accessToken = useAppSelector(state => state.auth.accessToken);
  const [orderId, setOrderId] = useState(() => localStorage.getItem(LAST_ORDER_ID_KEY) ?? "");
  const [lookupId, setLookupId] = useState(orderId);
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const orderQuery = useGetOrderQuery(lookupId, { skip: !lookupId });
  const [cancelOrder, cancelState] = useCancelOrderMutation();

  useEffect(() => {
    if (lookupId) localStorage.setItem(LAST_ORDER_ID_KEY, lookupId);
  }, [lookupId]);

  const order = orderQuery.data;
  const canCancel = order?.orderStatus === "PENDING" && order.paymentStatus !== "SUCCESS";
  const canDownloadInvoice = order?.paymentStatus === "SUCCESS";

  async function handleCancelOrder() {
    if (!order) return;
    try {
      await cancelOrder({ orderId: order._id }).unwrap();
    } catch {
      // The mutation state renders the normalized API error.
    }
  }

  async function handleDownloadInvoice() {
    if (!order || !accessToken) return;
    setDownloadError("");
    setIsDownloading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/invoice/${order._id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(typeof data?.message === "string" ? data.message : "Could not download invoice.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `invoice-${order._id}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "Could not download invoice.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Order Status" }]} />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium">Order ID</label>
          <Input value={orderId} onChange={event => setOrderId(event.target.value.trim())} placeholder="Paste an order ID" />
        </div>
        <Button onClick={() => setLookupId(orderId)} disabled={!orderId}>
          Check status
        </Button>
      </div>

      {!lookupId && (
        <div className="rounded border border-gray-200 p-8 text-center">
          <p className="mb-4 text-sm text-gray-600">No recent order was found on this browser.</p>
          <Button asChild>
            <Link to="/cart">Go to cart</Link>
          </Button>
        </div>
      )}

      {orderQuery.isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading order
        </div>
      )}

      {orderQuery.error && (
        <StatusMessage>{getApiErrorMessage(orderQuery.error, "Could not load this order.")}</StatusMessage>
      )}

      {order && (
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500">Order</p>
              <h1 className="break-all text-xl font-semibold">{order._id}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={order.orderStatus} tone={order.orderStatus === "CANCELLED" ? "danger" : "neutral"} />
              <StatusBadge label={order.paymentStatus} tone={order.paymentStatus === "SUCCESS" ? "success" : order.paymentStatus === "FAILED" ? "danger" : "neutral"} />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryRow label="Customer" value={order.fullName} />
            <SummaryRow label="Payment method" value={order.paymentMethod} />
            <SummaryRow label="Subtotal" value={formatPrice(order.subTotal)} />
            <SummaryRow label="Shipping" value={formatPrice(order.shippingCost)} />
            <SummaryRow label="Total" value={formatPrice(order.totalAmount)} strong />
          </div>

          {(cancelState.error || downloadError) && (
            <StatusMessage>{downloadError || getApiErrorMessage(cancelState.error, "Could not cancel this order.")}</StatusMessage>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => orderQuery.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleCancelOrder} disabled={!canCancel || cancelState.isLoading}>
              {cancelState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Cancel order
            </Button>
            <Button onClick={handleDownloadInvoice} disabled={!canDownloadInvoice || isDownloading}>
              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download invoice
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded border border-gray-100 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={cn("mt-1 text-sm", strong && "font-semibold")}>{value}</p>
    </div>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: "success" | "danger" | "neutral" }) {
  return (
    <span
      className={cn(
        "rounded px-2.5 py-1 text-xs font-medium",
        tone === "success" && "bg-green-50 text-green-700",
        tone === "danger" && "bg-[#db4444]/10 text-[#db4444]",
        tone === "neutral" && "bg-gray-100 text-gray-700",
      )}
    >
      {label}
    </span>
  );
}

function StatusMessage({ children }: { children: string }) {
  return (
    <div className="mb-6 flex items-start gap-2 rounded border border-[#db4444]/30 bg-[#db4444]/5 p-4 text-sm text-[#db4444]">
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}
