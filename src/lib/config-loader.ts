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
        title: parsed.meta?.title || "Links",
        description: parsed.meta?.description
          ? parsed.meta.description.replace(/\\n/g, "\n")
          : undefined,
        avatar: parsed.meta?.avatar,
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
