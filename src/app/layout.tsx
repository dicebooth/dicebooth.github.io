import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dicebooth links",
  description: "Custom Multi-Tenant LinkList",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
