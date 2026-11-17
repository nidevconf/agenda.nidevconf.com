import type { Metadata } from "next";
import type { ReactNode } from "react";
import AddToAgenda from "../_components/AddToAgenda";
import PreviewPicks from "../_components/PreviewPicks";
import SpeakerCard from "../_components/SpeakerCard";
import SpeakerLinks from "../_components/SpeakerLinks";
import TalkCard from "../_components/TalkCard";
import talks from "../_data/talks.json";
import { SOCIALS } from "../_data/socials";
import { speakerBySlug } from "../_lib/speakers";
import SheetDemo from "./SheetDemo";

// The design system and component library. Live, but kept out of search and the menu.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

/* Every preview below renders the real component, inside its own stand-in agenda
   (PreviewPicks), so trying one never touches your own picks. Two talks at 10:00
   make the clash: Adam D'Arcy's (Hall 1B) and Raj Dhruv's (Room 1A). */
const ADAM = "1306848";
const RAJ = "1274424";
const talk = (id: string) => talks.find((t) => t.id === id)!;
const eve = speakerBySlug("eve-brennan")!;
const adam = speakerBySlug("adam-d-arcy")!;
const iz = speakerBySlug("iz-wright")!;
const nathan = speakerBySlug("nathan-sullivan")!;

const COLOURS: { group: string; items: [string, string, string][] }[] = [
  { group: "Surfaces", items: [
    ["--black", "#000000", "The speaker card. Photos fade into it."],
    ["--bg", "#121212", "The page."],
    ["--bg-2", "#1a1a1a", "Cards on the page, sheets."],
    ["--bg-3", "#222222", "Cards on a card, hover."],
    ["--line", "#303030", "Hairlines and control outlines."],
  ] },
  { group: "Text", items: [
    ["--ink", "#ffffff", "Primary text and icons."],
    ["--muted", "#b5b5b5", "Secondary text: taglines, meta, room and time."],
    ["--on-ink", "#121212", "Text on a white fill."],
  ] },
  { group: "Brand", items: [
    ["--pink", "#ec008c", "The accent: focus rings, logo, highlights. Never a state."],
    ["--pink-dk", "#ff4da6", "Pink as text on dark."],
  ] },
  { group: "State", items: [
    ["--green", "#4ade80", "Going: the talk is on your agenda."],
    ["--yellow", "#f2c94c", "Clash: two picks at the same time. Also warnings."],
    ["--on-state", "#000000", "Text and icons on a green or yellow fill."],
  ] },
];

const TYPE: [string, string, string, string][] = [
  ["--fs-name", "Display · 24 · 500", "Eve Brennan", "display-500"],
  ["--fs-sheet", "Display · 17 · 600", "Choose a session", "display-600 sheet"],
  ["--fs-card", "Display · 15 · 500", "Don’t Let the Bots Win", "display-500 card"],
  ["--fs-label", "Display · 10 · 600 · uppercase", "Room 1A", "label"],
  ["--fs-ui", "Body · 14 · 400", "Cloud Engineer IV at Business Insider", "body ui"],
  ["--fs-small", "Body · 13 · 400", "You're going to this talk", "body small"],
  ["--fs-time", "Mono · 11.5 · 400", "11:30 (30 minutes)", "mono"],
];

const RULES: [string, string][] = [
  ["Nothing jumps", "Rows that change keep a fixed height and titles clamp, so a tap only changes colour and words."],
  ["Colour is state", "Green means going, yellow means clash. Pink is the brand, never a state. A talk you'll miss looks like any other; only its words say so."],
  ["One radius", "Every box is 8px (--r). Only pills and circles are round."],
  ["44px to tap", "Anything you tap is at least --tap square."],
  ["Focus is always visible", "Keyboard focus gets an outline; the sheet takes focus itself, not its first button."],
  ["Faces stay clear", "No text over a speaker's face. Text sits where the photo has faded to black."],
  ["One gradient", "The photo fade (--photo-fade) is a legibility scrim. No decorative gradients."],
  ["Words are short", "Sentence case. No icons inside status text. Name things by what people do: “Choose a session”, not “Resolve conflict”."],
];

