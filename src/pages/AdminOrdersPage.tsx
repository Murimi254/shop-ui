import { useApproveCashPaymentMutation, useCancelOrderMutation, useGetAdminOrdersQuery } from "@/api/exclusive";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/utils/api-error";
import { cn, formatPrice } from "@/utils/utility-functions";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";

export function AdminOrdersPage() {
  const ordersQuery = useGetAdminOrdersQuery();
  const [approveCashPayment, approveState] = useApproveCashPaymentMutation();
  const [cancelOrder, cancelState] = useCancelOrderMutation();

  const orders = ordersQuery.data?.orders ?? [];
  const actionError = approveState.error || cancelState.error;

  async function handleApprove(orderId: string) {
    await approveCashPayment({ orderId }).unwrap().catch(() => undefined);
  }

  async function handleCancel(orderId: string) {
    await cancelOrder({ orderId }).unwrap().catch(() => undefined);
  }

  return (
    <AdminLayout
      title="Orders"
      description="Review customer orders, approve cash payments, and cancel unpaid orders when needed."
      actions={
        <Button variant="outline" onClick={() => ordersQuery.refetch()} disabled={ordersQuery.isFetching}>
          <RefreshCw className={cn("h-4 w-4", ordersQuery.isFetching && "animate-spin")} />
          Refresh
        </Button>
      }
    >
      {actionError && <StatusMessage tone="danger">{getApiErrorMessage(actionError, "Could not update this order.")}</StatusMessage>}
      {ordersQuery.isLoading && <p className="text-sm text-gray-600">Loading orders...</p>}
      {ordersQuery.error && <StatusMessage tone="danger">{getApiErrorMessage(ordersQuery.error, "Could not load orders.")}</StatusMessage>}

      {!ordersQuery.isLoading && orders.length === 0 && (
        <div className="rounded-md border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">{ordersQuery.data?.message ?? "No orders have been placed yet."}</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => {
                  const canApprove = order.paymentMethod === "CASH" && order.paymentStatus === "PENDING" && order.orderStatus !== "CANCELLED";
                  const canCancel = order.paymentStatus !== "SUCCESS" && order.orderStatus !== "CANCELLED";
                  return (
                    <tr key={order._id}>
                      <td className="px-4 py-4">
                        <p className="max-w-[180px] truncate font-medium">{order._id}</p>
                        <p className="text-xs text-gray-500">Subtotal {formatPrice(order.subTotal)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{order.fullName}</p>
                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p>{order.paymentMethod}</p>
                        <StatusBadge label={order.paymentStatus} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge label={order.orderStatus} />
                      </td>
                      <td className="px-4 py-4 font-semibold">{formatPrice(order.totalAmount)}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleApprove(order._id)} disabled={!canApprove || approveState.isLoading}>
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleCancel(order._id)} disabled={!canCancel || cancelState.isLoading}>
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "mt-1 inline-flex rounded px-2 py-1 text-xs font-medium",
        label === "SUCCESS" || label === "PAID"
          ? "bg-green-50 text-green-700"
          : label === "FAILED" || label === "CANCELLED"
            ? "bg-[#db4444]/10 text-[#db4444]"
            : "bg-gray-100 text-gray-700",
      )}
    >
      {label}
    </span>
  );
}

function StatusMessage({ children, tone }: { children: string; tone: "danger" }) {
  return (
    <div className={cn("mb-4 rounded-md border p-4 text-sm", tone === "danger" && "border-[#db4444]/30 bg-[#db4444]/5 text-[#db4444]")}>
      {children}
    </div>
  );
}
