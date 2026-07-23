import type { LoginResponseData, UserData } from "@/types/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  user: UserData | null;
  accessToken: string | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
};

type Credentials = Omit<LoginResponseData, "refreshToken">;

const initialState: InitialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
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
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },

    // Called after token refresh; only the access token changes.
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },

    setInitialized(state) {
      state.isInitialized = true;
    },
  },
});

export const { logout, setAccessToken, login, setInitialized } = authSlice.actions;
