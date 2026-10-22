import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../lib/whatsapp";

// Nothing reaches Sravan unless she taps this. It just opens WhatsApp with
// the text filled in — she can still edit or not send it.
export default function SendToSravan({ text, label = "Sravan ki pampu", disabled }) {
  if (disabled || !text?.trim()) {
    return (
      <button className="btn wa" disabled>
        <MessageCircle size={16} aria-hidden /> {label}
      </button>
    );
  }
  return (
    <a className="btn wa" href={whatsappLink(text)} target="_blank" rel="noopener noreferrer">
      <MessageCircle size={16} aria-hidden /> {label}
    </a>
  );
}
