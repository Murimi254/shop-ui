import { MailIcon, PhoneIcon } from "lucide-react";

export function Support() {
  return (
    <address className="not-italic flex flex-col gap-4">
      <p className="font-medium text-[1.25em]">Support</p>
      <div className="flex flex-col gap-1">
        <p>Moi University</p>
        <p>Kesses, Eldoret</p>
        <p>Uasin Gishu, 30100, Kenya.</p>
      </div>
      <div className="flex gap-2">
        <MailIcon />
        <a href="mailto:solovoipes@gmail.com">exclusive@gmail.com</a>
      </div>

      <div className="flex gap-2 items-center">
        <PhoneIcon />
        <a href="tel:+254793842254">+254 793 842 254</a>
      </div>
    </address>
  );
}
