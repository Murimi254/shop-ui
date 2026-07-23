import Iphone14Image from "@/assets/images/iphone_carousel.png";
import JBLSpeaker from "@/assets/images/JBL.png";
import PS5Image from "@/assets/images/ps5-carousel.png";
import SamsungImage from "@/assets/images/samsung-carousel.png";
import { useGetProductsQuery } from "@/api/exclusive";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/ui/countdown";
import { ProductCard } from "@/components/ui/product-card";
import { SectionLabel } from "@/components/ui/section-label";
import { CATEGORIES, SIDEBAR_CATEGORIES } from "@/data/products";
import { useAppDispatch } from "@/hooks/hooks";
import { addToCart } from "@/store/slices/cartSlice";
import { Camera, ChevronLeft, ChevronRight, Gamepad2, Headphones, Headset, Monitor, ShieldCheck, Smartphone, Truck, Watch } from "lucide-react";
import React, { useState } from "react";
import WomanWearingHat from "@/assets/images/woman-wearing-hat.png";
import GucciPerfume from "@/assets/images/gucci-perfume.png";
import AmazonSpeaker from "@/assets/images/amazon-speakers.png";
import { LoadingSpinner } from "@/components/loading-spinner";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  smartphone: Smartphone,
  monitor: Monitor,
  watch: Watch,
  camera: Camera,
  headphones: Headphones,
  "gamepad-2": Gamepad2,
};

const HERO_SLIDES = [
  { id: 1, brand: "Apple", image: Iphone14Image, title: "iPhone 14 Series", subtitle: "Up to 10% off Voucher", cta: "Shop Now", bg: "bg-black" },
  { id: 2, brand: "Samsung", image: SamsungImage, title: "Galaxy S23", subtitle: "New Arrivals", cta: "Shop Now", bg: "bg-black" },
  { id: 3, brand: "Sony", image: PS5Image, title: "PlayStation 5", subtitle: "Limited Stock", cta: "Shop Now", bg: "bg-black" },
];
//Should come from the backend for consistency between different sessions(users)
const flashSaleEnd = new Date(Date.now() + 3 * 3600 * 1000 + 23 * 60 * 1000 + 19 * 1000);

