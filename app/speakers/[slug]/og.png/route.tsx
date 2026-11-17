/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { readFileSync } from "node:fs";
import { ImageResponse } from "next/og";
import { large } from "../../../_lib/photos";
import { SPEAKERS, speakerBySlug } from "../../../_lib/speakers";

export const dynamicParams = false;

export function generateStaticParams() {
  return SPEAKERS.map(({ slug }) => ({ slug }));
}

const INK = "#121212";
const MUTED = "#B5B5B5";
const PINK = "#EC008C";
const FOOT = "Saturday 21 November 2026 · International Convention Centre Belfast · NIDC 2026";

const file = (p: string) => readFileSync(`${process.cwd()}/${p}`);
const uri = (p: string, mime: string) => `data:${mime};base64,${file(p).toString("base64")}`;

/* The unfurl a speaker's agenda link shows: their photo, name, talk, and the
   event, matching the design nidevconf.com uses for its own session pages. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = speakerBySlug(slug);
  if (!s) return new Response("Not found", { status: 404 });

  const tree = (
    <div
      style={{
        width: 1200,
        height: 630,
        background: INK,
        color: "#fff",
        fontFamily: "Poppins",
        display: "flex",
        padding: 56,
        gap: 48,
        alignItems: "center",
      }}
    >
      <img
        src={uri(`public/images/speakers/${large(s.photo)}`, "image/jpeg")}
        width={380}
        height={380}
        style={{ borderRadius: 24, objectFit: "cover", flexShrink: 0 }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1, minWidth: 0, height: "100%" }}>
        <img src={uri("public/images/nidc-wordmark-dark.png", "image/png")} height={64} width={134} />
        <div style={{ fontSize: s.talk.title.length > 60 ? 32 : 38, fontWeight: 600, lineHeight: 1.2, display: "flex" }}>
          {s.talk.title}
        </div>
        <div style={{ display: "flex", fontSize: 20, fontWeight: 600, color: PINK, letterSpacing: 2 }}>
          SPEAKING AT NIDC 2026
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{s.name}</div>
          <div style={{ fontSize: 20, color: MUTED }}>{s.tagline}</div>
        </div>
        <div style={{ marginTop: "auto", display: "flex", color: MUTED, fontSize: 18 }}>{FOOT}</div>
      </div>
    </div>
  );

  return new ImageResponse(tree, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Poppins", data: file("app/_fonts/Poppins-Regular.ttf"), weight: 400, style: "normal" },
      { name: "Poppins", data: file("app/_fonts/Poppins-SemiBold.ttf"), weight: 600, style: "normal" },
    ],
  });
}
