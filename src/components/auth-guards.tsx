import { LoadingSpinner } from "@/components/loading-spinner";
import { useAppSelector } from "@/hooks/hooks";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

type GuardProps = {
  children: ReactNode;
};

export function RequireAuth({ children }: GuardProps) {
  const { isAuthenticated, isInitialized } = useAppSelector(state => state.auth);

  if (!isInitialized) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

export function RequireAdmin({ children }: GuardProps) {
  const { isAuthenticated, isInitialized, user } = useAppSelector(state => state.auth);
  const isAdmin = user?.role === "admin" || user?.role === "superAdmin";

  if (!isInitialized) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/forbidden" replace />;

  return children;
}

export function RedirectAuthenticated({ children }: GuardProps) {
  const { isAuthenticated, isInitialized } = useAppSelector(state => state.auth);

  if (!isInitialized) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/account" replace />;

  return children;
}
