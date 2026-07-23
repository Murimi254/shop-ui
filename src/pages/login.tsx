import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/api/exclusive";
import { LoginCredentialsSchema } from "@/types/zod-schemas";
import { getApiErrorMessage } from "@/utils/api-error";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const showPasswordHandler = function () {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsed = LoginCredentialsSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Please enter valid login details.");
      return;
    }

    try {
      await login(parsed.data).unwrap();
      await navigate({ to: "/account" });
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Unable to log in. Please check your details and try again."));
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-medium mb-2">Log in to Exclusive</h2>
      <p className="text-sm text-gray-500 mb-8">Enter your details below</p>

      <form onSubmit={handleSubmit} className="space-y-5">
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
            autoComplete="current-password"
            aria-invalid={Boolean(formError)}
            className="border-0  rounded-none px-0 focus-visible:ring-0 focus-visible:border-black bg-transparent"
          />
          {showPassword ? <Eye onClick={showPasswordHandler} color="#787F8A" /> : <EyeOff onClick={showPasswordHandler} color="#787F8A" />}
        </div>

        {formError && <p className="text-sm text-[#db4444]">{formError}</p>}

        <div className="flex items-center justify-between">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have account?{" "}
          <Link to="/sign-up" className="font-medium underline text-black hover:text-[#db4444]">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
