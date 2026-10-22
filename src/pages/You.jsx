import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { ChapterHead, FiveMore } from "../components/Chapter";
import SendToSravan from "../components/SendToSravan";
import { useToast } from "../components/Toast";
import { checkinQuestions } from "../content/play";
import { allLocalKeys, useLocal } from "../lib/storage";
import "./You.css";

const NEEDS = [
  "Ekkuva maatalu",
  "Quality time",
  "Compliments",
  "Flirting 😌",
  "Games, movies",
  "Lothaina maatalu",
  "Kalisinappudu iddarame time",
  "Konchem space",
  "Nannu adagakunda call",
];

function weekKey(d = new Date()) {
  // Monday of this week, e.g. "2026-10-19"
  const m = new Date(d);
  m.setHours(0, 0, 0, 0);
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m.toISOString().slice(0, 10);
}

function Needs() {
  const [picked, setPicked] = useLocal("you:needs", []);
  const [text, setText] = useLocal("you:needs-text", "");
  const toggle = (n) => setPicked(picked.includes(n) ? picked.filter((p) => p !== n) : [...picked, n]);
  const message = [
    picked.length ? `Ippudu naaku kavalsindhi: ${picked.join(", ")}` : "",
    text.trim(),
  ].filter(Boolean).join("\n");

  return (
    <section className="paper">
      <h3>Ippudu neeku em kavali?</h3>
      <p className="small">Mundhu laaga undali ani kaadhu — ippudu, ee roju, neeku em kavalo.</p>
      <div className="chips" style={{ margin: "12px 0" }}>
        {NEEDS.map((n) => (
          <button key={n} className="chip" aria-pressed={picked.includes(n)} onClick={() => toggle(n)}>
            {n}
          </button>
        ))}
      </div>
      <textarea className="textarea" aria-label="Anything else you need" placeholder="nee maatallo…" value={text} onChange={(e) => setText(e.target.value)} />
      <SendToSravan text={message} />
    </section>
  );
}

