import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/utility-functions";
type PasswordInputProps = React.ComponentProps<typeof Input>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ className, ...props }, ref) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center border-b-2 transition-colors">
      <Input
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={cn(
          "flex-1 border-0 rounded-none shadow-none focus-visible:ring-0 placeholder:text-muted-foreground focus:placeholder:text-transparent",
          className,
        )}
        {...props}
      />

      <button
        type="button"
        onClick={() => setShowPassword(v => !v)}
        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <Eye /> : <EyeOff />}
      </button>
    </div>
  );
});
