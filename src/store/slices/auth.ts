import type { AuthStatusData, LoginResponseData, UserData } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatusData;
  error: string | null;
  isInitialized: boolean;
}

const initialState: InitialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called by RTK Query's onQueryStarted after a successful login
    setCredentials(state, action: PayloadAction<LoginResponseData>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.status = "authenticated";
      state.error = null;
    },

    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;
    },

    // Called after token refresh — only the access token changes
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },

    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
});

export const { clearCredentials, clearError, setAccessToken, setCredentials, setError, setInitialized } = authSlice.actions;
