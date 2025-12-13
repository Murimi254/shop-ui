import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";

export function NavigationMenuBar() {
  return (
    <nav>
      <NavigationMenu>
        <NavigationMenuList className="flex flex-wrap justify-between gap-4">
          <NavigationMenuItem>
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "underline decoration-2" }}>
              Home
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/about" activeOptions={{ exact: true }} activeProps={{ className: "underline decoration-2" }}>
              About
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/contact" activeOptions={{ exact: true }} activeProps={{ className: "underline decoration-2" }}>
              Contact
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link to="/signup" activeOptions={{ exact: true }} activeProps={{ className: "underline decoration-2" }}>
              Sign Up
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
