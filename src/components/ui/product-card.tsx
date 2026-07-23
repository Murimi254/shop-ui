import React from "react";
import { Heart, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { formatPrice, cn } from "@/utils/utility-functions";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { toggleWishlist, selectIsWishlisted } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import type { UiProduct } from "@/types/types";

interface ProductCardProps {
  product: UiProduct;
  showAddToCart?: boolean;
}

export function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(product.id));
  const canAddToCart = product.inStock !== false;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAddToCart) return;
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      }),
    );
  };

  return (
    <Link to="/product/$productId" params={{ productId: product.id }} className="group block">
      {/* Image container */}
      <div className="relative bg-[#f5f5f5] rounded overflow-hidden mb-3 aspect-square">
        {product.discount && (
          <Badge variant="sale" className="absolute top-3 left-3 z-10">
            -{product.discount}%
          </Badge>
        )}
        {product.isNew && !product.discount && (
          <Badge variant="new" className="absolute top-3 left-3 z-10">
            NEW
          </Badge>
        )}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              "w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm transition-colors",
              isWishlisted ? "text-[#db4444]" : "text-black hover:text-[#db4444]",
            )}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-black hover:text-[#db4444] transition-colors cursor-pointer">
            <Eye size={16} />
          </span>
        </div>

        {/* Image */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" loading="lazy" />
        </div>

        {/* Add To Cart slide-up bar */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-black text-white text-center py-2 text-sm font-medium transition-transform duration-200",
            !canAddToCart && "bg-gray-500",
            showAddToCart ? "translate-y-0" : "translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0",
          )}
        >
          <button onClick={handleAddToCart} disabled={!canAddToCart} className="w-full disabled:cursor-not-allowed">
            {canAddToCart ? "Add To Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="font-medium text-sm text-black mb-1 truncate">{product.name}</h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#db4444] font-semibold text-sm">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
        <StarRating rating={product.rating} reviews={product.reviews} />
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {product.colors.map(color => (
              <span key={color} className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: color }} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
