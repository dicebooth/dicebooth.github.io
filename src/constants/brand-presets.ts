export interface BrandStyle {
  labelDefault: string;
  bgColor: string;
  textColor: string;
  hoverClass: string;
  iconName: string;
}

export const BRAND_PRESETS: Record<string, BrandStyle> = {
  instagram: {
    labelDefault: "Seguimi su Instagram",
    bgColor: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]",
    textColor: "text-white",
    hoverClass: "hover:opacity-95 hover:shadow-lg hover:shadow-pink-500/20 active:scale-[0.98]",
    iconName: "instagram",
  },
  spotify: {
    labelDefault: "Ascolta su Spotify",
    bgColor: "bg-[#1DB954]",
    textColor: "text-black",
    hoverClass: "hover:brightness-105 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]",
    iconName: "spotify",
  },
  youtube: {
    labelDefault: "Guarda su YouTube",
    bgColor: "bg-[#FF0000]",
    textColor: "text-white",
    hoverClass: "hover:brightness-110 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98]",
    iconName: "youtube",
  },
  tiktok: {
    labelDefault: "Seguimi su TikTok",
    bgColor: "bg-black border border-neutral-800",
    textColor: "text-white",
    hoverClass: "hover:border-[#00F2FE]/50 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98]",
    iconName: "tiktok",
  },
  linkedin: {
    labelDefault: "Collegati su LinkedIn",
    bgColor: "bg-[#0A66C2]",
    textColor: "text-white",
    hoverClass: "hover:brightness-105 hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.98]",
    iconName: "linkedin",
  },
  x: {
    labelDefault: "Seguimi su X",
    bgColor: "bg-black border border-[#2F3336]",
    textColor: "text-white",
    hoverClass: "hover:bg-neutral-900 hover:border-neutral-500 hover:shadow-lg hover:shadow-neutral-500/20 active:scale-[0.98]",
    iconName: "x",
  },
  whatsapp: {
    labelDefault: "Scrivimi su WhatsApp",
    bgColor: "bg-[#25D366]",
    textColor: "text-white",
    hoverClass: "hover:brightness-105 hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98]",
    iconName: "whatsapp",
  },
  telegram: {
    labelDefault: "Unisciti su Telegram",
    bgColor: "bg-[#229ED9]",
    textColor: "text-white",
    hoverClass: "hover:brightness-105 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]",
    iconName: "telegram",
  },
  github: {
    labelDefault: "Seguimi su GitHub",
    bgColor: "bg-[#24292F]",
    textColor: "text-white",
    hoverClass: "hover:brightness-110 hover:shadow-lg hover:shadow-neutral-700/20 active:scale-[0.98]",
    iconName: "github",
  },
};
