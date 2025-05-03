import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: "macalu.so",
  },
  links: [
    {
      text: "GitHub",
      url: "https://github.com/oonis",
    },
    {
      text: "CV",
      url: "https://macalu.so/cv.pdf",
    },
  ],
}
