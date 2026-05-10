"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "254746187020";
  const message = "Hi Sianne.crochets! I'd love to know more about your handmade crochet pieces 🌸";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="whatsapp-float" aria-label="Chat on WhatsApp">
      <MessageCircle size={26} color="white" fill="white" />
    </a>
  );
}
