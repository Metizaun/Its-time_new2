import Link from "next/link";
import { ArrowUpRight, BookOpen, Code2 } from "lucide-react";
import { BlogFooter, BlogHeader } from "@/components/blog/BlogShell";
import { resourceGroups } from "@/lib/resources";
import { JsonLd, breadcrumbList } from "@/lib/structured-data";
import "@/styles/blog.css";

/** Landing page for one group of guides (/tutoriais, /dev/documentacao), so those folders don't end in a 404. */
export function ResourceIndexPage({ groupId, path, kicker }: { groupId: string; path: string; kicker: string }) {
  const group = resourceGroups.find((candidate) => candidate.id === groupId);
  if (!group) throw new Error(`Unknown resource group: ${groupId}`);
  const Icon = group.id === "dev" ? Code2 : BookOpen;

  return (
    <div className="blog-shell">
      <JsonLd
        data={breadcrumbList([
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: group.title, path },
        ])}
      />
      <BlogHeader />
      <main id="blog-main" className="blog-main">
        <section className="blog-intro">
          <span className="blog-kicker">{kicker}</span>
          <h1>{group.title}</h1>
          <div className="blog-intro-bottom">
            <p>{group.description}</p>
          </div>
        </section>
        <section className="blog-resources" aria-label={group.title}>
          <div className="blog-resource-grid">
            {group.links.map((item) => (
              <Link key={item.href} href={item.href} className="blog-resource-card">
                <span className="blog-resource-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <span className="blog-kicker">{item.meta}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <span className="blog-text-link">
                  {group.action}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <BlogFooter />
    </div>
  );
}
