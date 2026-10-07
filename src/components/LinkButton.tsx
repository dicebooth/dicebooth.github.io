"use client";

import React from "react";
import { LinkItem } from "@/lib/config-loader";
import { BRAND_PRESETS } from "@/constants/brand-presets";
import { BrandLinkButton } from "@/components/BrandLinkButton";
import { GenericLinkButton } from "@/components/GenericLinkButton";

export interface LinkButtonProps {
  link: LinkItem;
  user: string;
  event: string;
  theme?: "dark" | "light" | "minimal";
}

export function LinkButton({ link, user, event, theme }: LinkButtonProps) {
  if (link.preset && BRAND_PRESETS[link.preset]) {
    return (
      <BrandLinkButton
        event={event}
        link={link}
        preset={BRAND_PRESETS[link.preset]}
        user={user}
      />
    );
  }
  return (
    <GenericLinkButton
      event={event}
      link={link}
      user={user}
      theme={theme}
    />
  );
}

export default LinkButton;
