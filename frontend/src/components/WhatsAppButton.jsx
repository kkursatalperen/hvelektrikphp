import React from "react";
import { useI18n } from "../i18n/I18nProvider";

// Telefon numarasını uluslararası formatta (başında ülke kodu, boşluk/parantez YOK) yazın.
// Örn: +90 544 241 70 95  →  905442417095
const WHATSAPP_NUMBER = "905442417095";
const DEFAULT_MESSAGE_TR = "Merhaba, HV Elektrik hakkında bilgi almak istiyorum.";
const DEFAULT_MESSAGE_EN = "Hello, I would like information about HV Elektrik.";

const WhatsAppButton = () => {
  const { lang } = useI18n();
  const message = lang === "tr" ? DEFAULT_MESSAGE_TR : DEFAULT_MESSAGE_EN;
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      data-testid="whatsapp-float-button"
      className="fixed bottom-24 right-6 z-[90] group"
    >
      {/* nabız halkası */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
      {/* buton */}
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/20 group-hover:scale-110 group-hover:bg-[#20bd5a] transition-all duration-300">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.71.45 3.38 1.3 4.85L2.05 22l5.36-1.4a9.9 9.9 0 0 0 4.63 1.18h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.18.83.85-3.1-.2-.32a8.19 8.19 0 0 1-1.26-4.37c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.82c0 4.53-3.69 8.22-8.18 8.22Zm4.51-6.15c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.24-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.36-.77-1.86-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28Z"/>
        </svg>
      </span>
    </a>
  );
};

export default WhatsAppButton;