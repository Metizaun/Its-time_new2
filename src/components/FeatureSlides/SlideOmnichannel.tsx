import Image from "next/image";
import { Globe2, Send } from "lucide-react";
import { featureSlides } from "./data";
import {
  ConnectorLines,
  CoreCube,
  FeatureSlideFrame,
  OrbitRings,
  TechCard,
} from "./shared";

const slide = featureSlides[4];

const channels = [
  {
    title: "WhatsApp",
    marker: "whatsapp",
    className: "channel-card--whatsapp",
    icon: (
      <Image
        src="/assets/hero/icons/WhatsApp_icon.png"
        alt=""
        width={42}
        height={42}
        aria-hidden="true"
      />
    ),
  },
  {
    title: "Instagram",
    marker: "instagram",
    className: "channel-card--instagram",
    icon: (
      <Image
        src="/assets/hero/icons/Instagram_icon.png"
        alt=""
        width={42}
        height={42}
        aria-hidden="true"
      />
    ),
  },
  {
    title: "Telegram",
    marker: "telegram",
    className: "channel-card--telegram",
    icon: <Send size={38} strokeWidth={1.65} />,
  },
  {
    title: "Site",
    marker: "site",
    className: "channel-card--site",
    icon: <Globe2 size={40} strokeWidth={1.55} />,
  },
] as const;

export function SlideOmnichannel() {
  return (
    <FeatureSlideFrame slide={slide} visualClassName="feature-visual--channels">
      <div className="channel-system">
        <div className="channel-list">
          {channels.map((channel) => (
            <TechCard
              className={`channel-card ${channel.className}`}
              icon={channel.icon}
              key={channel.marker}
              marker={channel.marker}
              title={channel.title}
            />
          ))}
        </div>
        <ConnectorLines variant="channels" />
        <div className="channel-core-wrap">
          <OrbitRings count={5} />
          <CoreCube className="channel-core" />
        </div>
      </div>
    </FeatureSlideFrame>
  );
}

