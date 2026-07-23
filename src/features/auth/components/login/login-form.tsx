import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { PasswordInput } from "../password-input";

export function LoginForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    // Send them to the server to verify the user
    // Get the data back and send it to Redux
    console.log({ ...data });
  }
  return (
    <div className="h-screen">
      <form onSubmit={handleSubmit} className="w-[24rem]">
        <h2 className="text-[2.25rem] mb-6">Log in to Exclusive</h2>
        <p className="mb-12">Enter your details below</p>
        <FieldGroup>
          <Field>
            <Input
              name="email"
              placeholder="Email e.g. johndoe@gmail.com"
              type="email"
              className="border-0 border-b-2 rounded-none focus-visible:ring-0 shadow-none placeholder:text-muted-foreground focus:placeholder:text-transparent"
            />
            <FieldError />
          </Field>
          <Field>
            <PasswordInput name="password" placeholder="password" />
            <FieldError />
          </Field>

          <Field className="flex-row">
            <Button className="bg-[#d74545] rounded cursor-pointer hover:bg-[#c93f3f] active:bg-[#b33636] flex-1">Log In</Button>
          </Field>

          <Field>
            <p className="text-center">
              Don't have an account?{" "}
              <Link to="/sign-up" className="hover:underline decoration-2">
                Sign up
              </Link>
            </p>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
