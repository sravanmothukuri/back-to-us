import { config } from "../config";

export function whatsappLink(text) {
  const base = config.whatsappNumber
    ? `https://wa.me/${config.whatsappNumber}`
    : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}
