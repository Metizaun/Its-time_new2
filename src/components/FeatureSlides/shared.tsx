import Image from "next/image";
import type { ReactNode } from "react";
import type { FeatureSlide } from "./data";

export function FeatureSlideFrame({
  slide,
  children,
  className = "",
  visualClassName = "",
  background,
}: {
  slide: FeatureSlide;
  children: ReactNode;
  className?: string;
  visualClassName?: string;
  /** Extra full-bleed layers for this slide's background (no box, so nothing can show an edge). */
  background?: ReactNode;
}) {
  return (
    <section
      className={`feature-slide feature-slide--${slide.variant} ${className}`}
      data-feature-slide
      data-slide-id={slide.id}
      aria-labelledby={`feature-${slide.id}-title`}
    >
      <FeatureBackground src={slide.backgroundSrc}>{background}</FeatureBackground>
      <div className="feature-slide-inner">
        <div className="feature-copy" data-motion-item>
          <span className="feature-kicker">{slide.kicker}</span>
          <h2 id={`feature-${slide.id}-title`}>
            {slide.headline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p>{slide.body}</p>
        </div>
        <div className={`feature-visual ${visualClassName}`} data-motion-item>
          {children}
        </div>
      </div>
    </section>
  );
}

export function FeatureBackground({ src, children }: { src?: string; children?: ReactNode }) {
  return (
    <div className="feature-background" aria-hidden="true">
      {src ? (
        <Image
          className="feature-background-image"
          src={src}
          alt=""
          fill
          sizes="100vw"
        />
      ) : null}
      {children}
      <div className="feature-background-vignette" />
    </div>
  );
}
