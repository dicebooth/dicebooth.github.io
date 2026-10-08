import fs from "node:fs";
import path from "node:path";
import { load } from "js-yaml";

export interface LinkStyleConfig {
  bg_color?: string;
  text_color?: string;
}

export interface LinkItem {
  id: string;
  label?: string;
  url: string;
  preset?: string;
  icon?: string;
  highlight?: boolean;
  active?: boolean;
  style?: LinkStyleConfig;
}

export interface LinklistMeta {
  title: string;
  description?: string;
  avatar?: string;
  theme?: "dark" | "light" | "minimal";
  ga_id?: string;
}

export interface LinklistConfig {
  meta: LinklistMeta;
  links: LinkItem[];
}

const CONFIG_BASE_PATH = path.join(process.cwd(), "config", "users");

/**
 * Returns all user slugs found in config/users/
 */
export function getAllUserSlugs(): string[] {
  if (!fs.existsSync(CONFIG_BASE_PATH)) {
    return [];
  }
  const entries = fs.readdirSync(CONFIG_BASE_PATH, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name);
}

/**
 * Returns all event slugs for a given user (all yaml files excluding main.yaml)
 */
export function getUserEvents(user: string): string[] {
  const userDir = path.join(CONFIG_BASE_PATH, user);
  if (!fs.existsSync(userDir)) {
    return [];
  }
  const files = fs.readdirSync(userDir);
  return files
    .filter((file) => (file.endsWith(".yaml") || file.endsWith(".yml")) && !file.startsWith("main."))
    .map((file) => file.replace(/\.ya?ml$/, ""));
}

/**
 * Returns all static route configurations across all users
 */
export function getAllStaticRoutes(): { user: string; event?: string }[] {
  const users = getAllUserSlugs();
  const routes: { user: string; event?: string }[] = [];

  for (const user of users) {
    // Main profile route
    routes.push({ user });

    // Event routes
    const events = getUserEvents(user);
    for (const event of events) {
      routes.push({ user, event });
    }
  }

  return routes;
}

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

/**
 * Resolves avatar reference:
 * - If external URL (http/https/data:), returns as-is.
 * - If local filesystem path (absolute, project-relative, or relative to YAML file),
 *   converts it to a base64 Data URL so it is fully self-contained and works everywhere
 *   (Next.js static export, GitHub Pages, etc.).
 */
export function resolveAvatar(
  avatarStr: string | undefined,
  configFilePath: string
): string | undefined {
  if (!avatarStr || typeof avatarStr !== "string") {
    return undefined;
  }

  const trimmed = avatarStr.trim();
  if (!trimmed) {
    return undefined;
  }

  // Already an external URL or data URI
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const cwd = process.cwd();
  const configDir = path.dirname(configFilePath);

  // Build candidate paths in order of preference
  const candidates: string[] = [];

  // 1. Direct path as specified (e.g., /Users/... or relative to cwd)
  candidates.push(path.isAbsolute(trimmed) ? trimmed : path.resolve(cwd, trimmed));

  // 2. If path starts with "/", check relative to project cwd (e.g. "/assets/logo.png" -> "<cwd>/assets/logo.png")
  if (trimmed.startsWith("/")) {
    candidates.push(path.join(cwd, trimmed.replace(/^\/+/, "")));
  }

  // 3. Relative to the YAML configuration file itself
  candidates.push(path.resolve(configDir, trimmed));

  // 4. In public directory if applicable
  candidates.push(path.join(cwd, "public", trimmed.replace(/^\/+/, "")));

  // 5. Fallback for absolute paths containing project subpaths (e.g. if an absolute Mac path
  // is committed and built on Linux CI)
  for (const knownDir of ["assets", "public", "config"]) {
    const marker = `${knownDir}/`;
    const markerIdx = trimmed.indexOf(marker);
    if (markerIdx !== -1) {
      candidates.push(path.join(cwd, trimmed.slice(markerIdx)));
    }
  }

  // Find the first candidate that exists as a file
  const matchedPath = candidates.find((cand) => {
    try {
      return fs.existsSync(cand) && fs.statSync(cand).isFile();
    } catch {
      return false;
    }
  });

  if (matchedPath) {
    try {
      const ext = path.extname(matchedPath).toLowerCase();
      const mime = MIME_TYPES[ext] || "image/png";
      const fileBuffer = fs.readFileSync(matchedPath);
      return `data:${mime};base64,${fileBuffer.toString("base64")}`;
    } catch (err) {
      console.error(`Failed to read avatar file at "${matchedPath}":`, err);
    }
  }

  // If no local file was found, return the trimmed path so standard web paths can still attempt to load
  return trimmed;
}

/**
 * Loads a LinkList configuration from disk
 */
export function loadConfig(user: string, event?: string): LinklistConfig | null {
  const fileName = event ? `${event}.yaml` : "main.yaml";
  let filePath = path.join(CONFIG_BASE_PATH, user, fileName);

  if (!fs.existsSync(filePath)) {
    // Try .yml fallback
    const ymlFileName = event ? `${event}.yml` : "main.yml";
    filePath = path.join(CONFIG_BASE_PATH, user, ymlFileName);
    if (!fs.existsSync(filePath)) {
      return null;
    }
  }

  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const parsed = load(rawContent) as LinklistConfig;

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    // Filter active links (defaults to true if omitted)
    const activeLinks = (parsed.links || []).filter((link) => link.active !== false);

    return {
      meta: {
        title: parsed.meta?.title || "links",
        description: parsed.meta?.description
          ? parsed.meta.description.replace(/\\n/g, "\n")
          : undefined,
        avatar: resolveAvatar(parsed.meta?.avatar, filePath),
        theme: parsed.meta?.theme || "dark",
        ga_id: parsed.meta?.ga_id,
      },
      links: activeLinks,
    };
  } catch (error) {
    console.error(`Error loading config for user "${user}" event "${event}":`, error);
    return null;
  }
}
