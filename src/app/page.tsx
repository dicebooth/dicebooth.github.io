import { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadConfig } from "@/lib/config-loader";
import { LinkListPage } from "@/components/LinkListPage";

export async function generateMetadata(): Promise<Metadata> {
  const config = loadConfig("me");
  if (!config) {
    return { title: "Dicebooth Links" };
  }
  return {
    title: config.meta.title,
    description:
      config.meta.description?.replace(/\n/g, " ").trim() || "Dicebooth Links Profile",
  };
}

export default function RootPage() {
  const config = loadConfig("me");

  if (!config) {
    notFound();
  }

  return <LinkListPage config={config} user="me" event="main" />;
}
