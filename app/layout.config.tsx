import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: "sam macaluso",
  },
  links: [
    {
      text: "Wiki",
      url: "/",
    },
    {
      text: "GitHub",
      url: "https://github.com/oonis",
      external: true,
    },
    {
      text: "CV",
      url: "https://oonis.github.io/cv/",
      external: true,
    },
  ],
};
