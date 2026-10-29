import Link from "next/link";
import { ArrowUpRight, BookOpen, Code2 } from "lucide-react";
import { resourceGroups } from "@/lib/resources";

export function BlogContentNavigation() {
  return <nav className="blog-content-nav" aria-label="Explorar conteúdos">
    <a href="#artigos">Artigos</a>
    {resourceGroups.map(group => <a key={group.id} href={`#${group.id}`}>{group.title}<span>{group.links.length} guias</span></a>)}
  </nav>;
}

export function BlogResources() {
  return <>
    {resourceGroups.map(group => {
      const Icon = group.id === "dev" ? Code2 : BookOpen;
      return <section key={group.id} id={group.id} className="blog-resources" aria-labelledby={`${group.id}-title`}>
        <span className="blog-kicker">{group.id === "dev" ? "PARA QUEM INTEGRA" : "PARA QUEM USA O CRM"}</span>
        <h2 id={`${group.id}-title`}>{group.title}</h2>
        <p className="blog-resources-description">{group.description}</p>
        <div className="blog-resource-grid">
          {group.links.map(item => <Link key={item.href} href={item.href} className="blog-resource-card">
            <span className="blog-resource-icon" aria-hidden="true"><Icon size={22} /></span>
            <span className="blog-kicker">{item.meta}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="blog-text-link">{group.action}<ArrowUpRight size={18} aria-hidden="true" /></span>
          </Link>)}
        </div>
      </section>;
    })}
  </>;
}
