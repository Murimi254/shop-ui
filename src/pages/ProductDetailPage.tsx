import { useState } from "react";

import { Minus, Plus, Heart, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionLabel } from "@/components/ui/section-label";
import { ProductCard } from "@/components/ui/product-card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "@/store/slices/wishlistSlice";
import { PRODUCT_DETAIL, FLASH_SALE_PRODUCTS } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductDetailPage() {
  // In prod: fetch product by useParams().productId from your API
  const product = PRODUCT_DETAIL;

  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(product.id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(2);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        color: product.colors?.[selectedColor],
        size: selectedSize,
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // TODO: navigate to checkout
  };

  const thumbnails = product.images ?? [product.image];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Account", to: "/account" },
          { label: "Gaming", to: "/" },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* ─── Image Gallery ─── */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {thumbnails.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "w-[110px] h-[110px] bg-[#f5f5f5] rounded flex items-center justify-center border-2 transition-colors",
                  selectedImage === i ? "border-[#db4444]" : "border-transparent"
                )}
              >
                <img src={src} alt="" className="w-20 h-20 object-contain" />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 bg-[#f5f5f5] rounded flex items-center justify-center min-h-[400px]">
            <img
              src={thumbnails[selectedImage] ?? product.image}
              alt={product.name}
              className="w-full h-full object-contain max-h-[420px] p-6"
            />
          </div>
        </div>

        {/* ─── Product Info ─── */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-3">
            <StarRating rating={product.rating} reviews={product.reviews} size="md" />
            <span className="text-gray-400">|</span>
            {product.inStock ? (
              <span className="text-green-500 text-sm font-medium">In Stock</span>
            ) : (
              <span className="text-red-500 text-sm font-medium">Out of Stock</span>
            )}
          </div>

          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
            {product.description}
          </p>

          {/* Colours */}
          {product.colors && (
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-medium w-16">Colours:</span>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 transition-all",
                      selectedColor === i ? "border-black scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium w-16">Size:</span>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-9 h-9 border rounded text-sm font-medium transition-colors",
                      selectedSize === size
                        ? "bg-[#db4444] text-white border-[#db4444]"
                        : "border-gray-300 hover:border-[#db4444]"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Buy */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-sm font-semibold border-x border-gray-300 h-11 flex items-center justify-center">
                {String(quantity).padStart(2, "0")}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-11 flex items-center justify-center bg-[#db4444] text-white hover:bg-[#c03535] transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button size="lg" onClick={handleBuyNow} className="flex-1">
              Buy Now
            </Button>

            <button
              onClick={() => dispatch(toggleWishlist(product))}
              className={cn(
                "w-11 h-11 border rounded flex items-center justify-center transition-colors",
                isWishlisted
                  ? "border-[#db4444] text-[#db4444]"
                  : "border-gray-300 hover:border-[#db4444] hover:text-[#db4444]"
              )}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="border border-gray-200 rounded divide-y divide-gray-200">
            <div className="flex items-start gap-4 p-4">
              <Truck size={36} className="text-black flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-sm mb-1">Free Delivery</p>
                <p className="text-xs text-gray-500 underline cursor-pointer">
                  Enter your postal code for Delivery Availability
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <RefreshCw size={36} className="text-black flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-sm mb-1">Return Delivery</p>
                <p className="text-xs text-gray-500">
                  Free 30 Days Delivery Returns.{" "}
                  <span className="underline cursor-pointer">Details</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Items ─── */}
      <section>
        <SectionLabel tag="Related Item" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FLASH_SALE_PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
