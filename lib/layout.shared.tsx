import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span
          className="inline-flex items-center gap-2 font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <svg viewBox="0 0 293 257" width="22" height="20" aria-hidden="true">
            <path d="M155 15 L55 118 L252 122 Z" fill="#2f9bde" />
            <path d="M155 15 L150 216 L105 120 Z" fill="#c8e6f8" />
          </svg>
          Kite
        </span>
      ),
    },
    links: [
      { text: "usekite.site", url: "https://usekite.site", external: true },
    ],
    githubUrl: "https://github.com/Kite-01",
  };
}
