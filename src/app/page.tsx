import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadConfig } from "@/lib/config-loader";
import { LinkListPage } from "@/components/LinkListPage";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadConfig("dicebooth");
  if (!config) {
    return { title: "dicebooth links" };
  }
  return {
    title: config.meta.title,
    description:
      config.meta.description?.replace(/\n/g, " ").trim() || "dicebooth links Profile",
  };
}

export default function RootPage() {
  const config = loadConfig("dicebooth");

  if (!config) {
    notFound();
  }

  return <LinkListPage config={config} user="dicebooth" event="main" />;
}
