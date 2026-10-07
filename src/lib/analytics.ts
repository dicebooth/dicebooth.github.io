export interface TrackLinkClickParams {
  linkId: string;
  linkType: string;
  linkLabel: string;
  destinationUrl: string;
  userSlug: string;
  pageSlug: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Tracks a link click event in Google Analytics 4
 */
export function trackLinkClick({
  linkId,
  linkType,
  linkLabel,
  destinationUrl,
  userSlug,
  pageSlug,
}: TrackLinkClickParams) {
  if (typeof window === "undefined") return;

  const eventParams = {
    link_id: linkId,
    link_type: linkType,
    link_label: linkLabel,
    destination_url: destinationUrl,
    user_slug: userSlug,
    page_slug: pageSlug,
    transport_type: "beacon",
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", "linklist_click", eventParams);
  } else {
    // Fallback or dev log
    if (process.env.NODE_ENV !== "production") {
      console.log("[GA4 Event linklist_click]", eventParams);
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: "linklist_click",
        ...eventParams,
      });
    }
  }
}
