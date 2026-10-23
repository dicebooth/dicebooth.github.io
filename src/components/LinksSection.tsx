"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LinkItem } from "@/lib/config-loader";
import { LinkButton } from "@/components/LinkButton";
import { resolveLinksWithPhotoParam } from "@/lib/link-utils";

export interface LinksSectionProps {
  links: LinkItem[];
  user: string;
  event: string;
  theme?: "dark" | "light" | "minimal";
}

function LinksSectionInner({
  links,
  user,
  event,
  theme,
}: LinksSectionProps) {
  const searchParams = useSearchParams();
  const photoParam = searchParams.get("photo")?.trim() || null;
  const resolvedLinks = resolveLinksWithPhotoParam(links, photoParam);

  return (
    <section className="w-full flex flex-col gap-3.5 mt-8" aria-label="links">
      {resolvedLinks.map((link) => (
        <LinkButton
          key={link.id}
          link={link}
          user={user}
          event={event}
          theme={theme}
        />
      ))}
      {resolvedLinks.length === 0 && (
        <p className="text-center text-sm opacity-50 py-8">
          Nessun collegamento disponibile al momento.
        </p>
      )}
    </section>
  );
}

export function LinksSection(props: LinksSectionProps) {
  const staticLinks = resolveLinksWithPhotoParam(props.links, null);

  return (
    <Suspense
      fallback={
        <section className="w-full flex flex-col gap-3.5 mt-8" aria-label="links">
          {staticLinks.map((link) => (
            <LinkButton
              key={link.id}
              link={link}
              user={props.user}
              event={props.event}
              theme={props.theme}
            />
          ))}
          {staticLinks.length === 0 && (
            <p className="text-center text-sm opacity-50 py-8">
              Nessun collegamento disponibile al momento.
            </p>
          )}
        </section>
      }
    >
      <LinksSectionInner {...props} />
    </Suspense>
  );
}

export default LinksSection;
