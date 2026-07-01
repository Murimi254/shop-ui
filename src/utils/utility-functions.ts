import type { ApiProduct, UiProduct } from "@/types/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `KSh ${amount.toLocaleString()}`;
}

export function calculateDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

export function toUiProducts(product: ApiProduct, index: number): UiProduct {
  const hasDiscount = index % 3 === 0;
  const discount = hasDiscount ? 20 + (index % 4) * 5 : undefined;
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    badge: "NEW",
    price: product.price,
    originalPrice: discount ? Math.round(product.price / (1 - discount / 100)) : undefined,
    discount,
    image: product.imageUrl,
    category: product.category,
    rating: 4 + (index % 10) / 10,
    reviews: 25 + index * 6,
    inStock: product.quantity > 0,
    isNew: index % 5 === 0,
    colors: getProductColors(index),
    images: [product.imageUrl],
  };
}

const PRODUCT_COLOR_PALETTES = [
  ["#000000", "#db4444"],
  ["#184e77", "#52b788"],
  ["#6d597a", "#e56b6f"],
  ["#2f3e46", "#cad2c5"],
  ["#f77f00", "#003049"],
  ["#3a86ff", "#ffbe0b"],
  ["#3F2D59", "#AD5B7E"],
  ["#495057", "#f8f9fa"],
];

export function getProductColors(index: number): string[] {
  return PRODUCT_COLOR_PALETTES[index % PRODUCT_COLOR_PALETTES.length];
}
