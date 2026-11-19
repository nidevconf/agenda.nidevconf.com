import { readFileSync } from "node:fs";

/* What every link-preview image needs: its size, the brand's colours, Poppins, and the
   repo's own files read at build time (the static export has no server to fetch them). */

export const OG_SIZE = { width: 1200, height: 630 };

export const INK = "#121212";
export const PINK = "#EC008C";

export const asset = (path: string) => readFileSync(`${process.cwd()}/${path}`);

/** A repo file as a data: URI, for an <img> inside the image. */
export const dataUri = (path: string, mime: string) => `data:${mime};base64,${asset(path).toString("base64")}`;

const POPPINS = { 400: "Regular", 500: "Medium", 600: "SemiBold" } as const;

/** The Poppins weights an image uses, as ImageResponse's `fonts`. */
export const poppins = (...weights: (keyof typeof POPPINS)[]) =>
  weights.map((weight) => ({
    name: "Poppins",
    data: asset(`app/_fonts/Poppins-${POPPINS[weight]}.ttf`),
    weight,
    style: "normal" as const,
  }));
