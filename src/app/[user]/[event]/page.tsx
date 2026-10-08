import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllUserSlugs, getUserEvents, loadConfig } from "@/lib/config-loader";
import { LinkListPage } from "@/components/LinkListPage";

export const dynamicParams = false;

interface UserEventPageProps {
  params: Promise<{ user: string; event: string }>;
}

export async function generateStaticParams() {
  const users = getAllUserSlugs();
  const paths: { user: string; event: string }[] = [];

  for (const user of users) {
    const events = getUserEvents(user);
    for (const event of events) {
      paths.push({
        user,
        event,
      });
    }
  }

  // Next.js requires at least one route in generateStaticParams with output: 'export'
  if (paths.length === 0) {
    return [{ user: "_", event: "_" }];
  }

  return paths;
}

export async function generateMetadata({
  params,
}: UserEventPageProps): Promise<Metadata> {
  const { user, event } = await params;
  if (user === "_") {
    return { title: "Not Found" };
  }
  const config = loadConfig(user, event);
  if (!config) {
    return { title: `${user} - ${event}` };
  }
  return {
    title: config.meta.title,
    description:
      config.meta.description?.replace(/\n/g, " ").trim() ||
      `${config.meta.title} links`,
  };
}

export default async function UserEventPage({ params }: UserEventPageProps) {
  const { user, event } = await params;
  if (user === "_") {
    notFound();
  }
  const config = loadConfig(user, event);

  if (!config) {
    notFound();
  }

  return <LinkListPage config={config} user={user} event={event} />;
}