function CheckIn() {
  const wk = weekKey();
  const [all, setAll] = useLocal("you:checkins", {});
  const answers = all[wk] || {};
  const set = (i, v) => setAll({ ...all, [wk]: { ...answers, [i]: v } });
  const answered = checkinQuestions
    .map((q, i) => (answers[i]?.trim() ? `${q}\n→ ${answers[i].trim()}` : null))
    .filter(Boolean);
  const pastWeeks = Object.keys(all).filter((k) => k !== wk && Object.values(all[k]).some((v) => v?.trim())).sort().reverse();

  return (
    <section className="paper" id="checkin">
      <h3>Ee week check-in</h3>
      <p className="small">
        Week of {new Date(wk).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}.
        Ye question ki answer ivvakapoyina parvaledhu — silence ni nenu &ldquo;no&rdquo; ani anukonu.
        Nenu kuda naa answers neeku pamputha.
      </p>
      {checkinQuestions.map((q, i) => (
        <label className="field" key={q}>
          <span>{q}</span>
          <textarea className="textarea" rows={2} value={answers[i] || ""} onChange={(e) => set(i, e.target.value)} />
        </label>
      ))}
      <SendToSravan
        text={answered.length ? `Ee week check-in:\n\n${answered.join("\n\n")}` : ""}
        label={answered.length ? `${answered.length} answers Sravan ki pampu` : "Sravan ki pampu"}
      />
      {pastWeeks.length > 0 && (
        <details className="past">
          <summary>Mundhu weeks ({pastWeeks.length})</summary>
          {pastWeeks.map((k) => (
            <div key={k} className="past-week">
              <div className="hand">{new Date(k).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              {checkinQuestions.map((q, i) =>
                all[k][i]?.trim() ? <p key={i}><span className="small">{q}</span><br />{all[k][i]}</p> : null
              )}
            </div>
          ))}
        </details>
      )}
    </section>
  );
}

function Boundaries() {
  const [text, setText] = useLocal("you:boundaries", "");
  return (
    <section className="paper">
      <h3>Nee boundaries</h3>
      <p className="small">
        Edhaina ippudu okay kaadhu, leda vaddu ani anipisthe — maatalu, touch, time, edhaina.
        Neeku explain cheyyalsina avasaram ledhu.
      </p>
      <textarea className="textarea" aria-label="Your boundaries" value={text} onChange={(e) => setText(e.target.value)} />
      <SendToSravan text={text && `Naa boundary:\n${text}`} />
    </section>
  );
}

function HerMemories() {
  const [list, setList] = useLocal("you:memories", []);
  const [params] = useSearchParams();
  const [title, setTitle] = useState(() => params.get("about") || "");
  const [text, setText] = useState("");
  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setList([{ id: Date.now().toString(36), title: title.trim(), text: text.trim() }, ...list]);
    setTitle("");
    setText("");
  };
  return (
    <section className="paper" id="her-version">
      <h3>Nee version of mana story</h3>
      <p className="small">Naaku gurthu lenidhi, leda nuvvu vere laaga gurthupettukunnadhi edhaina — raayi.</p>
      <form onSubmit={add}>
        <label className="field">
          <span>Edhi gurinchi?</span>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="aa roju…" />
        </label>
        <textarea className="textarea" aria-label="Your memory" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn soft" type="submit" disabled={!text.trim()}>Save</button>
      </form>
      {list.map((m) => (
        <div className="her-memory" key={m.id}>
          {m.title && <strong>{m.title}</strong>}
          <p className="hand">{m.text}</p>
          <div className="row">
            <SendToSravan text={`${m.title ? m.title + "\n" : ""}${m.text}`} />
            <button className="btn ghost" onClick={() => window.confirm("Delete cheyyala?") && setList(list.filter((x) => x.id !== m.id))}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

// Her own data: back up, move to another phone, or wipe.
const isHers = (k) => !k.includes("studio:") && !k.includes("private:");

function MyData() {
  const [toast, say] = useToast();
  const file = useRef(null);

  const exportData = () => {
    const data = {};
    allLocalKeys().filter(isHers).forEach((k) => {
      try { data[k] = JSON.parse(localStorage.getItem(k)); } catch { /* skip */ }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `back-to-us-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importData = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      const keys = Object.keys(data).filter((k) => k.startsWith("backtous:") && isHers(k));
      if (!keys.length) throw new Error("empty");
      if (!window.confirm(`${keys.length} items restore cheyyala? Ippudu unnavi replace avthayi.`)) return;
      keys.forEach((k) => localStorage.setItem(k, JSON.stringify(data[k])));
      window.location.reload();
    } catch {
      say("Ee file open avvaledhu — Back to Us backup file ena?");
    }
  };

  const clearData = () => {
    if (!window.confirm("Nuvvu ikkada raasinavi anni (check-ins, needs, movies, favourites, plans) ee phone nunchi delete avthayi. Sure na?")) return;
    allLocalKeys().filter(isHers).forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <section className="paper privacy" id="privacy">
      <h3>Nee data, nee control</h3>
      <ul>
        <li>Nuvvu ikkada raasevi <strong>ee phone/browser lo matrame</strong> save avthayi. Naaku automatic ga em raadhu.</li>
        <li>&ldquo;Sravan ki pampu&rdquo; nokkithe WhatsApp open avthundhi, message ready ga untundhi — nuvvu send nokkithe ne vasthundhi.</li>
        <li>Inkoka phone lo open chesthe idhi kanapadadhu. Browser data clear chesina, private/incognito tab lo unna — poyye chance undhi.</li>
        <li>Idhi password tho lock ayyindhi kaadhu, encrypt kuda kaadhu. Nee phone evaraina open chesthe chudagalaru.</li>
      </ul>
      <div className="row">
        <button className="btn soft" onClick={exportData}><Download size={15} aria-hidden /> Backup download</button>
        <button className="btn soft" onClick={() => file.current?.click()}><Upload size={15} aria-hidden /> Restore</button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={importData} />
        <button className="btn ghost" onClick={clearData}>Anni delete cheyyi</button>
      </div>
      {toast}
    </section>
  );
}

export default function You() {
  return (
    <div className="column">
      <ChapterHead path="/you">
        <p className="lead">
          Ee site lo ekkuva naa maatale unnayi. Idhi needhi. Edhi raayalanna, emi raayakapoyina — rendu okate.
          Nuvvu cheppalanukunnappudu matrame.
        </p>
      </ChapterHead>
      <div className="you-stack">
        <Link className="shortcut" to="/promises#her-h">
          <strong>Nee promises — nuvvu korukunte</strong>
          <span>Career, patience, respect… nachinavi matrame 🤙</span>
        </Link>
        <Needs />
        <CheckIn />
        <Boundaries />
        <HerMemories />
        <MyData />
      </div>
      <FiveMore path="/you" />
    </div>
  );
}
