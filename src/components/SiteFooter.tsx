import { CookiePreferencesButton } from "@/components/CookieConsent";
import Link from "next/link";
import { ArrowUpRight, AtSign, Mail, MessageCircle } from "lucide-react";
import { whatsappLinkProps } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Informações institucionais">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-company">
            <Link className="site-footer-brand" href="/" aria-label="Its Time — início">
              Its Time<span aria-hidden="true">.</span>
            </Link>
            <p>IA que organiza. Estratégia que multiplica.</p>
            <div className="site-footer-registration">
              <strong>ITS TIME TECH LTDA</strong>
              <span>CNPJ: 68.427.775/0001-81</span>
            </div>
          </div>

          <div>
            <h2>Onde estamos</h2>
            <address>
              Av. Cristóvão Colombo, 2144<br />
              Sala 408, Andar 3 · Floresta<br />
              Porto Alegre/RS · CEP 90560-001<br />
              Brasil
            </address>
          </div>

          <div>
            <h2>Contato comercial</h2>
            <ul>
              <li><a {...whatsappLinkProps()}><MessageCircle size={16} aria-hidden="true" /><span>WhatsApp comercial</span><ArrowUpRight size={14} aria-hidden="true" /></a></li>
              <li><a href="mailto:matheus@itstime.pro"><Mail size={16} aria-hidden="true" /><span>matheus@itstime.pro</span></a></li>
              <li><a href="https://www.instagram.com/itstime_pro/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Its Time: @itstime_pro"><AtSign size={16} aria-hidden="true" /><span>@itstime_pro</span><ArrowUpRight size={14} aria-hidden="true" /></a></li>
            </ul>
          </div>

          <nav aria-label="Institucional e documentos legais">
            <h2>Institucional</h2>
            <ul>
              <li><Link href="/termos-de-uso">Termos de uso</Link></li>
              <li><Link href="/politica-de-privacidade">Política de privacidade</Link></li>
              <li><Link href="/exclusao-de-dados">Exclusão de dados</Link></li>
              <li><CookiePreferencesButton /></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/updates">Atualizações</Link></li>
            </ul>
          </nav>
        </div>
        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} Its Time. Todos os direitos reservados.</p>
          <span>Inteligência que opera. Estratégia que escala.</span>
        </div>
      </div>
    </footer>
  );
}
