import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "@/components/header/header";
// import { Footer } from "@/components/footer/footer";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
}
