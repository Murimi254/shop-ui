import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";

export function LoginForm() {
  return (
    <div className="h-screen">
      <form className="w-[24rem]">
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
            <Input
              name="password"
              placeholder="Password"
              type="password"
              className="border-0 border-b-2 rounded-none focus-visible:ring-0 shadow-none placeholder:text-muted-foreground focus:placeholder:text-transparent"
            />
            <FieldError />
          </Field>

          <Field className="flex-row">
            <Button className="bg-[#d74545] rounded cursor-pointer hover:bg-[#c93f3f] active:bg-[#b33636] flex-1">Log In</Button>
            <Button variant="ghost" className="cursor-pointer hover:bg-transparent hover:underline text-[#DB4444] hover:text-[#c93f3f]">
              Forget Password?
            </Button>
          </Field>

          <Field>
            <p className="text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="hover:underline decoration-2">
                Sign up
              </Link>
            </p>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