const NOT_YET: string[] = [
  "Agenda list: clashes still use the old yellow outline and a note instead of the status line.",
  "Desktop agenda grid: a picked talk is a white fill, not green.",
  "Speaker page (/speakers/…): its own layout, not the speaker card.",
  "Talks and Workshops pages, Villages and Home: still the original styles.",
];

function Section({ id, title, lead, children }: { id: string; title: string; lead?: string; children: ReactNode }) {
  return (
    <section id={id} className="ds-section">
      <h2>{title}</h2>
      {lead && <p className="ds-lead">{lead}</p>}
      {children}
    </section>
  );
}
function Demo({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={wide ? "ds-demo ds-demo-wide" : "ds-demo"}>
      <div className="ds-stage">{children}</div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
function Props({ rows }: { rows: [string, string, string][] }) {
  return (
    <table className="ds-props">
      <thead>
        <tr><th>Prop</th><th>Type</th><th>What it does</th></tr>
      </thead>
      <tbody>
        {rows.map(([p, t, d]) => (
          <tr key={p}><td><code>{p}</code></td><td><code>{t}</code></td><td>{d}</td></tr>
        ))}
      </tbody>
    </table>
  );
}
const Code = ({ children }: { children: string }) => <pre className="ds-code"><code>{children}</code></pre>;

const NAV: [string, string][] = [
  ["principles", "Principles"], ["colour", "Colour"], ["type", "Type"], ["space", "Space and shape"], ["photo", "Over photos"],
  ["add", "Add to agenda"], ["talk-card", "Talk card"], ["status", "Status line"], ["links", "Speaker links"], ["sheet", "Sheet"], ["speaker-card", "Speaker card"], ["button", "Button"],
  ["not-yet", "Not migrated yet"],
];

export default function DesignPage() {
  return (
    <div className="ds">
      <nav className="ds-nav" aria-label="On this page">
        <p>Foundations</p>
        {NAV.slice(0, 5).map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}
        <p>Components</p>
        {NAV.slice(5, 12).map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}
        <p>Status</p>
        {NAV.slice(12).map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}
      </nav>

      <main className="ds-main">
        <header className="ds-top">
          <h1>Design system</h1>
          <p className="ds-lead">The tokens and components the agenda app is built from, with every state. Tokens live in <code>app/globals.css</code>; components in <code>app/_components</code>. Previews are the real components on their own stand-in agenda, so trying them won&apos;t change yours.</p>
        </header>

        <Section id="principles" title="Principles">
          <dl className="ds-rules">
            {RULES.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
          </dl>
        </Section>

        <Section id="colour" title="Colour" lead="Always dark. Every colour is a token; the components on this page never use a raw hex (the parts not migrated yet still do).">
          {COLOURS.map((g) => (
            <div key={g.group} className="ds-swatches">
              <h3>{g.group}</h3>
              <ul>
                {g.items.map(([tok, hex, role]) => (
                  <li key={tok}>
                    <span className="ds-chip" style={{ background: `var(${tok})` }} />
                    <span><code>{tok}</code> <span className="ds-hex">{hex}</span><br />{role}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section id="type" title="Type" lead="Poppins for names, titles and headings. Inter for everything you read. JetBrains Mono for times only.">
          <ul className="ds-type">
            {TYPE.map(([tok, spec, sample, cls]) => (
              <li key={tok}><span className={`ds-sample ${cls}`}>{sample}</span><span className="ds-spec"><code>{tok}</code> {spec}</span></li>
            ))}
          </ul>
        </Section>

        <Section id="space" title="Space and shape">
          <div className="ds-row">
            {["--s05", "--s1", "--s15", "--s2", "--s3", "--s4"].map((t) => (
              <div key={t} className="ds-space"><span style={{ width: `var(${t})`, height: `var(${t})` }} /><code>{t}</code></div>
            ))}
          </div>
          <div className="ds-row">
            <div className="ds-shape"><span style={{ borderRadius: "var(--r)" }} /><code>--r</code> 8px, every box</div>
            <div className="ds-shape"><span style={{ borderRadius: "var(--r-pill)" }} /><code>--r-pill</code> pills, circles</div>
            <div className="ds-shape"><span style={{ width: "var(--tap)", height: "var(--tap)", borderRadius: "var(--r-pill)" }} /><code>--tap</code> 44px, the smallest target</div>
          </div>
          <p className="ds-note">Motion: <code>--t-fast</code> (.12s) for hover and press, <code>--t-sheet</code> (.25s) for a sheet. Only ever in answer to a tap.</p>
        </Section>

        <Section id="photo" title="Over photos" lead="The speaker card is the only place things sit on a photo. Glass for surfaces, a fade for legibility.">
          <div className="ds-row">
            <div className="ds-photo"><div className="ds-photo-img" /><span style={{ background: "var(--glass)" }}>--glass</span><span style={{ background: "var(--glass-strong)" }}>--glass-strong</span></div>
            <div className="ds-photo ds-photo-fade"><div className="ds-photo-img" /><span className="ds-on-photo">--photo-fade</span></div>
          </div>
        </Section>

        <Section id="add" title="Add to agenda" lead="The one control that puts a talk on your agenda, everywhere. Click them; each has its own agenda.">
          <div className="ds-grid">
            <PreviewPicks picks={[]}><Demo label="Not added"><AddToAgenda talk={talk(ADAM)} /></Demo></PreviewPicks>
            <PreviewPicks picks={[ADAM]}><Demo label="Added"><AddToAgenda talk={talk(ADAM)} /></Demo></PreviewPicks>
          </div>
          <p className="ds-note">Hover fills it lightly; press shrinks it; keyboard focus outlines it. On a filled card the tick turns black.</p>
          <Props rows={[["talk", "{ id, title, start, end }", "The talk it adds or removes."], ["swap", "boolean", "Adding also drops anything picked at the same time. Used in the clash sheet."]]} />
          <Code>{`<AddToAgenda talk={talk} />`}</Code>
        </Section>

        <Section id="talk-card" title="Talk card" lead="Every talk, everywhere: room and time, who, title. Tap the card to read more, tap the plus to add it.">
          <div className="ds-grid">
            <PreviewPicks picks={[]}><Demo label="With speakers (agenda)"><ul><TalkCard talk={talk(ADAM)} /></ul></Demo></PreviewPicks>
            <PreviewPicks picks={[]}><Demo label="Solo (speaker already on screen)"><TalkCard talk={talk(ADAM)} speakers={false} as="div" /></Demo></PreviewPicks>
            <PreviewPicks picks={[]}><Demo label="No action (someone else's agenda)"><TalkCard talk={talk(ADAM)} action="none" as="div" /></Demo></PreviewPicks>
          </div>
          <h3 className="ds-sub">With a status</h3>
          <div className="ds-grid">
            <PreviewPicks picks={[]}><Demo label="Not added"><TalkCard talk={talk(ADAM)} speakers={false} status as="div" /></Demo></PreviewPicks>
            <PreviewPicks picks={[ADAM]}><Demo label="Going"><TalkCard talk={talk(ADAM)} speakers={false} status as="div" /></Demo></PreviewPicks>
            <PreviewPicks picks={[ADAM, RAJ]}><Demo label="Clash"><TalkCard talk={talk(ADAM)} speakers={false} status as="div" /></Demo></PreviewPicks>
            <PreviewPicks picks={[RAJ]}><Demo label="You'll miss it"><TalkCard talk={talk(ADAM)} speakers={false} status as="div" /></Demo></PreviewPicks>
          </div>
          <Props rows={[
            ["talk", "Talk", "The talk."],
            ["speakers", "boolean = true", "Faces and names. Off where the speaker is already on screen."],
            ["action", '"add" | "none"', "The plus. None while previewing someone else's agenda."],
            ["status", 'boolean | "plain"', "The status line and its colour. Plain keeps the colour, drops the words (inside the sheet)."],
            ["swap", "boolean", "The plus also drops overlapping picks."],
            ["as", '"li" | "div"', "The element, for lists."],
          ]} />
          <Code>{`<TalkCard talk={talk} speakers={false} status as="div" />`}</Code>
        </Section>

        <Section id="status" title="Status line" lead="One line under the title, always there, so nothing jumps. Words, never icons. The underlined words open the sheet.">
          <table className="ds-props">
            <thead><tr><th>State</th><th>When</th><th>Card</th><th>Words</th></tr></thead>
            <tbody>
              <tr><td>Not added</td><td>Nothing at this time</td><td>Normal</td><td>(empty)</td></tr>
              <tr><td>Going</td><td>On your agenda</td><td>Green</td><td>You&apos;re going to this talk / lightning talk / workshop</td></tr>
              <tr><td>Clash</td><td>On your agenda, and so is something at the same time</td><td>Yellow</td><td>You&apos;ve got a <u>clash</u> · You&apos;ve got 2 <u>clashes</u></td></tr>
              <tr><td>You&apos;ll miss it</td><td>Not added; something else at this time is</td><td>Normal</td><td>You&apos;ll miss this for <u>another talk</u> · <u>2 other talks</u></td></tr>
            </tbody>
          </table>
        </Section>

        <Section id="links" title="Speaker links" lead="A column of round buttons on the speaker card: the first link, LinkedIn first, then “…” for the rest.">
          <div className="ds-grid">
            <Demo label="Several links"><div className="ds-on-black"><SpeakerLinks name={eve.name} links={SOCIALS[eve.slug] ?? []} /></div></Demo>
            <Demo label="One link: no “…”"><div className="ds-on-black"><SpeakerLinks name={iz.name} links={SOCIALS[iz.slug] ?? []} /></div></Demo>
            <Demo label="No links: nothing"><div className="ds-on-black"><SpeakerLinks name={nathan.name} links={SOCIALS[nathan.slug] ?? []} /><span className="ds-empty">(nothing renders)</span></div></Demo>
          </div>
          <p className="ds-note">Order: LinkedIn, website, blog, X, Instagram, other. Links come from Sessionize (<code>app/_data/socials.ts</code>).</p>
          <Props rows={[["name", "string", "For labels and the sheet title."], ["links", "[Social, url][]", "Ordered; the first is the button."]]} />
        </Section>

        <Section id="sheet" title="Sheet" lead="A bottom sheet for choosing or more detail. Opens when rendered; closes on ×, Esc or a tap outside. Talks inside stay put while you change them.">
          <div className="ds-row">
            <PreviewPicks picks={[ADAM, RAJ]}>
              <SheetDemo label="Choose a session" title="Choose a session">
                <ul>
                  <TalkCard talk={talk(ADAM)} status="plain" swap />
                  <TalkCard talk={talk(RAJ)} status="plain" swap />
                </ul>
              </SheetDemo>
            </PreviewPicks>
          </div>
          <Props rows={[["title", "string", "The heading."], ["onClose", "() => void", "Called however it closes. Unmount it there."], ["children", "ReactNode", "What it holds."]]} />
          <Code>{`{open && <Sheet title="Choose a session" onClose={() => setOpen(false)}>…</Sheet>}`}</Code>
        </Section>

        <Section id="speaker-card" title="Speaker card" lead="One speaker per screen on /speakers. The photo fades into black; links, name, tagline and talk sit on the faded part. It fills the height it's given.">
          <div className="ds-cards">
            <PreviewPicks picks={[]}><Demo label="Not added"><div className="ds-phone"><SpeakerCard speaker={eve} /></div></Demo></PreviewPicks>
            <PreviewPicks picks={[ADAM]}><Demo label="Going"><div className="ds-phone"><SpeakerCard speaker={adam} /></div></Demo></PreviewPicks>
            <PreviewPicks picks={[ADAM, RAJ]}><Demo label="Clash"><div className="ds-phone"><SpeakerCard speaker={adam} /></div></Demo></PreviewPicks>
            <PreviewPicks picks={[RAJ]}><Demo label="You'll miss it"><div className="ds-phone"><SpeakerCard speaker={adam} /></div></Demo></PreviewPicks>
          </div>
          <Props rows={[["speaker", "Speaker", "From SPEAKERS (app/_lib/speakers.ts)."]]} />
        </Section>

        <Section id="button" title="Button" lead="Pills, for actions that aren't on a card.">
          <div className="ds-row">
            <button type="button" className="btn btn-primary">Build my agenda</button>
            <button type="button" className="btn btn-secondary">Add these to mine</button>
            <button type="button" className="btn btn-ghost">Keep mine</button>
          </div>
          <Code>{`<button className="btn btn-primary">Build my agenda</button>`}</Code>
        </Section>

        <Section id="not-yet" title="Not migrated yet" lead="Parts of the app still on the older styles. These are next.">
          <ul className="ds-list">{NOT_YET.map((n) => <li key={n}>{n}</li>)}</ul>
        </Section>
      </main>
    </div>
  );
}
