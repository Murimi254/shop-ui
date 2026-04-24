import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";
import exclusiveApiSlice from "@/api/exclusive";
import { setupListeners } from "@reduxjs/toolkit/query";
import cartReducer from "./slices/cartSlice";
import wishListReducer from "./slices/wishlistSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartReducer,
    wishlist: wishListReducer,
    ui: uiReducer,
    [exclusiveApiSlice.reducerPath]: exclusiveApiSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(exclusiveApiSlice.middleware),
});
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
