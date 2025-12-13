import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";

export function QuickLinks() {
  return (
    <section className="flex flex-col gap-4">
      <p className="font-medium text-[1.25em]">Quick Links</p>
      <nav>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col justify-start items-start">
            <NavigationMenuItem>
              <Link to="/" activeOptions={{ exact: true }}>
                Privacy Policy
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/" activeOptions={{ exact: true }}>
                Terms of Use
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/" activeOptions={{ exact: true }}>
                FAQ
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/contact" activeOptions={{ exact: true }}>
                Contact
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </section>
  );
}
