export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  category: string;
  badge?: "NEW" | string;
  colors?: string[];
  sizes?: string[];
  description?: string;
  inStock?: boolean;
  isNew?: boolean;
}


export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  { id: "1", name: "Phones", icon: "smartphone", slug: "phones" },
  { id: "2", name: "Computers", icon: "monitor", slug: "computers" },
  { id: "3", name: "SmartWatch", icon: "watch", slug: "smartwatch" },
  { id: "4", name: "Camera", icon: "camera", slug: "camera" },
  { id: "5", name: "HeadPhones", icon: "headphones", slug: "headphones" },
  { id: "6", name: "Gaming", icon: "gamepad-2", slug: "gaming" },
];

export const SIDEBAR_CATEGORIES = [
  "Woman's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Lifestyle",
  "Medicine",
  "Sports & Outdoor",
  "Baby's & Toys",
  "Groceries & Pets",
  "Health & Beauty",
];

export const FLASH_SALE_PRODUCTS: Product[] = [
  {
    id: "fs-1",
    name: "HAVIT HV-G92 Gamepad",
    price: 120,
    originalPrice: 160,
    discount: 40,
    rating: 4.5,
    reviews: 88,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Gamepad",
    category: "gaming",
    colors: ["#000000", "#db4444"],
  },
  {
    id: "fs-2",
    name: "AK-900 Wired Keyboard",
    price: 960,
    originalPrice: 1160,
    discount: 35,
    rating: 4,
    reviews: 75,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Keyboard",
    category: "computers",
    colors: ["#000000"],
  },
  {
    id: "fs-3",
    name: "IPS LCD Gaming Monitor",
    price: 370,
    originalPrice: 400,
    discount: 30,
    rating: 5,
    reviews: 99,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Monitor",
    category: "computers",
    colors: ["#000000"],
  },
  {
    id: "fs-4",
    name: "S-Series Comfort Chair",
    price: 375,
    originalPrice: 400,
    discount: 25,
    rating: 4.5,
    reviews: 99,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Chair",
    category: "home",
    colors: ["#d4a574", "#888888"],
  },
  {
    id: "fs-5",
    name: "S-Series Gaming Headset",
    price: 375,
    originalPrice: 400,
    discount: 25,
    rating: 4.5,
    reviews: 99,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Headset",
    category: "gaming",
    colors: ["#000000", "#db4444"],
  },
];

export const BEST_SELLING_PRODUCTS: Product[] = [
  {
    id: "bs-1",
    name: "The North Coat",
    price: 260,
    originalPrice: 360,
    rating: 5,
    reviews: 65,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Coat",
    category: "fashion",
  },
  {
    id: "bs-2",
    name: "Gucci Duffle Bag",
    price: 960,
    originalPrice: 1160,
    rating: 4.5,
    reviews: 65,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Bag",
    category: "fashion",
  },
  {
    id: "bs-3",
    name: "RGB Liquid CPU Cooler",
    price: 160,
    originalPrice: 170,
    rating: 4.5,
    reviews: 65,
    image: "https://placehold.co/300x300/f5f5f5/333?text=CPU+Cooler",
    category: "computers",
  },
  {
    id: "bs-4",
    name: "Small BookShelf",
    price: 360,
    rating: 5,
    reviews: 65,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Bookshelf",
    category: "home",
  },
];

export const EXPLORE_PRODUCTS: Product[] = [
  {
    id: "ep-1",
    name: "Breed Dry Dog Food",
    price: 100,
    rating: 3,
    reviews: 35,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Dog+Food",
    category: "groceries",
  },
  {
    id: "ep-2",
    name: "CANON EOS DSLR Camera",
    price: 360,
    rating: 4,
    reviews: 95,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Camera",
    category: "camera",
  },
  {
    id: "ep-3",
    name: "ASUS FHD Gaming Laptop",
    price: 700,
    rating: 5,
    reviews: 325,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Laptop",
    category: "computers",
  },
  {
    id: "ep-4",
    name: "Curology Product Set",
    price: 500,
    rating: 4,
    reviews: 145,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Skincare",
    category: "beauty",
  },
  {
    id: "ep-5",
    name: "Kids Electric Car",
    price: 960,
    originalPrice: 1160,
    rating: 5,
    reviews: 65,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Electric+Car",
    category: "toys",
    isNew: true,
    colors: ["#db4444", "#000000"],
  },
  {
    id: "ep-6",
    name: "Jr. Zoom Soccer Cleats",
    price: 660,
    originalPrice: 1160,
    rating: 5,
    reviews: 35,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Cleats",
    category: "sports",
    colors: ["#f5c518", "#db4444"],
  },
  {
    id: "ep-7",
    name: "GP11 Shooter USB Gamepad",
    price: 660,
    originalPrice: 1160,
    rating: 4.5,
    reviews: 55,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Gamepad",
    category: "gaming",
    isNew: true,
    colors: ["#000000", "#db4444"],
  },
  {
    id: "ep-8",
    name: "Quilted Satin Jacket",
    price: 660,
    originalPrice: 1160,
    rating: 4.5,
    reviews: 55,
    image: "https://placehold.co/300x300/f5f5f5/333?text=Jacket",
    category: "fashion",
    colors: ["#1a1a1a", "#db4444"],
  },
];

export const PRODUCT_DETAIL: Product = {
  id: "pd-1",
  name: "Havic HV G-92 Gamepad",
  price: 192,
  rating: 4,
  reviews: 150,
  image: "https://placehold.co/500x500/f5f5f5/333?text=Gamepad+Main",
  images: [
    "https://placehold.co/120x120/f5f5f5/333?text=View+1",
    "https://placehold.co/120x120/f5f5f5/333?text=View+2",
    "https://placehold.co/120x120/f5f5f5/333?text=View+3",
    "https://placehold.co/120x120/f5f5f5/333?text=View+4",
  ],
  category: "gaming",
  colors: ["#a0a0a0", "#db4444"],
  sizes: ["XS", "S", "M", "L", "XL"],
  description:
    "PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.",
  inStock: true,
};
