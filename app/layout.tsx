import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "./components/footer";

export const metadata: Metadata = {
  title: {
    default: "sam macaluso — personal wiki",
    template: "%s | sam macaluso",
  },
  description:
    "Personal wiki by Sam Macaluso. Curated product recommendations, notes, and things I've learned.",
  metadataBase: new URL("https://macalu.so"),
  openGraph: {
    title: "sam macaluso",
    description:
      "Personal wiki — curated product picks, notes, and things I've learned.",
    url: "https://macalu.so",
    siteName: "macalu.so",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "sam macaluso",
    "personal wiki",
    "best in slot",
    "product recommendations",
    "software developer",
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <div className="flex-1">{children}</div>
          <Footer />
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
