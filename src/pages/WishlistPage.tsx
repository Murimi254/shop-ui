import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectWishlistItems, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { formatPrice } from "@/utils/utility-functions";

export function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);

  return (
    <div className="max-w-300 mx-auto px-4 py-10">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-base font-medium">
          Wishlist <span className="text-gray-500">({items.length})</span>
        </h2>
        <Button
          variant="outline"
          onClick={() =>
            items.forEach(item =>
              dispatch(
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: 1,
                }),
              ),
            )
          }
          disabled={items.length === 0}
        >
          Move All To Bag
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-lg mb-4">Your wishlist is empty.</p>
          <Button asChild>
            <Link to="/">Shop Now</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(product => (
            <div key={product.id} className="group relative">
              {/* Image */}
              <div className="relative bg-[#f5f5f5] rounded overflow-hidden mb-3 aspect-square">
                {product.discount && (
                  <Badge variant="sale" className="absolute top-3 left-3 z-10">
                    -{product.discount}%
                  </Badge>
                )}
                <button
                  onClick={() => dispatch(removeFromWishlist(product.id))}
                  className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                >
                  <X size={14} />
                </button>
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
                {/* Add to cart overlay */}
                <button
                  onClick={() =>
                    dispatch(
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1,
                      }),
                    )
                  }
                  className="absolute bottom-0 left-0 right-0 bg-black text-white text-center py-2 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform"
                >
                  Add To Cart
                </button>
              </div>

              {/* Info */}
              <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#db4444] font-semibold text-sm">{formatPrice(product.price)}</span>
                {product.originalPrice && <span className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice)}</span>}
              </div>
              <StarRating rating={product.rating} reviews={product.reviews} />
            </div>
          ))}
        </div>
      )}

      {/* Just Arrived For You section */}
      <div className="mt-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-10 rounded bg-[#db4444]" />
            <span className="font-bold text-xl">Just For You</span>
          </div>
          <Button variant="outline">See All</Button>
        </div>
      </div>
    </div>
  );
}
