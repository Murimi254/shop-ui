import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import googleIcon from "../../../../../public/images/auth/googleIcon.png";

export function LoginForm() {
  return (
    <form className="w-[24rem] ">
      <h2 className="text-[2.25rem] mb-6">Create an Account</h2>
      <p className="mb-12">Enter your details below</p>
      <FieldGroup>
        <Field>
          <Input
            name="fullName"
            placeholder="John Doe"
            className="border-0 border-b-2 rounded-none focus-visible:ring-0 shadow-none placeholder:text-muted-foreground focus:placeholder:text-transparent"
          />
        </Field>
        <Field>
          <Input
            name="email"
            placeholder="johndoe@gmail.com"
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
        <Field>
          <div>
            <Input
              name="confirmPassword"
              placeholder="Confirm Password"
              type="password"
              className="border-0 border-b-2 rounded-none focus-visible:ring-0 shadow-none placeholder:text-muted-foreground focus:placeholder:text-transparent"
            />
          </div>
          <FieldError />
        </Field>
        <Field>
          <Button className="bg-[#d74545] rounded cursor-pointer hover:bg-[#c93f3f] active:bg-[#b33636]">Create Account</Button>
        </Field>
        <Field>
          <Button variant="outline" className="cursor-pointer">
            <img src={googleIcon} alt="Sign up with google image" />
            <span>Sing up with Google</span>
          </Button>
        </Field>
        <Field>
          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="hover:underline decoration-2">
              Log in
            </Link>
          </p>
        </Field>
      </FieldGroup>
    </form>
  );
}
