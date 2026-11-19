/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from "next/og";
import { dataUri, INK, OG_SIZE, PINK, poppins } from "../_lib/og";

export const dynamic = "force-static";

/* The generic preview for a plain (un-shared) link to the app. A link that
   carries ?name=&agenda= is someone's actual agenda, but under a static export
   there's no server to render that per-share — see README for the tradeoff. */
export async function GET() {
  const tree = (
    <div
      style={{
        ...OG_SIZE,
        background: INK,
        color: "#fff",
        fontFamily: "Poppins",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        gap: 24,
      }}
    >
      <img src={dataUri("public/images/nidc-wordmark-dark.png", "image/png")} height={72} width={151} />
      <div style={{ fontSize: 56, fontWeight: 600, lineHeight: 1.15, display: "flex" }}>Build your NIDC 2026 agenda</div>
      <div style={{ fontSize: 26, color: "#B5B5B5", display: "flex" }}>
        Bookmark the talks you want to see, and share it with a link.
      </div>
      <div style={{ marginTop: 24, fontSize: 20, color: PINK, fontWeight: 600, display: "flex" }}>
        Saturday 21 November 2026 · ICC Belfast
      </div>
    </div>
  );

  return new ImageResponse(tree, { ...OG_SIZE, fonts: poppins(400, 600) });
}
