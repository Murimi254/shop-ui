const LAST_ORDER_ID_KEY = "exclusive:lastOrderId";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export const checkoutStorage = {
  getLastOrderId(): string | null {
    if (!canUseLocalStorage()) return null;
    return localStorage.getItem(LAST_ORDER_ID_KEY);
  },
  setLastOrderId(orderId: string) {
    if (!canUseLocalStorage()) return;
    localStorage.setItem(LAST_ORDER_ID_KEY, orderId);
  },
};
