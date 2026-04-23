import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  // Seed a demo user so account page renders properly out of the box
  user: {
    id: "demo-user",
    firstName: "Md",
    lastName: "Rimel",
    email: "rimel1111@gmail.com",
    address: "Kingston, 5236, United State",
  },
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // TODO: replace these with createAsyncThunk calls wired to your backend
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } =
  authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
