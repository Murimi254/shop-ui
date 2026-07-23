import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity?: number;
  color?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.maxQuantity = action.payload.maxQuantity ?? existing.maxQuantity;
        existing.quantity = clampQuantity(existing.quantity + action.payload.quantity, existing.maxQuantity);
      } else {
        state.items.push({ ...action.payload, quantity: clampQuantity(action.payload.quantity, action.payload.maxQuantity) });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity = clampQuantity(action.payload.quantity, item.maxQuantity);
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

function clampQuantity(quantity: number, maxQuantity?: number) {
  const minimumQuantity = Math.max(1, quantity);
  return maxQuantity ? Math.min(minimumQuantity, maxQuantity) : minimumQuantity;
}

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
