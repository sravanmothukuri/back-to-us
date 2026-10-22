import { useState } from "react";
import { ChapterHead, FiveMore } from "../components/Chapter";
import SendToSravan from "../components/SendToSravan";
import HerPromises from "../components/HerPromises";
import { useContent } from "../content/ContentContext";
import { useLocal } from "../lib/storage";
import "./Promises.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const KINDS = {
  game: "Game",
  movie: "Movie",
  checkin: "Check-in",
  date: "Virtual date",
};

// Suggested starting week — every bit of it can be changed.
const DEFAULT_WEEK = DAYS.map((d) => ({
  day: d,
  call: "19:00",
  plans:
    d === "Tue" || d === "Thu" || d === "Sat" ? ["game"]
    : d === "Fri" ? ["movie"]
    : d === "Sun" ? ["checkin"]
    : [],
  note: "",
}));

function weekText(week) {
  return [
    "Mana week plan idhi:",
    ...week.map((w) => {
      const bits = [w.call ? `call ${w.call}` : "call — flexible"];
      w.plans.forEach((p) => bits.push(KINDS[p]));
      if (w.note) bits.push(w.note);
      return `${w.day}: ${bits.join(", ")}`;
    }),
  ].join("\n");
}

function WeekPlanner() {
  const [week, setWeek] = useLocal("promises:week", DEFAULT_WEEK);
  const update = (i, patch) => setWeek(week.map((w, j) => (j === i ? { ...w, ...patch } : w)));
  const toggle = (i, kind) => {
    const plans = week[i].plans.includes(kind)
      ? week[i].plans.filter((p) => p !== kind)
      : [...week[i].plans, kind];
    update(i, { plans });
  };

  return (
    <section className="paper week" aria-labelledby="week-h">
      <h3 id="week-h">Mana week</h3>
      <p className="small">
        Idhi oka suggestion matrame. Ye roju ye time kudhurutundho iddaram kalisi maarchukundham.
        Miss ayina rojulu ikkada &ldquo;fail&rdquo; ani kanapadavu — avi just maaruthayi.
      </p>
      <div className="week-grid">
        {week.map((w, i) => (
          <div className="day" key={w.day}>
            <div className="day-name hand">{w.day}</div>
            <label className="day-call">
              <span className="sr-only">{w.day} call time</span>
              <input
                type="time"
                className="input"
                value={w.call}
                onChange={(e) => update(i, { call: e.target.value })}
              />
            </label>
            <div className="chips">
              {Object.entries(KINDS).map(([k, label]) => (
                <button
                  key={k}
                  className="chip"
                  aria-pressed={w.plans.includes(k)}
                  onClick={() => toggle(i, k)}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              className="input day-note"
              placeholder="note…"
              aria-label={`${w.day} note`}
              value={w.note}
              onChange={(e) => update(i, { note: e.target.value })}
            />
          </div>
        ))}
      </div>
      <div className="row" style={{ marginTop: 14 }}>
        <SendToSravan text={weekText(week)} label="Ee plan Sravan ki pampu" />
        <button
          className="btn ghost"
          onClick={() => window.confirm("Suggested week ki reset cheyyala?") && setWeek(DEFAULT_WEEK)}
        >
          Reset
        </button>
      </div>
    </section>
  );
}

export default function Promises() {
  const { promises } = useContent();
  const [change, setChange] = useState("");

  return (
    <div className="column">
      <ChapterHead path="/promises">
        <p className="lead">
          &ldquo;Repatinunchi maaripotha&rdquo; ani inka cheppanu. Ivi chinna vishayalu — prathi roju
          cheyagaligevi. Okavela miss ayithe em chestano kuda raasanu.
        </p>
      </ChapterHead>

      <div className="promise-list">
        {promises.map((p, i) => (
          <article className="promise" key={p.id} style={{ "--tilt": `${i % 2 ? 0.5 : -0.5}deg` }}>
            <div className="rhythm hand">{p.rhythm}</div>
            <h3>{p.title}</h3>
            <p>{p.what}</p>
            <p className="if-missed">
              <span>Miss ayithe:</span> {p.ifMissed}
            </p>
          </article>
        ))}
      </div>

      <p className="margin-note" style={{ margin: "28px 0" }}>
        idhi naa okkadi plan kaadhu — nuvvu kuda maarchochu.
      </p>

      <HerPromises />

      <div style={{ height: 32 }} />
      <WeekPlanner />

      <section className="paper" style={{ marginTop: 18 }}>
        <h3>Edhaina maarchala?</h3>
        <p className="small">Edhaina ekkuva anipisthe, thakkuva anipisthe, leda neeku vere edhaina kavali ante.</p>
        <textarea
          className="textarea"
          value={change}
          onChange={(e) => setChange(e.target.value)}
          aria-label="What would you change"
        />
        <SendToSravan text={change && `Mana plan lo idhi maarchali anipisthundhi:\n${change}`} />
      </section>

      <FiveMore path="/promises" />
    </div>
  );
}
