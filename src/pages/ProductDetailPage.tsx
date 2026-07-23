import { useState } from "react";

import { Minus, Plus, Heart, Truck, RefreshCw } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import { useGetProductQuery, useGetProductsQuery } from "@/api/exclusive";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductCard } from "@/components/ui/product-card";
import { SectionLabel } from "@/components/ui/section-label";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "@/store/slices/wishlistSlice";
import type { Product } from "@/data/products";
import { cn, formatPrice } from "@/utils/utility-functions";
export function ProductDetailPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const { data: product, isLoading, isError } = useGetProductQuery(productId);
  const { data: productsData } = useGetProductsQuery({ limit: 30 });

  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(selectIsWishlisted(productId));

  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="max-w-300 mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-[#f5f5f5] rounded min-h-100 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-24 w-full bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-300 mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Product not found</h1>
        <p className="text-gray-500">The product you are looking for is unavailable or may have been removed.</p>
      </div>
    );
  }

  const wishlistProduct: Product = {
    id: product._id,
    name: product.name,
    price: product.price,
    rating: 0,
    reviews: 0,
    image: product.imageUrl,
    category: product.category,
    description: product.description,
    inStock: product.quantity > 0,
  };
  const relatedProducts = productsData?.products.filter(item => item.category === product.category && item.id !== product._id).slice(0, 4) ?? [];

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity,
      }),
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // TODO: navigate to checkout
  };

  return (
    <div className="max-w-300 mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Products", to: "/" }, { label: product.category, to: "/" }, { label: product.name }]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Product image */}
        <div className="bg-[#f5f5f5] rounded flex items-center justify-center min-h-100">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain max-h-105 p-6" />
        </div>

        {/* ─── Product Info ─── */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-gray-500 capitalize">{product.category}</span>
            <span className="text-gray-400">|</span>
            {product.quantity > 0 ? (
              <span className="text-green-500 text-sm font-medium">In Stock</span>
            ) : (
              <span className="text-red-500 text-sm font-medium">Out of Stock</span>
            )}
          </div>

          <p className="text-2xl font-bold mb-4">{formatPrice(product.price)}</p>
          <p className="text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">{product.description}</p>

          <p className="text-sm text-gray-500 mb-6">{product.quantity} available</p>

          {/* Quantity + Buy */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-sm font-semibold border-x border-gray-300 h-11 flex items-center justify-center">
                {String(quantity).padStart(2, "0")}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                disabled={product.quantity === 0 || quantity >= product.quantity}
                className="w-10 h-11 flex items-center justify-center bg-[#db4444] text-white hover:bg-[#c03535] transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            <Button size="lg" onClick={handleBuyNow} disabled={product.quantity === 0} className="flex-1">
              Add To Cart
            </Button>

            <button
              onClick={() => dispatch(toggleWishlist(wishlistProduct))}
              className={cn(
                "w-11 h-11 border rounded flex items-center justify-center transition-colors",
                isWishlisted ? "border-[#db4444] text-[#db4444]" : "border-gray-300 hover:border-[#db4444] hover:text-[#db4444]",
              )}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Delivery info */}
          <div className="border border-gray-200 rounded divide-y divide-gray-200">
            <div className="flex items-start gap-4 p-4">
              <Truck size={36} className="text-black shrink-0 mt-1" />
              <div>
                <p className="font-medium text-sm mb-1">Free Delivery</p>
                <p className="text-xs text-gray-500 underline cursor-pointer">Enter your postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <RefreshCw size={36} className="text-black shrink-0 mt-1" />
              <div>
                <p className="font-medium text-sm mb-1">Return Delivery</p>
                <p className="text-xs text-gray-500">
                  Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <SectionLabel tag="Related Item" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
