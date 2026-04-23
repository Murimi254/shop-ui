import { store } from "@/store";
import { redirect } from "@tanstack/react-router";

// ─── Protected routes (redirect to /login if not authenticated) {account,checkout,}───────────────
export function requireAuth() {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  if (!isAuthenticated) {
    throw redirect({ to: "/login" });
  }
}
