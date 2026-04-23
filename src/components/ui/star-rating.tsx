import { Star } from "lucide-react";
import { cn } from "@/utils/utility-functions";
interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({ rating, reviews, size = "sm", className }: StarRatingProps) {
  const starSize = size === "sm" ? 14 : 18;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map(star => {
        const filled = star <= Math.floor(rating);
        const half = !filled && star - 0.5 <= rating;
        return <Star key={star} size={starSize} className={cn(filled || half ? "text-[#ffad33] fill-[#ffad33]" : "text-gray-300 fill-gray-300")} />;
      })}
      {reviews !== undefined && <span className="text-xs text-gray-500 ml-1">({reviews})</span>}
    </div>
  );
}
