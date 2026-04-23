import { SignUpPage } from "@/pages/sign-up";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
});

// function RouteComponent() {
//   return <div>Hello "/signup"!</div>
// }
