import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-fd-muted-foreground">
        This page doesn&apos;t exist — maybe it never did.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
      >
        Back to home
      </Link>
    </div>
  );
}
