import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ChapterHead, FiveMore } from "../components/Chapter";
import SendToSravan from "../components/SendToSravan";
import { whatsappLink } from "../lib/whatsapp";
import { useLocal } from "../lib/storage";
import "./Next.css";

const ACTIVITIES = [
  "Beach", "Bayata food", "Photos", "Movie", "Room lo relax",
  "Walk", "Shopping", "Nee college side", "Just maatladukovadam",
];

// Learned from the trip that went wrong — things to settle before, not on the day.
const BEFORE = [
  "Bayaludhere time confirm — leave dorakadha leda ani mundhe telusukovali",
  "Ekkada kalavali — exact ga (platform / exit / gate)",
  "Return time iddaram mundhe agree — akkada godava vaddu",
  "Edhaina delay ayithe ventane message, guess cheyyakunda",
  "Entha time untundho nijam ga cheppukovali",
  "Plan B — train miss ayithe em cheddham",
];

const EMPTY_VISIT = {
  from: "", to: "", arrive: "", meet: "", leave: "", budget: "",
  activities: [], privateTime: false, planB: "", notes: "",
};

function visitText(v, checked) {
  const lines = ["Chennai visit plan:"];
  if (v.from) lines.push(`Dates: ${v.from}${v.to ? ` to ${v.to}` : ""}`);
  if (v.arrive) lines.push(`Reach ayye time: ${v.arrive}`);
  if (v.meet) lines.push(`Kalise chota: ${v.meet}`);
  if (v.leave) lines.push(`Return time: ${v.leave}`);
  if (v.budget) lines.push(`Budget: ${v.budget}`);
  if (v.activities.length) lines.push(`Cheyyalanukunnavi: ${v.activities.join(", ")}`);
  if (v.privateTime) lines.push("Konchem iddarame time kuda — iddariki ishtamaithe.");
  if (v.planB) lines.push(`Plan B: ${v.planB}`);
  if (v.notes) lines.push(`Notes: ${v.notes}`);
  const open = BEFORE.filter((_, i) => !checked[i]);
  if (open.length) lines.push(`\nInka matladukovalsinavi:\n- ${open.join("\n- ")}`);
  return lines.join("\n");
}

function VisitPlanner() {
  const [v, setV] = useLocal("next:visit", EMPTY_VISIT);
  const [checked, setChecked] = useLocal("next:before", {});
  const set = (patch) => setV({ ...v, ...patch });
  const toggleAct = (a) =>
    set({ activities: v.activities.includes(a) ? v.activities.filter((x) => x !== a) : [...v.activities, a] });

  return (
    <section className="paper" aria-labelledby="visit-h">
      <h3 id="visit-h">Next Chennai visit</h3>
      <p className="small">
        Rendu nelalaki okasari raavalani naa goal — promise kaadhu. Work, budget, nee time chusi iddaram decide cheddham.
      </p>

      <div className="visit-grid">
        <label className="field"><span>Nunchi</span>
          <input className="input" type="date" value={v.from} onChange={(e) => set({ from: e.target.value })} />
        </label>
        <label className="field"><span>Varaku</span>
          <input className="input" type="date" value={v.to} min={v.from} onChange={(e) => set({ to: e.target.value })} />
        </label>
        <label className="field"><span>Reach ayye time</span>
          <input className="input" type="time" value={v.arrive} onChange={(e) => set({ arrive: e.target.value })} />
        </label>
        <label className="field"><span>Return time (mundhe agree)</span>
          <input className="input" type="time" value={v.leave} onChange={(e) => set({ leave: e.target.value })} />
        </label>
      </div>
      <label className="field"><span>Ekkada kalavali — exact ga</span>
        <input className="input" value={v.meet} onChange={(e) => set({ meet: e.target.value })} placeholder="station, platform no., exit…" />
      </label>
      <label className="field"><span>Budget</span>
        <input className="input" value={v.budget} onChange={(e) => set({ budget: e.target.value })} placeholder="travel, stay, food" />
      </label>

      <div className="field">
        <span>Em cheddham?</span>
        <div className="chips">
          {ACTIVITIES.map((a) => (
            <button key={a} className="chip" aria-pressed={v.activities.includes(a)} onClick={() => toggleAct(a)}>{a}</button>
          ))}
        </div>
      </div>

      <label className="check">
        <input type="checkbox" checked={v.privateTime} onChange={(e) => set({ privateTime: e.target.checked })} />
        <span>Konchem iddarame, prashantham ga unde time kuda kavali — iddariki ishtamaithe matrame.</span>
      </label>

      <label className="field"><span>Plan B</span>
        <textarea className="textarea" rows={2} value={v.planB} onChange={(e) => set({ planB: e.target.value })} />
      </label>
      <label className="field"><span>Inka edhaina</span>
        <textarea className="textarea" rows={2} value={v.notes} onChange={(e) => set({ notes: e.target.value })} />
      </label>

      <div className="before">
        <div className="hand">mundhe maatladukovalsinavi</div>
        {BEFORE.map((b, i) => (
          <label className="check" key={b}>
            <input type="checkbox" checked={!!checked[i]} onChange={(e) => setChecked({ ...checked, [i]: e.target.checked })} />
            <span>{b}</span>
          </label>
        ))}
      </div>

      <div className="row" style={{ marginTop: 14 }}>
        <SendToSravan text={visitText(v, checked)} label="Plan Sravan ki pampu" />
        <button className="btn ghost" onClick={() => window.confirm("Plan clear cheyyala?") && (setV(EMPTY_VISIT), setChecked({}))}>
          Clear
        </button>
      </div>
    </section>
  );
}

