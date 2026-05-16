import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { FeatureSlide } from "./data";

const cubeSrc = "/assets/Scroll_slide/Referencias/Referencia_slide-2_Cube-icon-png.png";

export function FeatureSlideFrame({
  slide,
  children,
  className = "",
  visualClassName = "",
}: {
  slide: FeatureSlide;
  children: ReactNode;
  className?: string;
  visualClassName?: string;
}) {
  return (
    <section
      className={`feature-slide feature-slide--${slide.variant} ${className}`}
      data-feature-slide
      data-slide-id={slide.id}
      aria-labelledby={`feature-${slide.id}-title`}
    >
      <FeatureBackground src={slide.backgroundSrc} />
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

export function FeatureBackground({ src }: { src?: string }) {
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
      <div className="feature-background-vignette" />
      <div className="feature-background-grid" />
    </div>
  );
}

export function CoreCube({
  className = "",
  marker = "core-cube",
}: {
  className?: string;
  marker?: string;
}) {
  return (
    <div className={`feature-core-cube ${className}`} data-required-element={marker}>
      <Image
        src={cubeSrc}
        alt=""
        width={500}
        height={500}
        sizes="(max-width: 820px) 180px, 260px"
        aria-hidden="true"
      />
      <span className="feature-core-pulse" aria-hidden="true" />
    </div>
  );
}

export function OrbitRings({ count = 4 }: { count?: number }) {
  return (
    <div className="feature-orbit-rings" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} style={{ "--ring-index": index } as CSSProperties} />
      ))}
    </div>
  );
}

export function PixelField({ dense = false }: { dense?: boolean }) {
  const dots = dense ? 76 : 42;

  return (
    <div className={`feature-pixel-field ${dense ? "feature-pixel-field--dense" : ""}`} aria-hidden="true">
      {Array.from({ length: dots }).map((_, index) => {
        const x = (index * 37) % 100;
        const y = (index * 53) % 100;
        const size = 3 + ((index * 7) % 9);
        const tone = index % 7 === 0 ? "hot" : index % 5 === 0 ? "soft" : "dim";

        return (
          <span
            className={`feature-pixel feature-pixel--${tone}`}
            key={index}
            style={
              {
                "--pixel-x": `${x}%`,
                "--pixel-y": `${y}%`,
                "--pixel-size": `${size}px`,
                "--pixel-delay": `${index * 78}ms`,
            } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export function TechCard({
  icon,
  title,
  subtitle,
  marker,
  className = "",
  online = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  marker: string;
  className?: string;
  online?: boolean;
}) {
  return (
    <article
      className={`feature-tech-card ${className}`}
      data-motion-card
      data-required-element={marker}
    >
      <span className="feature-tech-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="feature-tech-copy">
        <strong>{title}</strong>
        {online ? (
          <small>
            <span className="feature-online-dot" aria-hidden="true" />
            Online
          </small>
        ) : subtitle ? (
          <small>{subtitle}</small>
        ) : null}
      </span>
    </article>
  );
}

export function ConnectorLines({
  variant = "radial",
  className = "",
}: {
  variant?: "radial" | "context" | "channels";
  className?: string;
}) {
  const paths =
    variant === "context"
      ? [
          "M95 118 C212 118 214 218 344 218",
          "M244 48 C308 48 328 124 416 124",
          "M546 48 C478 48 462 124 416 124",
          "M666 226 C542 226 530 218 408 218",
          "M118 348 C246 348 252 238 344 238",
        ]
      : variant === "channels"
        ? [
            "M80 82 C238 82 234 168 398 168",
            "M80 180 C236 180 234 204 398 204",
            "M80 278 C236 278 234 238 398 238",
            "M80 376 C238 376 234 268 398 268",
          ]
        : [
            "M380 45 L380 188",
            "M380 470 L380 330",
            "M110 165 L308 226",
            "M110 350 L306 286",
            "M650 165 L452 226",
            "M650 350 L452 286",
          ];

  return (
    <svg
      className={`feature-connector-lines feature-connector-lines--${variant} ${className}`}
      viewBox={variant === "radial" ? "0 0 760 520" : "0 0 760 430"}
      fill="none"
      aria-hidden="true"
    >
      {paths.map((path, index) => (
        <path className="feature-line-path" d={path} key={path} style={{ "--path-index": index } as CSSProperties} />
      ))}
      {paths.map((_, index) => {
        const radialNodes = [
          [380, 45],
          [380, 470],
          [110, 165],
          [110, 350],
          [650, 165],
          [650, 350],
        ];
        const contextNodes = [
          [95, 118],
          [244, 48],
          [546, 48],
          [666, 226],
          [118, 348],
        ];
        const channelNodes = [
          [80, 82],
          [80, 180],
          [80, 278],
          [80, 376],
        ];
        const [cx, cy] =
          variant === "radial"
            ? radialNodes[index]
            : variant === "channels"
              ? channelNodes[index]
              : contextNodes[index];

        return <circle className="feature-line-node" cx={cx} cy={cy} r="4" key={`node-${index}`} />;
      })}
    </svg>
  );
}
