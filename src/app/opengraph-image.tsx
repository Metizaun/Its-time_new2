import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Its Time";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoData = await readFile(
    join(process.cwd(), "public/assets/brand/its-time-mark-transparent-clean.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f3ef",
        }}
      >
        <img src={logoSrc} width={220} height={227} />
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: 8,
            color: "#0a0a0a",
          }}
        >
          ITS TIME
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 28,
            color: "#6a6764",
          }}
        >
          IA que organiza. Estratégia que multiplica.
        </div>
      </div>
    ),
    { ...size }
  );
}
