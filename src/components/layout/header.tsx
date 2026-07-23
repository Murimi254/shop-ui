import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/hooks";
import { selectCartCount } from "@/store/slices/cartSlice";
import { selectWishlistCount } from "@/store/slices/wishlistSlice";
import { cn } from "@/utils/utility-functions";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useState, type FormEvent } from "react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },
];

export function Header() {
  const cartCount = useAppSelector(state => selectCartCount({ cart: state.cart }));
  const wishlistCount = useAppSelector(selectWishlistCount);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const navLinks = isAuthenticated ? NAV_LINKS : [...NAV_LINKS, { label: "Sign Up", to: "/sign-up" }];
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function searchHandler(event?: FormEvent) {
    event?.preventDefault();
    const query = searchValue.trim();
    await navigate({ to: "/", search: query ? { q: query } : {} });
    setMobileMenuOpen(false);
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 h-[70px] flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-black Shrink-0">
          Exclusive
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-black hover:text-[#db4444] transition-colors [&.active]:underline [&.active]:underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search + Icons */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Search bar */}
          <form onSubmit={searchHandler} className="hidden md:flex items-center relative">
            <Input
              placeholder="What are you looking for?"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="w-60 pr-10 bg-[#f5f5f5] border-none rounded text-sm"
            />
            <button type="submit" className="absolute right-3 text-gray-500 hover:text-[#db4444]" aria-label="Search products">
              <Search size={18} />
            </button>
          </form>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative hidden md:flex">
            <Heart size={22} className="text-black hover:text-[#db4444] transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#db4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative hidden md:flex">
            <ShoppingCart size={22} className="text-black hover:text-[#db4444] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#db4444] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link to="/account" className="hidden md:flex">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isAuthenticated ? "bg-[#db4444] text-white" : "text-black hover:text-[#db4444]",
              )}
            >
              <User size={18} />
            </div>
          </Link>

          {/* Mobile menu toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(v => !v)}>
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="text-sm text-black" onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <form onSubmit={searchHandler} className="flex items-center relative">
            <Input
              placeholder="What are you looking for?"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="w-full pr-10 bg-[#f5f5f5] border-none rounded text-sm"
            />
            <button type="submit" className="absolute right-3 text-gray-500 hover:text-[#db4444]" aria-label="Search products">
              <Search size={18} />
            </button>
          </form>
          <div className="flex gap-4 pt-2 border-t border-gray-100">
            <Link to="/wishlist" className="relative">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#db4444] text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#db4444] text-white text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/account">
              <User size={20} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
