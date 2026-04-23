import { store } from "@/store/store";
import { redirect } from "@tanstack/react-router";

// ─── Protected routes (redirect to /login if not authenticated) {account,checkout,}───────────────
export function requireAuth() {
  const authenticationStatus = store.getState().auth.status;
  if (authenticationStatus !== "authenticated") {
    throw redirect({ to: "/login" });
  }
}
