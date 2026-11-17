import { existsSync } from "node:fs";

/* The 800px crop where one exists, for a speaker's own page and OG image.
   Server only: it looks at disk at build time. */
export function large(photo: string) {
  const lg = photo.replace(/\.[^.]+$/, "-lg.jpg");
  return existsSync(`${process.cwd()}/public/images/speakers/${lg}`) ? lg : photo;
}
