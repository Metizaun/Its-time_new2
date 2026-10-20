import Link from "next/link";
import { inlineLinks, safeBlogUrl } from "@/lib/blog-editorial";

export function InlineText({ text }: { text: string }) {
  let cursor = 0;
  const parts: React.ReactNode[] = [];
  for (const match of inlineLinks(text)) {
    const index = match.index!;
    parts.push(text.slice(cursor, index));
    const [, label, href] = match;
    if (!safeBlogUrl(href)) parts.push(label);
    else if (href.startsWith("/"))
      parts.push(
        <Link key={index} href={href}>
          {label}
        </Link>,
      );
    else
      parts.push(
        <a
          key={index}
          href={href}
          {...(href.startsWith("https://")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {label}
        </a>,
      );
    cursor = index + match[0].length;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