export function HomePage() {
  const { data, isLoading, isError } = useGetProductsQuery({ limit: 30 });
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(3); // Camera active in wireframe
  const dispatch = useAppDispatch();

  function buyJblNowHandler() {
    dispatch(
      addToCart({
        id: "9874",
        image: "",
        name: "JBL Speaker",
        price: 34,
        quantity: 1,
      }),
    );
  }

  const FLASH_SALE_PRODUCTS = data?.sections.flashSale;
  const BEST_SELLING_PRODUCTS = data?.sections.bestSelling;
  const EXPLORE_PRODUCTS = data?.products;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>Error Fetching Products.</h1>;
  }

  return (
    <div className="max-w-300 mx-auto px-4">
      {/* ─── Hero Section ─── */}
      <section className="flex gap-0 mt-6 mb-16 min-h-86">
        {/* Sidebar categories */}
        <aside className="hidden lg:block w-55 border-r border-gray-200 pr-4 pt-2 shrink-0">
          <ul className="space-y-1">
            {SIDEBAR_CATEGORIES.map(cat => (
              <li key={cat}>
                <a
                  href="#explore-products"
                  className="scroll-smooth w-full flex items-center justify-between text-sm py-2 px-1 hover:text-[#db4444] text-left transition-colors group"
                >
                  {cat}
                  {(cat === "Woman's Fashion" || cat === "Men's Fashion") && (
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-[#db4444]" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Hero carousel */}
        <div className="flex-1 relative bg-black rounded overflow-hidden ml-0 lg:ml-6 min-h-[340px]">
          <div className="absolute inset-0 flex items-center justify-between p-8">
            <div className="text-white z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-black rounded-full" />
                </div>
                <span className="text-sm">{HERO_SLIDES[heroSlide].brand}</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight mb-4">{HERO_SLIDES[heroSlide].title}</h1>
              <p className="text-lg mb-6">{HERO_SLIDES[heroSlide].subtitle}</p>
              <a
                href="#explore-products"
                className="flex items-center gap-2 text-white border-b border-white pb-1 hover:text-gray-300 transition-colors w-fit"
              >
                {HERO_SLIDES[heroSlide].cta}
                <ChevronRight size={16} />
              </a>
            </div>
            {/* Placeholder product image */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-80">
              <img src={HERO_SLIDES[heroSlide].image} alt={HERO_SLIDES[heroSlide].title} className="h-full object-contain" />
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === heroSlide ? "bg-[#db4444]" : "bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Flash Sales ─── */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <SectionLabel tag="Today's" />
            <div className="flex items-center gap-12 -mt-4">
              <h2 className="text-3xl font-bold">Flash Sales</h2>
              <Countdown targetDate={flashSaleEnd} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FLASH_SALE_PRODUCTS?.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <a href="#explore-products" className="flex justify-center mt-10">
          <Button variant="default" size="lg">
            View All Products
          </Button>
        </a>
        <hr className="mt-10 border-gray-200" />
      </section>

      {/* ─── Browse By Category ─── */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <SectionLabel tag="Categories" />
            <h2 className="text-3xl font-bold -mt-4">Browse By Category</h2>
          </div>
          <div className="flex gap-2">
            {/* <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronRight size={18} />
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = CATEGORY_ICONS[cat.icon];
            const isActive = i === activeCategoryIdx;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryIdx(i)}
                className={`flex flex-col items-center justify-center gap-3 py-6 border rounded transition-colors ${
                  isActive ? "bg-[#db4444] text-white border-[#db4444]" : "border-gray-200 hover:border-[#db4444] hover:text-[#db4444]"
                }`}
              >
                {Icon && <Icon size={36} />}
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            );
          })}
        </div>
        <hr className="mt-10 border-gray-200" />
      </section>

      {/* ─── Best Selling Products ─── */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <SectionLabel tag="This Month" />
            <h2 className="text-3xl font-bold -mt-4">Best Selling Products</h2>
          </div>
          <a href="#explore-products">
            <Button variant="default">View All</Button>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BEST_SELLING_PRODUCTS?.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ─── Promo Banner (Music) ─── */}
      <section className="mb-16 rounded overflow-hidden bg-black relative min-h-[300px] flex items-center px-12">
        <div className="z-10 text-white">
          <p className="text-[#00ff66] font-semibold mb-2">Categories</p>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            Enhance Your
            <br />
            Music Experience
          </h2>
          <Countdown initialSeconds={23 * 3600 + 5 * 60 + 59} variant="dark" />
          <Button onClick={buyJblNowHandler} className="mt-6 bg-[#00ff66] text-black hover:bg-[#00dd55] font-semibold">
            Buy Now!
          </Button>
        </div>
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <img src={JBLSpeaker} alt="JBL Speaker" className="w-72 h-56 object-contain" />
        </div>
      </section>

      {/* ─── Explore Our Products ─── */}
      <section id="explore-products" className="mb-16">
        <SectionLabel tag="Our Products" />
        <div className="flex items-end justify-between -mt-4 mb-6">
          <h2 className="text-3xl font-bold">Explore Our Products</h2>
          <div className="flex gap-2">
            {/* <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100">
              <ChevronRight size={18} />
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {EXPLORE_PRODUCTS?.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          {/* <Button variant="default" size="lg">
            View All Products
          </Button> */}
        </div>
      </section>

      {/* ─── New Arrival ─── */}
      <section className="mb-16 ">
        <SectionLabel tag="Featured" />
        <h2 className="text-3xl font-bold -mt-4 mb-8">New Arrival</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
          {/* Large left */}
          <div className="bg-black rounded overflow-hidden relative group cursor-pointer h-full">
            <img src={PS5Image} alt="PS5" className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold">PlayStation 5</h3>
              <p className="text-sm text-gray-300 mb-2">Black and White version of the PS5 coming out on sale.</p>
              <a href="#explore-products" className="text-sm font-semibold underline">
                Shop Now
              </a>
            </div>
          </div>

          {/* Right column: 3 tiles */}
          <div className="grid grid-rows-2 gap-4 h-full">
            {/* Top right */}
            <div className="bg-[#1a1a1a] rounded overflow-hidden relative group cursor-pointer">
              <img
                src={WomanWearingHat}
                alt="Women's Fashion"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Women's Collections</h3>
                <p className="text-xs text-gray-400 mb-1">Featured woman collections that give you another vibe.</p>
                <a href="#explore-products" className="text-xs font-semibold underline">
                  Shop Now
                </a>
              </div>
            </div>

            {/* Bottom row: 2 tiles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] rounded overflow-hidden relative group cursor-pointer">
                <img src={AmazonSpeaker} alt="Speakers" className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-sm font-bold">Speakers</h3>
                  <p className="text-xs text-gray-400">Amazon wireless speakers</p>
                  <a href="#explore-products" className="text-xs font-semibold underline">
                    Shop Now
                  </a>
                </div>
              </div>
              <div className="bg-[#1a1a1a] rounded overflow-hidden relative group cursor-pointer">
                <img src={GucciPerfume} alt="Perfume" className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-sm font-bold">Perfume</h3>
                  <p className="text-xs text-gray-400">GUCCI INTENSE OUD EDP</p>
                  <a href="#explore-products" className="text-xs font-semibold underline">
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="h-70"></section>
      {/* ─── Service Features ─── */}
      <section className=" border-t border-gray-200 py-16 mb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { Icon: Truck, title: "FREE AND FAST DELIVERY", sub: "Free delivery for all orders over Ksh. 10,000" },
            { Icon: Headset, title: "24/7 CUSTOMER SERVICE", sub: "Friendly 24/7 customer support" },
            { Icon: ShieldCheck, title: "MONEY BACK GUARANTEE", sub: "We return money within 30 days" },
          ].map(({ Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-gray-200 bg-black flex items-center justify-center">
                <Icon size={28} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm tracking-wide">{title}</p>
                <p className="text-sm text-gray-500 mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
