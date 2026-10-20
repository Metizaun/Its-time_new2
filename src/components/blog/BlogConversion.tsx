"use client";

import { useEffect } from "react";

/** An integration point for the site's analytics; no identifier, storage or external request. */
export function BlogConversion() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[data-blog-cta]");
      if (!link) return;
      window.dispatchEvent(
        new CustomEvent("its-time:blog-cta", {
          detail: {
            event: "blog_cta_click",
            article:
              link.dataset.article === "blog" &&
              window.location.pathname.startsWith("/blog/")
                ? document.querySelector("h1")?.textContent
                : link.dataset.article,
            position: link.dataset.blogCta,
            path: window.location.pathname,
          },
        }),
      );
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
