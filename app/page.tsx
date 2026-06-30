import Image from "next/image"
import Link from "next/link"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions } from "./layout.config"
import { source } from "@/lib/source"

type DocPage = ReturnType<typeof source.getPages>[number]

function hasDate(page: DocPage): page is DocPage & { data: { date: string } } {
  return typeof page.data.date === "string"
}

function sectionCount(pages: DocPage[], section: string) {
  return pages.filter(
    (page) => page.slugs[0] === section && page.slugs.length > 1,
  ).length
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

export default function HomePage() {
  const pages = source.getPages()

  const appsCount = sectionCount(pages, "apps")
  const bestInSlotCount = sectionCount(pages, "best-in-slot")
  const totalEntries = appsCount + bestInSlotCount

  const recommending = pages
    .filter(hasDate)
    .sort((a, b) => (a.data.date < b.data.date ? 1 : -1))[0]

  return (
    <HomeLayout {...baseOptions} className="bg-fd-background text-fd-foreground">
      <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16">
        <div className="flex items-center gap-4">
          <Image
            src="/avatar.jpg"
            alt="A close-up of Sam's dog"
            width={64}
            height={64}
            priority
            className="rounded-full object-cover"
          />
          <div>
            <h1 className="font-serif text-2xl">Hey, I&apos;m Sam.</h1>
            <p className="text-sm text-fd-muted-foreground">
              A software developer who researches way too much into mundane
              things.
            </p>
          </div>
        </div>

        {recommending ? (
          <div className="rounded-lg border border-fd-border bg-fd-card p-4">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-fd-muted-foreground">
              <span className="font-mono">
                No. {String(totalEntries).padStart(3, "0")}
              </span>
              <span>Currently recommending</span>
            </div>
            <Link
              href={recommending.url}
              className="font-serif text-lg text-fd-foreground hover:text-fd-accent"
            >
              {recommending.data.title}
            </Link>
            {recommending.data.description ? (
              <p className="mt-1 text-sm text-fd-muted-foreground">
                {recommending.data.description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/apps"
            className="rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-accent"
          >
            <span className="font-serif text-lg">Apps →</span>
            <p className="mt-1 text-xs text-fd-muted-foreground">
              {appsCount} {pluralize(appsCount, "entry", "entries")}
            </p>
          </Link>
          <Link
            href="/best-in-slot"
            className="rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:border-fd-accent"
          >
            <span className="font-serif text-lg">Best in Slot →</span>
            <p className="mt-1 text-xs text-fd-muted-foreground">
              {bestInSlotCount}{" "}
              {pluralize(bestInSlotCount, "category", "categories")}
            </p>
          </Link>
        </div>

        <div className="space-y-3 text-sm text-fd-muted-foreground">
          <p>
            This site is my second brain: a place where I document the things
            I&apos;ve found, use, and recommend.
          </p>
          <p>
            Built with{" "}
            <a href="https://nextjs.org" className="underline">
              Next.js
            </a>{" "}
            and{" "}
            <a href="https://fumadocs.vercel.app" className="underline">
              Fumadocs
            </a>
            , deployed on{" "}
            <a href="https://vercel.com" className="underline">
              Vercel
            </a>
            . Source on{" "}
            <a
              href="https://github.com/oonis/macalu.so"
              className="underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </HomeLayout>
  )
}
