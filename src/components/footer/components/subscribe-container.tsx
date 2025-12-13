import { Logo } from "@/components/header/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import type { FormEvent } from "react";

export function SubscribeContainer() {
  function submitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    // collect the data
    const fd = new FormData(form);
    const email = fd.get("email");

    // Ensure that the email is present before sending it to the backend
    if (!email) return;
    console.log(email);

    // Reset the form
    form.reset();
  }
  return (
    <section className="flex flex-col gap-2 h-48 w-56">
      <Logo />
      <p className="text-[20px]">Subscribe</p>
      <p>Get 10% off your first order</p>
      <form onSubmit={submitHandler} className="flex items-center focus-within:ring-2 rounded ring-2">
        <Input
          type="email"
          placeholder="Enter your email"
          name="email"
          required
          className="bg-transparent border-none shadow-none focus-visible:ring-0"
        />
        <Button className="bg-transparent">
          <SendHorizonal />
        </Button>
      </form>
    </section>
  );
}
