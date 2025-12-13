import { Separator } from "../ui/separator";
import { Logo } from "./components/logo";
import { NavigationMenuBar } from "./components/navigation-menu";
import { SearchBar } from "./components/search-bar";
import { TopHeader } from "./components/top-header";

export function Header() {
  return (
    <header>
      <TopHeader />
      <div className="flex px-40 pt-2  items-center justify-between mt-2.5">
        <Logo />
        <NavigationMenuBar />
        <SearchBar />
      </div>
      <Separator className="mt-4" />
    </header>
  );
}
