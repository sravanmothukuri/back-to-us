import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import SendToSravan from "./SendToSravan";
import { herPromises } from "../content/herPromises";
import { useLocal } from "../lib/storage";
import "./HerPromises.css";

const today = () =>
  new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function Seal() {
  return (
    <span className="seal" aria-hidden>
      <span>V</span>
    </span>
  );
}

function PromiseCard({ p, state, onChange, onRemove }) {
  const cta = p.pinky ? "Pinky promise 🤙" : "Idhi naa promise 🤙";
  const [editing, setEditing] = useState(false);
  const text = state?.text ?? p.her;
  const chosen = !!state?.chosen;

  return (
    <article className={`her-card${chosen ? " chosen" : ""}${p.pinky ? " pinky" : ""}`}>
      <div className="her-head">
        <h4>{p.title}</h4>
        {p.both && <span className="both hand">iddaram</span>}
      </div>

      {editing ? (
        <textarea
          className="textarea"
          aria-label={`${p.title} in your words`}
          value={text}
          autoFocus
          onChange={(e) => onChange({ ...state, text: e.target.value })}
        />
      ) : (
        <p className="her-text">{text}</p>
      )}

      {p.me && (
        <p className="his-line">
          <span>naa vaipu nunchi —</span> {p.me}
        </p>
      )}

      {chosen ? (
        <div className="signed">
          <Seal />
          <div>
            <div className="hand sig">— Vyshu</div>
            <div className="small">{state.at}</div>
          </div>
          <button className="btn ghost" onClick={() => setEditing(!editing)}>
            <Pencil size={14} aria-hidden /> {editing ? "Ayyindhi" : "Maarchu"}
          </button>
          <button className="btn ghost" onClick={() => onChange({ ...state, chosen: false })}>
            Venakki teesko
          </button>
        </div>
      ) : (
        <div className="row">
          <button
            className="btn"
            disabled={!text.trim()}
            onClick={() => {
              setEditing(false);
              onChange({ ...state, chosen: true, text, at: today() });
            }}
          >
            {cta}
          </button>
          <button className="btn ghost" onClick={() => setEditing(!editing)}>
            {editing ? "Ayyindhi" : "Nee maatallo raayi"}
          </button>
          {onRemove && (
            <button className="btn ghost" onClick={() => window.confirm("Delete cheyyala?") && onRemove()}>
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default function HerPromises() {
  const [states, setStates] = useLocal("her-promises", {});
  const [own, setOwn] = useLocal("her-promises:own", []);
  const set = (id, s) => setStates({ ...states, [id]: s });

  const regular = herPromises.filter((p) => !p.pinky);
  const pinky = herPromises.find((p) => p.pinky);
  const all = [...herPromises, ...own];
  const chosen = all.filter((p) => states[p.id]?.chosen);
  const message = chosen.length
    ? `Naa promises 🤙\n\n${chosen.map((p) => `• ${p.title}: ${states[p.id].text}`).join("\n")}\n\n— Vyshu`
    : "";

  const addOwn = () => {
    const id = `own-${Date.now().toString(36)}`;
    setOwn([...own, { id, title: "Naa promise", her: "" }]);
    set(id, { text: "", chosen: false });
  };

  return (
    <section className="her-promises" aria-labelledby="her-h">
      <div className="her-intro">
        <div className="chapter-no">nee vaipu nunchi</div>
        <h2 id="her-h">Nee promises — nuvvu korukunte</h2>
        <p>
          Ivi nenu raasina suggestions matrame, Bujjamma. Promise cheyyalsina avasaram ledhu —
          nachinavi teesko, nee maatallo maarchu, vaddhanukunnavi vadilesey.
          Ivi naa kosam kaadhu. Nee kosam.
        </p>
      </div>

      <div className="her-grid">
        {[...regular, ...own].map((p) => (
          <PromiseCard
            key={p.id}
            p={p}
            state={states[p.id]}
            onChange={(s) => set(p.id, s)}
            onRemove={p.id.startsWith("own-") ? () => setOwn(own.filter((o) => o.id !== p.id)) : null}
          />
        ))}
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn soft" onClick={addOwn}>
          <Plus size={15} aria-hidden /> Naa own promise
        </button>
      </div>

      {pinky && (
        <div className="pinky-wrap" id="pinky">
          <div className="chapter-no">okka pinky promise</div>
          <h3 className="pinky-title">Mana iddari kosam</h3>
          <div className="why-note">
            {pinky.why.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            <p className="why-sign hand">— Sravan</p>
          </div>
          <PromiseCard p={pinky} state={states[pinky.id]} onChange={(s) => set(pinky.id, s)} />
        </div>
      )}

      <div className="row" style={{ marginTop: 20, justifyContent: "center" }}>
        {chosen.length > 0 && (
          <SendToSravan text={message} label={`${chosen.length} promise${chosen.length > 1 ? "s" : ""} Sravan ki pampu`} />
        )}
      </div>
    </section>
  );
}
