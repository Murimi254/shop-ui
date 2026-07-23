import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-black text-white text-sm py-3 px-4">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-3">
        <div className="flex-1" />
        <p className="text-center flex-1">
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
          <Link to="/" className="font-bold underline">
            ShopNow
          </Link>
        </p>
        <div className="flex-1 flex justify-end">
          <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            English
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
