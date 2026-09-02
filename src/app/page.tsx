import Image from "next/image";
import { LegalLinks } from "@/components/LegalLinks";
import { UpdateAnnouncementModal } from "@/components/UpdateAnnouncementModal";

export default function Home() {
  return (
    <main className="maintenance-page">
      <div className="maintenance-grid" aria-hidden="true" />
      <div className="maintenance-glow maintenance-glow-top" aria-hidden="true" />
      <div className="maintenance-glow maintenance-glow-bottom" aria-hidden="true" />

      <header className="maintenance-header">
        <a className="maintenance-brand" href="#main-content" aria-label="Its Time - início">
          <span className="maintenance-brand-mark" aria-hidden="true">
            <Image
              src="/assets/brand/its-time-mark-transparent-clean.png"
              alt=""
              width={48}
              height={50}
              preload
            />
          </span>
          <span className="maintenance-brand-name">Its Time</span>
        </a>

        <span className="maintenance-header-status">
          <span className="maintenance-status-dot" aria-hidden="true" />
          Sistema em atualização
        </span>
      </header>

      <section className="maintenance-content" id="main-content" aria-labelledby="maintenance-title">
        <div className="maintenance-kicker">
          <span className="maintenance-kicker-line" aria-hidden="true" />
          Manutenção programada
        </div>

        <div className="maintenance-card">
          <div className="maintenance-loader" aria-hidden="true">
            <div className="maintenance-loader-orbit maintenance-loader-orbit-one" />
            <div className="maintenance-loader-orbit maintenance-loader-orbit-two" />
            <div className="maintenance-loader-core">
              <strong>84</strong>
              <span>%</span>
            </div>
          </div>

          <div className="maintenance-copy">
            <h1 id="maintenance-title">
              Estamos deixando tudo
              <span>ainda melhor.</span>
            </h1>
            <p>
              Nosso sistema está passando por uma atualização importante. Em
              breve, a Its Time estará de volta com uma experiência mais rápida
              e inteligente.
            </p>
          </div>

          <div className="maintenance-progress-block">
            <div className="maintenance-progress-label">
              <span>Progresso da atualização</span>
              <strong>84%</strong>
            </div>
            <div
              className="maintenance-progress-track"
              role="progressbar"
              aria-label="Progresso da atualização"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={84}
            >
              <span className="maintenance-progress-value" />
            </div>
          </div>

          <a
            className="maintenance-contact-button"
            href="https://wa.me/554196081781?text=Ol%C3%A1%21%20Vim%20pelo%20site%20e%20quero%20conhecer%20a%20Its%20Time%20Pro."
            target="_blank"
            rel="noreferrer"
          >
            Fale com a gente
            <span aria-hidden="true">↗</span>
          </a>

          <div className="maintenance-card-footer">
            <span className="maintenance-pulse" aria-hidden="true" />
            <span>Quase lá. Obrigado pela paciência.</span>
          </div>
        </div>
      </section>

      <footer className="maintenance-footer">
        <div className="maintenance-footer-brand">
          <span>ITS TIME</span>
          <span className="maintenance-footer-divider" aria-hidden="true" />
          <span>IA que organiza. Estratégia que multiplica.</span>
        </div>
        <LegalLinks />
      </footer>

      <UpdateAnnouncementModal />
    </main>
  );
}
