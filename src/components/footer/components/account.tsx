import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";

export function Account() {
  return (
    <section className="flex flex-col gap-4">
      <p className="font-medium text-[1.25em]">Account</p>
      <nav>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col justify-start items-start">
            <NavigationMenuItem>
              <Link to="/account" activeOptions={{ exact: true }}>
                My Account
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/login" activeOptions={{ exact: true }}>
                Login / Register
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/cart" activeOptions={{ exact: true }}>
                Cart
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/" activeOptions={{ exact: true }}>
                Shop
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </section>
  );
}
