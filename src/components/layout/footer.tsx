import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">Exclusive</h3>
            <p className="text-sm font-medium mb-4">Subscribe</p>
            <p className="text-sm text-gray-300 mb-4">Get 10% off your first order</p>
            <div className="flex items-center border border-gray-500 rounded overflow-hidden">
              <Input
                placeholder="Enter your email"
                className="bg-transparent border-none text-white placeholder:text-gray-500 text-sm focus-visible:ring-0 rounded-none"
              />
              <button className="px-3 shrink-0">
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <address className="not-italic text-sm text-gray-300 leading-7">
              <p>111 Bijoy sarani, Dhaka,</p>
              <p>DH 1515, Bangladesh.</p>
              <p className="mt-2">exclusive@gmail.com</p>
              <p>+88015-88888-9999</p>
            </address>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-6">Account</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Login / Register
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="font-semibold mb-6">Quick Link</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div>
            <h4 className="font-semibold mb-6">Download App</h4>
            <p className="text-xs text-gray-400 mb-3">Save $3 with App New User Only</p>
            <div className="flex gap-3 mb-4">
              {/* QR placeholder */}
              <div className="w-20 h-20 bg-white rounded flex items-center justify-center">
                <span className="text-black text-[9px] text-center font-mono">QR CODE</span>
              </div>
              <div className="flex flex-col gap-2">
                <a href="#" className="block bg-black border border-gray-600 rounded px-3 py-1.5 text-xs hover:border-gray-400 transition-colors">
                  <span className="text-gray-400 text-[9px] block">GET IT ON</span>
                  <span className="font-semibold">Google Play</span>
                </a>
                <a href="#" className="block bg-black border border-gray-600 rounded px-3 py-1.5 text-xs hover:border-gray-400 transition-colors">
                  <span className="text-gray-400 text-[9px] block">Download on the</span>
                  <span className="font-semibold">App Store</span>
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-white hover:text-[#db4444] transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">© Copyright Rimel 2022. All right reserved</div>
      </div>
    </footer>
  );
}
