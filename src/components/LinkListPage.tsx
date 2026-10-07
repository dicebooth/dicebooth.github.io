import React from "react";
import { LinklistConfig } from "@/lib/config-loader";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { Avatar } from "@/components/Avatar";
import { LinkButton } from "@/components/LinkButton";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export interface LinkListPageProps {
  config: LinklistConfig;
  user: string;
  event?: string;
}

export function LinkListPage({ config, user, event }: LinkListPageProps) {
  const { meta, links } = config;
  const currentEvent = event || "main";

  return (
    <>
      <GoogleAnalytics gaId={meta.ga_id} />
      <ThemeWrapper theme={meta.theme}>
        <header className="flex flex-col items-center text-center">
          <Avatar src={meta.avatar} alt={meta.title} size={104} />
          <h1 className="mt-5 text-xl md:text-2xl font-bold tracking-tight">
            {meta.title}
          </h1>
          {meta.description && (
            <p className="mt-2 text-sm md:text-base opacity-75 max-w-sm leading-relaxed whitespace-pre-line">
              {meta.description}
            </p>
          )}
        </header>

        <section className="w-full flex flex-col gap-3.5 mt-8" aria-label="Links">
          {links.map((link) => (
            <LinkButton
              key={link.id}
              link={link}
              user={user}
              event={currentEvent}
              theme={meta.theme}
            />
          ))}
          {links.length === 0 && (
            <p className="text-center text-sm opacity-50 py-8">
              Nessun collegamento disponibile al momento.
            </p>
          )}
        </section>
      </ThemeWrapper>
    </>
  );
}

export default LinkListPage;
