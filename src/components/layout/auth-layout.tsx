import HeroImage from "../../assets/images/hero.png";
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-140px)]">
      {/* Side image */}
      <div className="hidden lg:block relative overflow-hidden">
        <img src={HeroImage} alt="Shopping cart with goods" className="w-full h-full object-cover" />
      </div>
      {/* Form area */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
