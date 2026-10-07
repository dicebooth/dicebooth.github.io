"use client";

import React from "react";
import { LinkItem } from "@/lib/config-loader";
import { IconRenderer } from "@/components/IconRenderer";
import { trackLinkClick } from "@/lib/analytics";

export interface GenericLinkButtonProps {
  link: LinkItem;
  user: string;
  event: string;
  theme?: "dark" | "light" | "minimal";
}

export function GenericLinkButton({
  link,
  user,
  event,
  theme = "dark",
}: GenericLinkButtonProps) {
  const displayLabel = link.label || link.id;
  const url = link.url || "#";
  const isExternal =
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:");

  const handleClick = () => {
    trackLinkClick({
      linkId: link.id,
      linkType: "generic",
      linkLabel: displayLabel,
      destinationUrl: url,
      userSlug: user,
      pageSlug: event,
    });
  };

  // Custom inline styles if specified
  const customStyle: React.CSSProperties = {};
  if (link.style?.bg_color) {
    customStyle.backgroundColor = link.style.bg_color;
  }
  if (link.style?.text_color) {
    customStyle.color = link.style.text_color;
  }

  // Determine theme-based default style classes if no custom bg is supplied
  let themeClass = "";
  if (!link.style?.bg_color) {
    if (theme === "light") {
      themeClass =
        "bg-white/80 hover:bg-white text-neutral-800 border border-neutral-200/80 shadow-sm hover:shadow-md backdrop-blur-md";
    } else if (theme === "minimal") {
      themeClass =
        "bg-neutral-900/40 hover:bg-neutral-800/60 text-neutral-100 border border-neutral-700/50 backdrop-blur-md";
    } else {
      // dark (default)
      themeClass =
        "bg-neutral-900/80 hover:bg-neutral-800 text-neutral-100 border border-neutral-800/80 shadow-md hover:border-neutral-700 backdrop-blur-md";
    }
  }

  // Highlight styling
  const highlightClass = link.highlight
    ? "ring-2 ring-violet-500/80 shadow-lg shadow-violet-500/20 animate-pulse hover:animate-none font-semibold"
    : "";

  return (
    <a
      href={link.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      style={customStyle}
      className={`group relative flex items-center justify-between w-full min-h-[56px] px-4 py-3.5 rounded-2xl text-sm md:text-base font-medium transition-all duration-200 select-none hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${themeClass} ${highlightClass}`}
    >
      <div className="flex items-center justify-center w-6 h-6 shrink-0">
        {link.icon ? (
          <IconRenderer
            name={link.icon}
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
          />
        ) : (
          <div className="w-5 h-5" />
        )}
      </div>

      <span className="flex-1 text-center font-medium px-2 truncate">
        {displayLabel}
      </span>

      <div className="w-6 h-6 shrink-0" aria-hidden="true" />
    </a>
  );
}
export default GenericLinkButton;
