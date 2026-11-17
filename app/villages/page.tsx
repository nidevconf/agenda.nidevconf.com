/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Villages",
  description: "Themed, hands-on spaces run by the community at NIDC 2026. Drop in any time on the day.",
};

/* Ported from nidevconf.com/villages: the same village data and cards. The
   pre-event bits (propose-a-village CTAs, the photo lightbox) are left there. */
type Village = {
  id: string;
  name: string;
  theme: string;
  about: string;
  // a paragraph, several paragraphs, or named workshops when a village is running several
  atNidc: string | string[] | { title: string; text: string }[];
  // optional photo of the village's stand, shown at the top of its card
  image?: { src: string; alt: string };
  links: { label: string; href?: string }[];
};

const villages: Village[] = [
  {
    id: "retro",
    name: "TIMELINE",
    theme: "Retro village",
    about:
      "We bring computing history to life through original computers and consoles that people can use and enjoy. Play classic games, try your hand at programming and discover how technology changed the way we learned, worked and created.",
    atNidc: [
      "For NIDC this year, we’ve picked a selection of machines for you to try between talks. Everything is hands-on, with activities to get you started. Or, if you already know your way around, go off-piste and show us how it’s done!",
      "Drop by and have some retro fun!",
    ],
    links: [
      {
        label: "timelineexperience.netlify.app",
        href: "https://timelineexperience.netlify.app",
      },
      {
        label: "Facebook: Timeline Carrickfergus",
        href: "https://www.facebook.com/people/Timeline-Carrickfergus/61592370308595/",
      },
      {
        label: "TimelineExperience@outlook.com",
        href: "mailto:TimelineExperience@outlook.com",
      },
    ],
  },
  {
    id: "security",
    name: "Atlantic Exploit Labs",
    theme: "Security village",
    about: "Atlantic Exploit Labs build cyber security challenges for conferences.",
    atNidc:
      "We have a number of challenges that are designed to be solved without requiring participants to bring any additional hardware.",
    links: [
      {
        label: "LinkedIn: Atlantic Exploit Labs",
        href: "https://www.linkedin.com/company/atlantic-exploit-labs",
      },
    ],
  },
  {
    id: "kids",
    name: "Northern Ireland Raspberry Jam",
    theme: "Kids village",
    about:
      "The Northern Ireland Raspberry Jam is a programme of free, regular and family friendly events, aimed at providing attendees the opportunity to get hands on with coding and electronics, in a fun and practical setting. These events, known as “Raspberry Jams”, are organised and led by a group of 40+ passionate volunteers from across Northern Ireland, who come together to pull off the largest regular coding programme in Northern Ireland, for people of all ages.",
    atNidc: [
      {
        title: "Creating Art with Robots",
        text: "Using a Micro:bit and a Bitbot with a marker, create robot art by programming the Micro:bit to drive around a canvas with other robots. All programming in this workshop uses MakeCode, a super simple graphical Scratch-like code editor.",
      },
      {
        title: "Unicorn Horns",
        text: "In this workshop you will hack the Neopixels (multicoloured LEDs) on a Circuit Playground to create a colour changing Unicorn Horn! All programming in this workshop uses MakeCode, a super simple graphical Scratch-like code editor.",
      },
    ],
    links: [
      { label: "niraspberryjam.com", href: "https://niraspberryjam.com/" },
      { label: "info@niraspberryjam.com", href: "mailto:info@niraspberryjam.com" },
    ],
  },
  {
    id: "maker",
    name: "Farset Labs and Tog Hackerspace",
    theme: "Maker village",
    about:
      "Maker Village is a collaboration between two hackerspaces on the island: Farset Labs in Belfast and Tog in Dublin. They’re bringing it to NIDC as part of a shared island programme to get makers across the island of Ireland to build connections, learn cool stuff from each other, and have a bit of fun making.",
    atNidc:
      "We’ll bring 3D printers so you can give it a go on the day and have something to take home. We’ll also bring a giant, programmable, LED ping pong table from Robin Price’s “This is a table” project, built with Farset Labs members over the past few months.",
    links: [
      { label: "farsetlabs.org.uk", href: "https://www.farsetlabs.org.uk/" },
      { label: "tog.ie", href: "https://www.tog.ie/" },
    ],
  },
];

export default function VillagesPage() {
  return (
    <div className="page-wrap villages-page">
      <h1 className="sec-title">
        The <span className="hl">villages</span>.
      </h1>
      <p className="page-lead">Themed, hands-on spaces run by the community. Drop in any time on the day.</p>

      <figure className="statement-photo">
        <img
          src="/images/village.jpg"
          width="1600"
          height="1066"
          alt="An attendee works at a laptop beside a desktop 3D printer and reels of filament at an NIDC village stand"
        />
      </figure>

      <p className="villages-intro">
        Between the talks, the villages are where you get your hands on things. Each one is run by a group from
        the community, with something to try, play with or solve. No need to book, just wander in.
      </p>

      <ul className="villages">
        {villages.map((v) => (
          <li key={v.id} id={v.id} className="village">
            {v.image && <img className="village-photo" src={v.image.src} alt={v.image.alt} loading="lazy" />}
            <div className="village-body">
              <p className="village-theme">{v.theme}</p>
              <h2 className="village-name">{v.name}</h2>
              <h3>About {v.name}</h3>
              <p>{v.about}</p>
              <h3>At NIDC</h3>
              {[v.atNidc].flat().map((w) =>
                typeof w === "string" ? (
                  <p key={w}>{w}</p>
                ) : (
                  <div key={w.title} className="village-workshop">
                    <h4>{w.title}</h4>
                    <p>{w.text}</p>
                  </div>
                ),
              )}
              <p className="facts village-links">
                {v.links.map((l) =>
                  l.href ? (
                    <a key={l.label} href={l.href}>
                      {l.label}
                    </a>
                  ) : (
                    <span key={l.label}>{l.label}</span>
                  ),
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
