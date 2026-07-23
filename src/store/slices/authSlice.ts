import type { LoginResponseData, UserData } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  user: UserData | null;
  accessToken: string | null;
  error: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
};

type Credentials = Omit<LoginResponseData, "refreshToken">;

const initialState: InitialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  error: null,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called by RTK Query's onQueryStarted after a successful login
    login(state, action: PayloadAction<Credentials>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isInitialized = true;
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

export const { logout, clearError, setAccessToken, login, setError, setInitialized } = authSlice.actions;
