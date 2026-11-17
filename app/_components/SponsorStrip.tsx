/* eslint-disable @next/next/no-img-element */

// Copied from nidevconf.com's SponsorStrip. This app is always dark, so only the
// white mono logo of each pair is kept. Heights are hand-tuned per logo so
// wordmarks, badges and stacked marks read as the same visual size.
const SPONSORS: { name: string; url: string; logo: string; h: number }[] = [
  { name: "Gearset", url: "https://gearset.com/", logo: "gearset-white.svg", h: 32 },
  { name: "Magnite", url: "https://www.magnite.com/", logo: "magnite-white.svg", h: 28 },
  { name: "Payroc", url: "https://payroc.com/", logo: "payroc-white.svg", h: 46 },
  { name: "Enso Recruitment", url: "https://www.ensorecruitment.com/", logo: "enso-white.png", h: 32 },
  { name: "Kainos", url: "https://www.kainos.com/", logo: "kainos-white.png", h: 28 },
  { name: "Allstate Northern Ireland", url: "https://www.allstateni.com/", logo: "allstate-white.svg", h: 32 },
  { name: "DailyPay", url: "https://www.dailypay.com/", logo: "dailypay-white.svg", h: 27 },
  { name: "Enably", url: "https://enablyco.com/", logo: "enably-white.svg", h: 28 },
  { name: "Coding Fury", url: "https://www.codingfury.com/", logo: "codingfury-white.png", h: 32 },
  { name: "Uptime Labs", url: "https://www.uptimelabs.io/", logo: "uptimelabs-white.svg", h: 40 },
  { name: "Liberty IT", url: "https://www.liberty-it.co.uk/", logo: "liberty-white.png", h: 52 },
  { name: "Phorest", url: "https://www.phorest.com/", logo: "phorest-white.png", h: 32 },
];

export default function SponsorStrip() {
  // Two copies of the row; the track slides one row-width and snaps back,
  // so the second copy is there only to fill the gap the first leaves.
  const row = (dup: boolean) => (
    <div className="sponsor-row" aria-hidden={dup || undefined}>
      {SPONSORS.map((s) => (
        <img key={s.name} src={`/images/sponsors/${s.logo}`} alt={dup ? "" : s.name} style={{ height: s.h }} />
      ))}
    </div>
  );
  return (
    <section className="sponsor-strip" aria-label="Sponsors">
      <div className="sponsor-track">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
