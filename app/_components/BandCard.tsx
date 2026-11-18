import { type Band, when } from "../_lib/schedule";

/* A fixed part of the day, the same for everyone: registration, coffee, lunch, the
   after-party. Not pickable, so no + and a quieter surface than a talk card. Just the
   title and time: a band's extra details (the after-party's venue, "pizza and beer")
   come from nidevconf.com's schedule but aren't shown here. */
export default function BandCard({ band: b }: { band: Band }) {
  return (
    <li className="ag-item ag-band">
      <p className="ag-title">
        {b.title}
        {b.track && ` · ${b.track}`}
      </p>
      <p className="ag-when">
        {when(b)}
      </p>
    </li>
  );
}
