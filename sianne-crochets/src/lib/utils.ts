import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SC-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function calculateDeliveryFee(county: string): number {
  const nairobiCBD = ["nairobi cbd", "cbd", "city centre"];
  const nairobiAreas = [
    "westlands", "kilimani", "lavington", "karen", "langata",
    "parklands", "eastleigh", "embakasi", "kasarani", "ruaka",
    "gigiri", "muthaiga", "upperhill", "hurlingham", "kileleshwa",
    "south b", "south c", "kibera", "dagoretti", "ruiru", "thika road",
    "nairobi", "kiambu"
  ];

  const countyLower = county.toLowerCase();

  if (nairobiCBD.some(area => countyLower.includes(area))) return 150;
  if (nairobiAreas.some(area => countyLower.includes(area))) return 200;

  // Outside Nairobi — major towns
  const nearbyCounties = ["kiambu", "machakos", "kajiado", "murang'a"];
  if (nearbyCounties.some(c => countyLower.includes(c))) return 300;

  return 450; // Rest of Kenya
}

export function getDeliveryEstimate(county: string): string {
  const countyLower = county.toLowerCase();
  if (countyLower.includes("nairobi")) return "1-2 business days";
  const nearby = ["kiambu", "machakos", "kajiado"];
  if (nearby.some(c => countyLower.includes(c))) return "2-3 business days";
  return "3-5 business days";
}

export function formatPhoneNumber(phone: string): string {
  // Convert to 2547XXXXXXXX format
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = "254" + cleaned.slice(1);
  if (cleaned.startsWith("7") || cleaned.startsWith("1")) cleaned = "254" + cleaned;
  return cleaned;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
