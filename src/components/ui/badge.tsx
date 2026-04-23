import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "sale" | "new" | "default";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold text-white",
        variant === "sale" && "bg-[#db4444]",
        variant === "new" && "bg-[#00ff66] text-black",
        variant === "default" && "bg-black",
        className
      )}
      {...props}
    />
  );
}
