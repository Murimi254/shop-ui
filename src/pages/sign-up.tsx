import { useSignupMutation } from "@/api/exclusive";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignupCredentialsSchema } from "@/types/zod-schemas";
import { getApiErrorMessage } from "@/utils/api-error";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function SignUpPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", passwordConfirm: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const showPasswordHandler = function () {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (form.password !== form.passwordConfirm) {
      setFormError("Passwords do not match.");
      return;
    }

    const parsed = SignupCredentialsSchema.safeParse({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please enter valid signup details.");
      return;
    }

    try {
      await signup(parsed.data).unwrap();
      await navigate({ to: "/account" });
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Unable to create your account. Please try again."));
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-medium mb-2">Create an account</h2>
      <p className="text-sm text-gray-500 mb-8">Enter your details below</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          placeholder="Full name"
          value={form.fullName}
          onChange={handleChange("fullName")}
          autoComplete="name"
          aria-invalid={Boolean(formError)}
          className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black bg-transparent"
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange("email")}
          autoComplete="email"
          aria-invalid={Boolean(formError)}
          className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black bg-transparent"
        />
        <div className="flex justify-between border-0 border-b border-gray-300">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange("password")}
            autoComplete="new-password"
            aria-invalid={Boolean(formError)}
            className="border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black bg-transparent"
          />
          {showPassword ? <Eye onClick={showPasswordHandler} color="#787F8A" /> : <EyeOff onClick={showPasswordHandler} color="#787F8A" />}
        </div>
        <div className="flex justify-between border-0 border-b border-gray-300">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={form.passwordConfirm}
            onChange={handleChange("passwordConfirm")}
            autoComplete="new-password"
            aria-invalid={Boolean(formError)}
            className="border-0 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black bg-transparent"
          />
          {showPassword ? <Eye onClick={showPasswordHandler} color="#787F8A" /> : <EyeOff onClick={showPasswordHandler} color="#787F8A" />}
        </div>

        {formError && <p className="text-sm text-[#db4444]">{formError}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have account?{" "}
          <Link to="/login" className="font-medium underline text-black hover:text-[#db4444]">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
