import React from "react";
import { LinklistConfig } from "@/lib/config-loader";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { Avatar } from "@/components/Avatar";
import { LinksSection } from "@/components/LinksSection";
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

        <LinksSection
          links={links}
          user={user}
          event={currentEvent}
          theme={meta.theme}
        />
      </ThemeWrapper>
    </>
  );
}

export default LinkListPage;
