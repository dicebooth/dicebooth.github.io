import React from "react";
import {
  FaInstagram,
  FaSpotify,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
  FaXTwitter,
  FaWhatsapp,
  FaTelegram,
  FaGithub,
} from "react-icons/fa6";

interface BrandIconProps {
  name: string;
  className?: string;
}

export function BrandIcon({ name, className = "w-5 h-5" }: BrandIconProps) {
  switch (name.toLowerCase()) {
    case "instagram":
      return <FaInstagram className={className} />;
    case "spotify":
      return <FaSpotify className={className} />;
    case "youtube":
      return <FaYoutube className={className} />;
    case "tiktok":
      return <FaTiktok className={className} />;
    case "linkedin":
      return <FaLinkedin className={className} />;
    case "x":
    case "twitter":
      return <FaXTwitter className={className} />;
    case "whatsapp":
      return <FaWhatsapp className={className} />;
    case "telegram":
      return <FaTelegram className={className} />;
    case "github":
      return <FaGithub className={className} />;
    default:
      return null;
  }
}

export default BrandIcon;
