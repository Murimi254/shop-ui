import React, { useMemo, useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUPPORT_EMAIL = "exclusive@gmail.com";
const SUPPORT_PHONE = "+254793842254";

const ContactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  message: z.string().trim().min(10, "Tell us how we can help."),
});

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Customer support request from ${form.name || "Exclusive customer"}`);
    const body = encodeURIComponent(
      [`Name: ${form.name}`, `Email: ${form.email}`, `Phone: ${form.phone}`, "", form.message].filter(Boolean).join("\n"),
    );

    return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  }, [form]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setStatus("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedContact = ContactFormSchema.safeParse(form);

    if (!parsedContact.success) {
      setStatus(parsedContact.error.issues[0]?.message ?? "Check the form details and try again.");
      return;
    }

    window.location.href = mailtoHref;
    setStatus("Opening your email app with this message.");
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
        <div className="border border-gray-200 rounded p-6 sm:p-8 space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#db4444] flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <h3 className="font-semibold">Call Us</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">We are available 24/7, 7 days a week.</p>
            <a href={`tel:${SUPPORT_PHONE}`} className="text-sm font-medium hover:text-[#db4444]">
              {SUPPORT_PHONE}
            </a>
          </div>

          <hr className="border-gray-200" />

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#db4444] flex items-center justify-center">
                <Mail size={18} className="text-white" />
              </div>
              <h3 className="font-semibold">Write To Us</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">Send a message and we will respond within 24 hours.</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm font-medium hover:text-[#db4444]">
              {SUPPORT_EMAIL}
            </a>
          </div>

          <hr className="border-gray-200" />

          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-[#db4444]" />
              <span>Moi University, Kesses Eldoret</span>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={18} className="mt-0.5 text-[#db4444]" />
              <span>Support replies within one business day.</span>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Your Name *" value={form.name} onChange={handleChange("name")} required className="bg-[#f5f5f5] border-none" />
              <Input
                placeholder="Your Email *"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                required
                className="bg-[#f5f5f5] border-none"
              />
              <Input
                placeholder="Your Phone *"
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                required
                className="bg-[#f5f5f5] border-none"
              />
            </div>

            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange("message")}
              rows={8}
              required
              className="w-full rounded border-none bg-[#f5f5f5] px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db4444]"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {status && <p className="text-sm text-gray-600">{status}</p>}
              <Button type="submit" size="lg" className="sm:ml-auto">
                <Send size={16} />
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
