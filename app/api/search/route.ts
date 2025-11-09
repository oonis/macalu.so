import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source);

// Enable edge runtime for faster cold starts
export const runtime = "edge";
