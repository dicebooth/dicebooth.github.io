import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllUserSlugs, loadConfig } from "@/lib/config-loader";
import { LinkListPage } from "@/components/LinkListPage";

interface UserPageProps {
  params: Promise<{ user: string }>;
}

export async function generateStaticParams() {
  const users = getAllUserSlugs();
  return users.map((user) => ({
    user,
  }));
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { user } = await params;
  const config = loadConfig(user);
  if (!config) {
    return { title: `User ${user}` };
  }
  return {
    title: config.meta.title,
    description:
      config.meta.description?.replace(/\n/g, " ").trim() || `${user}'s links`,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { user } = await params;
  const config = loadConfig(user);

  if (!config) {
    notFound();
  }

  return <LinkListPage config={config} user={user} event="main" />;
}
