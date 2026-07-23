import { useInitializeAuthQuery } from "@/api/exclusive";
import { useAppDispatch } from "@/hooks/hooks";
import { setInitialized } from "@/store/slices/authSlice";
import { tokenStorage } from "@/utils/token-storage";
import { Outlet } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AnnouncementBar } from "./announcement-bar";
import { Footer } from "./footer";
import { Header } from "./header";

export function RootLayout() {
  const dispatch = useAppDispatch();
  const hasRefreshToken = useMemo(() => Boolean(tokenStorage.getRefreshToken()), []);
  useInitializeAuthQuery(undefined, { skip: !hasRefreshToken });

  useEffect(() => {
    if (!hasRefreshToken) dispatch(setInitialized());
  }, [dispatch, hasRefreshToken]);

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
