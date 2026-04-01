import type { AuthStatusData, UserData } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

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
  reducers: {},
});
