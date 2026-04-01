import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth";
import exclusiveApiSlice from "@/api/exclusive";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [exclusiveApiSlice.reducerPath]: exclusiveApiSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(exclusiveApiSlice.middleware),
});
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