function Wishlist() {
  const [list, setList] = useLocal("next:wishlist", []);
  const [text, setText] = useState("");
  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setList([...list, { id: Date.now().toString(36), text: text.trim() }]);
    setText("");
  };
  return (
    <section className="paper" style={{ marginTop: 18 }}>
      <h3>Kalisi cheyyalanukunnavi</h3>
      <p className="small">Chinnavi, peddavi — eppudaina.</p>
      <form className="row" onSubmit={add}>
        <input className="input" style={{ flex: 1 }} value={text} onChange={(e) => setText(e.target.value)} aria-label="Something to do together" placeholder="oka roju…" />
        <button className="btn soft" type="submit">Add</button>
      </form>
      {list.length === 0 ? (
        <p className="small" style={{ fontStyle: "italic" }}>Inka emi levu.</p>
      ) : (
        <ul className="wish">
          {list.map((w) => (
            <li key={w.id}>
              <span className="hand">{w.text}</span>
              <button className="btn ghost" aria-label={`Remove ${w.text}`} onClick={() => setList(list.filter((x) => x.id !== w.id))}>
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {list.length > 0 && (
        <SendToSravan text={`Mana list:\n- ${list.map((w) => w.text).join("\n- ")}`} label="List Sravan ki pampu" />
      )}
    </section>
  );
}

export default function Next() {
  return (
    <div className="column">
      <ChapterHead path="/next" sub="Repu ela undalo — iddaram kalisi, iddariki ishtamaithe." />
      <VisitPlanner />
      <Wishlist />

      <section className="closing">
        <p>
          Deadline ledhu, Bujjamma. Ee site lo edhi kuda nuvvu em cheyyalo cheppadaniki kaadhu.
          Nuvvu em decide chesina, nenu respect chestha.
        </p>
        <p>
          Nenu chesedhi okkate — cheppindhi cheyyadam. Roju roju. Nuvvu chudu, nee time lo.
        </p>
        <p className="hand sign">— Sravan</p>
        <a className="btn" href={whatsappLink("Inka five minutes maatladadama? 😌")} target="_blank" rel="noopener noreferrer">
          Inka five minutes? 😌
        </a>
      </section>

      <FiveMore path="/next" />
    </div>
  );
}
