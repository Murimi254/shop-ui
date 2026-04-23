import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm text-gray-500 mb-8", className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight size={14} />}
          {item.to && i < items.length - 1 ? (
            <Link to={item.to} className="hover:text-black transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={cn(i === items.length - 1 && "text-black font-medium")}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
