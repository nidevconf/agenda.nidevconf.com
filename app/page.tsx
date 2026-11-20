/* eslint-disable @next/next/no-img-element */
import { Ticket } from "lucide-react";
import LegacyShareRedirect from "./_components/LegacyShareRedirect";
import SponsorStrip from "./_components/SponsorStrip";
import TiltBadge from "./_components/TiltBadge";

// the tickets section of the main site
const TICKETS = "https://nidevconf.com/#tickets";

/* The nidevconf.com hero's two lines and its yellow badge, centred, with the
   sponsor strip along the foot of the same screen. The agenda lives at /agenda. */
export default function HomePage() {
  return (
    <section className="hero">
      <LegacyShareRedirect />
      <div className="hero-copy">
        <img className="hero-logo" src="/images/nidc-wordmark-dark.png" alt="NIDC" />
        <h1>
          Technical talks, great craic,{" "}
          <span className="nobr">
            <span className="hl tilt-flat">tech community</span>.
          </span>
        </h1>
        <p className="for-nerds">
          This one is for the{" "}
          <span className="nobr">
            <span className="hl tilt-r">nerds</span>.
          </span>
        </p>
        <div className="hero-cta">
          <TiltBadge href="/agenda/build">Build my agenda</TiltBadge>
          {/* a new tab, so the installed app (which has no back button) isn't left for the main site */}
          <a className="btn btn-ghost" href={TICKETS} target="_blank" rel="noopener noreferrer">
            <Ticket size={18} aria-hidden />
            Get tickets
          </a>
        </div>
      </div>
      <SponsorStrip />
    </section>
  );
}
