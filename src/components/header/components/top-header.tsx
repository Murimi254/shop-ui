import { Link } from "@tanstack/react-router";

export function TopHeader() {
  return (
    <div className="bg-black h-12 text-[#fafafa] flex justify-center items-center capitalize min-w-[580px]">
      <p className="mt-1.5">
        Summer sale for all swim suits and free express delivery - OFF 50%!{" "}
        <Link to="/" className="underline font-bold ml-2">
          shopNow
        </Link>
      </p>
    </div>
  );
}
