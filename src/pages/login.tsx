import { AuthLayout } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/slices/authSlice";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const showPasswordHandler = function () {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /api/auth/login → dispatch loginSuccess with real user
    dispatch(
      loginSuccess({
        id: "demo-user",
        firstName: "Md",
        lastName: "Rimel",
        email: form.email || "rimel1111@gmail.com",
      }),
    );
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-medium mb-2">Log in to Exclusive</h2>
      <p className="text-sm text-gray-500 mb-8">Enter your details below</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          placeholder="Email or Phone Number"
          value={form.email}
          onChange={handleChange("email")}
          className="border-0 border-b border-gray-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black bg-transparent"
        />
        <div className="flex justify-between border-0 border-b border-gray-300">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange("password")}
            className="border-0  rounded-none px-0 focus-visible:ring-0 focus-visible:border-black bg-transparent"
          />
          {showPassword ? <Eye onClick={showPasswordHandler} color="#787F8A" /> : <EyeOff onClick={showPasswordHandler} color="#787F8A" />}
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" size="lg">
            Log In
          </Button>
          <button type="button" className="text-sm text-[#db4444] hover:underline">
            Forgot Password?
          </button>
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
