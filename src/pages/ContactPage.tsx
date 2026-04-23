import React, { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /api/contact
    console.log("Contact form submitted", form);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-8">
        {/* ─── Contact Info Panel ─── */}
        <div className="border border-gray-200 rounded p-8 space-y-8">
          {/* Call */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#db4444] flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <h3 className="font-semibold">Call To Us</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">We are available 24/7, 7 days a week.</p>
            <p className="text-sm font-medium">Phone: +8801611112222</p>
          </div>

          <hr className="border-gray-200" />

          {/* Email */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#db4444] flex items-center justify-center">
                <Mail size={18} className="text-white" />
              </div>
              <h3 className="font-semibold">Write To US</h3>
            </div>
            <p className="text-sm text-gray-600 mb-1">Fill out our form and we will contact you within 24 hours.</p>
            <p className="text-sm font-medium">Emails: customer@exclusive.com</p>
            <p className="text-sm font-medium">Emails: support@exclusive.com</p>
          </div>
        </div>

        {/* ─── Contact Form ─── */}
        <div className="border border-gray-200 rounded p-8">
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
              className="w-full rounded border-none bg-[#f5f5f5] px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#db4444]"
            />

            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
