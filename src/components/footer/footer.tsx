import { Account } from "./components/account";
import { DownloadApp } from "./components/download-app";
import { QuickLinks } from "./components/quick-links";
import { SubscribeContainer } from "./components/subscribe-container";
import { Support } from "./components/support";

export function Footer() {
  return (
    <footer className="flex h-100 bg-black text-white justify-between items-start pt-20 px-28">
      <SubscribeContainer />
      <Support />
      <Account />
      <QuickLinks />
      <DownloadApp />
    </footer>
  );
}
