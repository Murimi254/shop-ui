import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import QRcode from "@/assets/images/qrcode.png";
import GooglePlayImage from "@/assets/images/get-it-google-play.png";
import ApplePlayImage from "@/assets/images/get-it-apple-store.png";
import { useState } from "react";
import { z } from "zod";
const SOCIAL_ICONS = [
  { icon: Facebook, link: "https://www.facebook.com/dennis.soulster.7" },
  { icon: Twitter, link: "https://x.com/solovoi254" },
  { icon: Instagram, link: "https://www.instagram.com/solov_oi/" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/dennis-murimi-7886b91b3/" },
];

export function Footer() {
  const [marketingEmail, setMarketingEmail] = useState("");
  function sendMarketingEmailHandler() {
    const email = z.email().parse(marketingEmail);
    console.log(email);
    setMarketingEmail("");
    //TODO send it to the backend and send a marketing email
  }
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
                onChange={e => setMarketingEmail(e.target.value)}
                value={marketingEmail}
                placeholder="Enter your email"
                className="bg-transparent border-none text-white placeholder:text-gray-500 text-sm focus-visible:ring-0 rounded-none"
              />
              <button onClick={sendMarketingEmailHandler} className="px-3 shrink-0">
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <address className="not-italic text-sm text-gray-300 leading-7">
              <p>Moi University,</p>
              <p>Kesses Eldoret.</p>
              <a href="mailto:solovoipes@gmail.com" className="mt-2 block">
                exclusive@gmail.com
              </a>
              <a href="tel:+254793842254" className="block">
                + 254-793-842-254
              </a>
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
              {/* QR CODE */}
              <div className="w-20 h-20 bg-white rounded flex items-center justify-center">
                <img src={QRcode} alt="Download QR code" />
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="https://play.google.com/store/games?hl=en"
                  className="block bg-black px-3 py-1.5 text-xs hover:border-gray-400 transition-colors"
                >
                  <img src={GooglePlayImage} alt="Google Play Logo" />
                </a>
                <a href="https://www.apple.com/app-store/" className="block bg-black  px-3 py-1.5 text-xs hover:border-gray-400 transition-colors">
                  <img src={ApplePlayImage} alt="Apple Play Logo" />
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              {SOCIAL_ICONS.map(i => (
                <a key={i.link} href={i.link} className="text-white hover:text-[#db4444] transition-colors">
                  <i.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
          © Copyright Moi University {new Date().getFullYear()}. All right reserved
        </div>
      </div>
    </footer>
  );
}
