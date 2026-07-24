import { Users, DollarSign, ShoppingBag, TrendingUp, Twitter, Instagram, Linkedin } from "lucide-react";
import AboutUsImage from "../../public/images/about-us.png";
import Will from "../../public/images/will.png";
import Emma from "../../public/images/emma.png";
import Tom from "../../public/images/tom.png";

const STATS = [
  { icon: ShoppingBag, value: "10.5k", label: "Sellers active our site" },
  { icon: DollarSign, value: "33k", label: "Monthly Product Sale" },
  { icon: Users, value: "45.5k", label: "Customer active in our site" },
  { icon: TrendingUp, value: "25k", label: "Annual gross sale in our site" },
];

const TEAM = [
  {
    name: "Tom Cruise",
    role: "Founder & Chairman",
    image: Tom,
    socials: ["twitter", "instagram", "linkedin"],
  },
  {
    name: "Emma Watson",
    role: "Managing Director",
    image: Emma,
    socials: ["twitter", "instagram", "linkedin"],
  },
  {
    name: "Will Smith",
    role: "Product Designer",
    image: Will,
    socials: ["twitter", "instagram", "linkedin"],
  },
];

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

export function AboutPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <h1 className="text-4xl font-bold mb-6">Our Story</h1>
          <p className="text-sm text-gray-600 leading-7 mb-4">
            Launched in 2015, Exclusive is South Asia's premier online shopping marketplace with an active presence in Bangladesh. Supported by a wide
            range of tailored marketing, data and service solutions, Exclusive has 10,500 sellers and 300 brands and serves 3 million customers across
            the region.
          </p>
          <p className="text-sm text-gray-600 leading-7">
            Exclusive has more than 1 Million products to offer, growing at a very fast pace. Exclusive offers a diverse assortment in categories
            ranging from consumer electronics to fashion, and more.
          </p>
        </div>
        <div className="overflow-hidden rounded">
          <img src={AboutUsImage} alt="Shopping" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="border border-gray-200 rounded p-8 text-center flex flex-col items-center gap-4 hover:bg-[#db4444] hover:text-white hover:border-[#db4444] transition-colors group cursor-default"
          >
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 group-hover:border-white/30 bg-black group-hover:bg-white flex items-center justify-center transition-colors">
              <Icon size={28} className="text-white group-hover:text-[#db4444] transition-colors" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {TEAM.map(member => (
          <div key={member.name}>
            <div className="bg-[#f5f5f5] rounded overflow-hidden mb-4 aspect-3/4">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{member.role}</p>
            <div className="flex gap-3">
              {member.socials.map(s => {
                const Icon = SOCIAL_ICONS[s];
                return (
                  <a key={s} href="#" className="hover:text-[#db4444] transition-colors">
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
