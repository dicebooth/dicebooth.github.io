"use client";

import React from "react";
import { LinkItem } from "@/lib/config-loader";
import { BrandStyle } from "@/constants/brand-presets";
import { BrandIcon } from "@/components/BrandIcon";
import { trackLinkClick } from "@/lib/analytics";

export interface BrandLinkButtonProps {
  link: LinkItem;
  preset: BrandStyle;
  user: string;
  event: string;
}

export function BrandLinkButton({
  link,
  preset,
  user,
  event,
}: BrandLinkButtonProps) {
  const displayLabel = link.label || preset.labelDefault;
  const url = link.url || "#";
  const isExternal =
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:");

  const handleClick = () => {
    trackLinkClick({
      linkId: link.id,
      linkType: link.preset || "generic",
      linkLabel: displayLabel,
      destinationUrl: url,
      userSlug: user,
      pageSlug: event,
    });
  };

  return (
    <a
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={`group relative flex items-center justify-between w-full min-h-[56px] px-4 py-3.5 rounded-2xl font-medium text-sm md:text-base transition-all duration-200 select-none shadow-md ${preset.bgColor} ${preset.textColor} ${preset.hoverClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-white/50`}
    >
      <div className="flex items-center justify-center w-6 h-6 shrink-0">
        <BrandIcon
          name={preset.iconName}
          className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
        />
      </div>

      <span className="flex-1 text-center font-medium px-2 truncate">
        {displayLabel}
      </span>

      <div className="w-6 h-6 shrink-0" aria-hidden="true" />
    </a>
  );
}
export default BrandLinkButton;
