import type { LinkItem } from "./config-loader";

export const PHOTO_PLACEHOLDERS = ["{photo}", "{id}", "{PHOTO}", "{ID}"];

/**
 * Checks if a string contains any photo placeholder ({photo} or {id}).
 */
export function hasPhotoPlaceholder(str?: string): boolean {
  if (!str) return false;
  return PHOTO_PLACEHOLDERS.some((ph) => str.includes(ph));
}

/**
 * Replaces photo placeholders in an URL with the encoded photo ID.
 */
export function resolvePhotoUrl(url: string, photoId: string): string {
  let resolved = url;
  const encoded = encodeURIComponent(photoId);
  for (const ph of PHOTO_PLACEHOLDERS) {
    resolved = resolved.replaceAll(ph, encoded);
  }
  return resolved;
}

/**
 * Replaces photo placeholders in a label with the photo ID (raw/decoded).
 */
export function resolvePhotoLabel(label: string, photoId: string): string {
  let resolved = label;
  for (const ph of PHOTO_PLACEHOLDERS) {
    resolved = resolved.replaceAll(ph, photoId);
  }
  return resolved;
}

/**
 * Checks if a LinkItem requires a photo GET parameter to be shown.
 */
export function linkRequiresPhoto(link: LinkItem): boolean {
  if (link.requires_photo === true) return true;
  return hasPhotoPlaceholder(link.url) || hasPhotoPlaceholder(link.label);
}

/**
 * Filters and resolves a list of links given the photo GET parameter (?photo=<id>).
 * - If photoId is absent or blank, links requiring a photo are excluded.
 * - If photoId is present, placeholders in url and label are replaced.
 */
export function resolveLinksWithPhotoParam(
  links: LinkItem[],
  photoId?: string | null
): LinkItem[] {
  const sanitizedPhotoId = photoId?.trim();

  if (!sanitizedPhotoId) {
    return links.filter((link) => !linkRequiresPhoto(link));
  }

  return links
    .filter((link) => {
      // Keep all non-photo links, and photo links if photoId is available
      return true;
    })
    .map((link) => {
      if (!linkRequiresPhoto(link)) {
        return link;
      }

      return {
        ...link,
        url: resolvePhotoUrl(link.url, sanitizedPhotoId),
        label: link.label
          ? resolvePhotoLabel(link.label, sanitizedPhotoId)
          : undefined,
      };
    });
}
