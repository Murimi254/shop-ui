import type { CreateOrderResponseData } from "@/types/types";
import { checkoutStorage } from "@/utils/checkout-storage";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CheckoutState {
  result: CreateOrderResponseData | null;
  lastOrderId: string | null;
  lastShipmentId: string | null;
}

const initialState: CheckoutState = {
  result: null,
  lastOrderId: checkoutStorage.getLastOrderId(),
  lastShipmentId: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    recordCheckoutResult(state, action: PayloadAction<CreateOrderResponseData>) {
      state.result = action.payload;
      state.lastOrderId = action.payload.orderId;
      state.lastShipmentId = action.payload.shipmentId;
    },
    setLastOrderId(state, action: PayloadAction<string>) {
      state.lastOrderId = action.payload;
    },
    setLastShipmentId(state, action: PayloadAction<string>) {
      state.lastShipmentId = action.payload;
    },
    clearCheckoutResult(state) {
      state.result = null;
    },
  },
});

export const { clearCheckoutResult, recordCheckoutResult, setLastOrderId, setLastShipmentId } = checkoutSlice.actions;

export default checkoutSlice.reducer;

export const selectCheckoutResult = (state: { checkout: CheckoutState }) => state.checkout.result;
export const selectLastOrderId = (state: { checkout: CheckoutState }) => state.checkout.lastOrderId;
export const selectLastShipmentId = (state: { checkout: CheckoutState }) => state.checkout.lastShipmentId;
