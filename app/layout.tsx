import "./global.css"
import { RootProvider } from "fumadocs-ui/provider"
import { Inter } from "next/font/google"
import type { ReactNode } from "react"
import { Metadata } from "next"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "macalu.so | Personal website, docs",
    template: "%s | macalu.so",
  },
  description: "Personal website, docs",
  metadataBase: new URL("https://macalu.so"),
  openGraph: {
    title: "macalu.so",
    description: "Personal website, docs",
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
    "sam",
    "sam macaluso",
    "personal website",
    "docs",
  ],
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
