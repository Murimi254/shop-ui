import { RootLayout } from "@/components/layout/root-layout";
import { createRootRoute } from "@tanstack/react-router";
// import { Footer } from "@/components/footer/footer";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <RootLayout />
    </>
  );
}
