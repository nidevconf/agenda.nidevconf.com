/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from "next/og";
import { dataUri, INK, OG_SIZE, PINK, poppins } from "../../../_lib/og";
import { large } from "../../../_lib/photos";
import { spoken } from "../../../_lib/schedule";
import { SPEAKERS, speakerBySlug } from "../../../_lib/speakers";

export const dynamicParams = false;

export function generateStaticParams() {
  return SPEAKERS.map(({ slug }) => ({ slug }));
}

const PAD = 56;
// as tall as the image less its padding, so it sits as far from the top and bottom as from the left
const PHOTO = OG_SIZE.height - 2 * PAD;
const GAP = 20;
const LOGO = { width: 230, height: 110 };
const NAME_SIZE = 44;
// a title over LONG_TITLE characters drops a size, so it fits beside the photo
const LONG_TITLE = 60;
const TITLE_SIZE = { short: 38, long: 32 };

const TAG = "#2A2A2A";
const TAG_TEXT = "#E6E6E6";

/* The homepage's highlight marker (globals.css .hl.tilt-flat) behind the name. The image
   renderer has no ::before, so the swipe is its own box under the text, sized in the same
   ems. */
function Highlighted({ children }: { children: string }) {
  const em = (n: number) => Math.round(n * NAME_SIZE);
  return (
    <div style={{ position: "relative", display: "flex", padding: `0 ${em(0.14)}px` }}>
      <div
        style={{
          position: "absolute",
          left: -em(0.06),
          right: -em(0.06),
          top: em(0.04),
          bottom: em(0.06),
          background: PINK,
          borderRadius: "3px 5px 4px 6px",
          transform: "rotate(-0.5deg)",
        }}
      />
      <div style={{ display: "flex" }}>{children}</div>
    </div>
  );
}

const Tag = ({ children }: { children: string }) => (
  <div style={{ display: "flex", padding: "6px 18px", borderRadius: 999, background: TAG, color: TAG_TEXT, fontSize: 24 }}>
    {children}
  </div>
);

/* The unfurl a speaker's link shows: their photo, and beside it their name, talk, and its
   time and room, under the NIDC logo. The name, talk and tags are centred beside the photo;
   the logo sits above them, balanced by an empty box of its height below, so it doesn't
   pull them off centre. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = speakerBySlug(slug);
  if (!s) return new Response("Not found", { status: 404 });

  const tree = (
    <div
      style={{
        ...OG_SIZE,
        background: INK,
        color: "#fff",
        fontFamily: "Poppins",
        fontWeight: 500,
        display: "flex",
        padding: PAD,
        gap: 48,
        alignItems: "center",
      }}
    >
      <img
        src={dataUri(`public/images/speakers/${large(s.photo)}`, "image/jpeg")}
        width={PHOTO}
        height={PHOTO}
        style={{ borderRadius: 24, objectFit: "cover", flexShrink: 0 }}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: GAP, flex: 1, minWidth: 0, height: "100%" }}>
        <img src={dataUri("public/images/nidc-wordmark-dark.png", "image/png")} width={LOGO.width} height={LOGO.height} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: GAP }}>
          <div style={{ display: "flex", fontSize: NAME_SIZE, lineHeight: 1.2 }}>
            <Highlighted>{s.name}</Highlighted>
          </div>
          <div style={{ display: "flex", textAlign: "center", fontSize: s.talk.title.length > LONG_TITLE ? TITLE_SIZE.long : TITLE_SIZE.short, lineHeight: 1.2 }}>
            {s.talk.title}
          </div>
          <div style={{ display: "flex", gap: 12, fontWeight: 400 }}>
            <Tag>{spoken(s.talk.start)}</Tag>
            <Tag>{s.talk.track}</Tag>
          </div>
        </div>
        <div style={{ display: "flex", height: LOGO.height, width: 1 }} />
      </div>
    </div>
  );

  return new ImageResponse(tree, { ...OG_SIZE, fonts: poppins(400, 500) });
}
