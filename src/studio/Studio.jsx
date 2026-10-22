import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Download, Plus, Trash2, Upload } from "lucide-react";
import { useContent } from "../content/ContentContext";
import { useToast } from "../components/Toast";
import { useLocal } from "../lib/storage";
import { photoSrc } from "../lib/photo";
import "./Studio.css";

// Sravan's workshop. Dev server only — App.jsx doesn't include it in a build.
// Edits here are saved in this browser; "Export" writes overrides.json, which
// is what actually ships.

const TABS = ["Timeline", "Letter", "Notes", "Promises", "Private reflection", "Export / Import"];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function compressImage(file, max = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function move(list, i, d) {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Text({ label, value, onChange, area, rows, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      {area ? (
        <textarea className="input studio-area" rows={rows || 4} value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="input" value={value || ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="studio-check">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} /> {label}
    </label>
  );
}

function PhotoPicker({ onAdd, say }) {
  const ref = useRef(null);
  const [name, setName] = useState("");
  const upload = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      onAdd(await compressImage(f));
      say("Photo added (compressed)");
    } catch {
      say("Ee photo open avvaledhu — JPG/PNG try chey");
    }
  };
  return (
    <div className="row">
      <button className="btn soft" type="button" onClick={() => ref.current?.click()}>
        <Upload size={14} /> Upload photo
      </button>
      <input ref={ref} type="file" accept="image/*" hidden onChange={upload} />
      <span className="small">or file in public/photos:</span>
      <input className="input" style={{ width: 160 }} value={name} placeholder="Chennai1.jpg" onChange={(e) => setName(e.target.value)} />
      <button className="btn ghost" type="button" disabled={!name.trim()} onClick={() => { onAdd(name.trim()); setName(""); }}>
        Add
      </button>
    </div>
  );
}

function ListTools({ i, len, onMove, onDelete }) {
  return (
    <div className="row studio-tools">
      <button className="btn ghost" disabled={i === 0} onClick={() => onMove(-1)} aria-label="Move up"><ArrowUp size={15} /></button>
      <button className="btn ghost" disabled={i === len - 1} onClick={() => onMove(1)} aria-label="Move down"><ArrowDown size={15} /></button>
      <button className="btn ghost" onClick={() => window.confirm("Delete this?") && onDelete()} aria-label="Delete"><Trash2 size={15} /></button>
    </div>
  );
}

/* ---------------- timeline ---------------- */

function TimelineEditor({ say }) {
  const { story, saveSection } = useContent();
  const [open, setOpen] = useState(null);
  const save = (next) => saveSection("story", next);
  const patch = (i, p) => save(story.map((m, j) => (j === i ? { ...m, ...p } : m)));

  const add = () => {
    const m = { id: uid(), when: "", approx: true, title: "Kotha memory", tone: "old", body: "", photos: [] };
    save([...story, m]);
    setOpen(m.id);
  };

  return (
    <div>
      <p className="small">Order here = order on the site. Approx dates show as &ldquo;around …&rdquo;. Never guess a date.</p>
      {story.map((m, i) => (
        <div className="studio-item" key={m.id}>
          <button className="studio-item-head" onClick={() => setOpen(open === m.id ? null : m.id)} aria-expanded={open === m.id}>
            <span className="small">{m.approx ? "~" : ""}{m.when || "no date"}</span>
            <strong>{m.title}</strong>
          </button>
          {open === m.id && (
            <div className="studio-item-body">
              <div className="studio-2">
                <Text label="When" value={m.when} onChange={(v) => patch(i, { when: v })} placeholder="27 February 2024 / Inter years" />
                <label className="field">
                  <span>Tone</span>
                  <select className="input" value={m.tone || "old"} onChange={(e) => patch(i, { tone: e.target.value })}>
                    <option value="old">old — blush</option>
                    <option value="hard">hard — quiet</option>
                    <option value="now">now — warm</option>
                  </select>
                </label>
              </div>
              <div className="row">
                <Check label="Approximate date" checked={m.approx} onChange={(v) => patch(i, { approx: v })} />
                <Check label="Featured (bigger)" checked={m.featured} onChange={(v) => patch(i, { featured: v })} />
                <Check label="Still Claude's draft" checked={m.draft} onChange={(v) => patch(i, { draft: v })} />
              </div>
              <Text label="Title" value={m.title} onChange={(v) => patch(i, { title: v })} />
              <Text label="Memory (nee maatallo)" area rows={5} value={m.body} onChange={(v) => patch(i, { body: v })} />
              <Text label="Handwritten margin note (optional)" value={m.margin} onChange={(v) => patch(i, { margin: v })} />
              <Text label="Private reflection on this moment (never shown on the site)" area rows={2} value={m.reflection} onChange={(v) => patch(i, { reflection: v })} />

              <div className="field">
                <span>Photos</span>
                <div className="studio-photos">
                  {(m.photos || []).map((p, k) => (
                    <div className="studio-photo" key={k}>
                      <img src={photoSrc(p.src)} alt="" />
                      <input
                        className="input"
                        placeholder="caption"
                        value={p.caption || ""}
                        onChange={(e) => patch(i, { photos: m.photos.map((x, y) => (y === k ? { ...x, caption: e.target.value } : x)) })}
                      />
                      <button className="btn ghost" onClick={() => patch(i, { photos: m.photos.filter((_, y) => y !== k) })}>Remove</button>
                    </div>
                  ))}
                </div>
                <PhotoPicker say={say} onAdd={(src) => patch(i, { photos: [...(m.photos || []), { src, caption: "" }] })} />
              </div>
              <ListTools i={i} len={story.length} onMove={(d) => save(move(story, i, d))} onDelete={() => save(story.filter((_, j) => j !== i))} />
            </div>
          )}
        </div>
      ))}
      <button className="btn" onClick={add}><Plus size={15} /> Add memory</button>
    </div>
  );
}

/* ---------------- letter ---------------- */

function LetterEditor() {
  const { letter, saveSection } = useContent();
  const patch = (p) => saveSection("letter", { ...letter, ...p });
  return (
    <div>
      <p className="small">Read it out loud. If a line doesn&rsquo;t sound like you, change it. Blank line = new paragraph.</p>
      <Check label="Still Claude's draft" checked={letter.draft} onChange={(v) => patch({ draft: v })} />
      <Text label="Greeting" value={letter.greeting} onChange={(v) => patch({ greeting: v })} />
      <Text label="Letter" area rows={24} value={letter.body} onChange={(v) => patch({ body: v })} />
      <Text label="Closing line" value={letter.closing} onChange={(v) => patch({ closing: v })} />
      <Text label="Signature" value={letter.signature} onChange={(v) => patch({ signature: v })} />
    </div>
  );
}

/* ---------------- notes ---------------- */

function NotesEditor({ say }) {
  const { notes, noteCategories, saveSection } = useContent();
  const save = (next) => saveSection("notes", next);
  const patch = (i, p) => save(notes.map((n, j) => (j === i ? { ...n, ...p } : n)));
  return (
    <div>
      <p className="small">Specific beats pretty. Placeholders never show on the deployed site.</p>
      {notes.map((n, i) => (
        <div className="studio-item studio-item-body" key={n.id}>
          <div className="studio-2">
            <label className="field">
              <span>Category</span>
              <select className="input" value={n.category} onChange={(e) => patch(i, { category: e.target.value })}>
                {noteCategories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
            <div className="row" style={{ alignSelf: "end" }}>
              <Check label="Draft" checked={n.draft} onChange={(v) => patch(i, { draft: v })} />
              <Check label="Placeholder" checked={n.placeholder} onChange={(v) => patch(i, { placeholder: v })} />
            </div>
          </div>
          <Text label="Note" area rows={3} value={n.text} onChange={(v) => patch(i, { text: v })} />
          {n.photo ? (
            <div className="studio-photo">
              <img src={photoSrc(n.photo)} alt="" />
              <button className="btn ghost" onClick={() => patch(i, { photo: undefined })}>Remove photo</button>
            </div>
          ) : (
            <PhotoPicker say={say} onAdd={(src) => patch(i, { photo: src })} />
          )}
          <ListTools i={i} len={notes.length} onMove={(d) => save(move(notes, i, d))} onDelete={() => save(notes.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button className="btn" onClick={() => save([...notes, { id: uid(), category: noteCategories[0].id, text: "" }])}>
        <Plus size={15} /> Add note
      </button>
    </div>
  );
}

/* ---------------- promises ---------------- */

function PromisesEditor() {
  const { promises, saveSection } = useContent();
  const save = (next) => saveSection("promises", next);
  const patch = (i, p) => save(promises.map((x, j) => (j === i ? { ...x, ...p } : x)));
  return (
    <div>
      <p className="small">Before keeping one: could you do this on your worst work week? If not, make it smaller.</p>
      {promises.map((p, i) => (
        <div className="studio-item studio-item-body" key={p.id}>
          <div className="studio-2">
            <Text label="Rhythm" value={p.rhythm} onChange={(v) => patch(i, { rhythm: v })} />
            <Text label="Title" value={p.title} onChange={(v) => patch(i, { title: v })} />
          </div>
          <Check label="Draft" checked={p.draft} onChange={(v) => patch(i, { draft: v })} />
          <Text label="What I'll do" area rows={3} value={p.what} onChange={(v) => patch(i, { what: v })} />
          <Text label="If I miss it" area rows={2} value={p.ifMissed} onChange={(v) => patch(i, { ifMissed: v })} />
          <ListTools i={i} len={promises.length} onMove={(d) => save(move(promises, i, d))} onDelete={() => save(promises.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button className="btn" onClick={() => save([...promises, { id: uid(), rhythm: "", title: "", what: "", ifMissed: "" }])}>
        <Plus size={15} /> Add promise
      </button>
    </div>
  );
}

/* ---------------- private reflection ---------------- */

const REFLECT = [
  "Em jarigindhi?",
  "Naaku em anipinchindhi?",
  "Vyshu ki em anipinchi undochu?",
  "Naaku telisindhi enti, nenu just assume chesthunnadhi enti?",
  "Naa control lo unnadhi enti?",
  "Next time em vere laaga chestha?",
  "Nenu cheyyalanukune promise nijam ga cheyagalana?",
  "Nenu em communicate cheyyali?",
  "Ee roju nenu baaga chesindhi enti?",
];

function download(name, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Reflection() {
  // "private:" keys are excluded from her data export and from content export.
  const [entries, setEntries] = useLocal("private:reflections", []);
  const [draft, setDraft] = useState({});
  const save = () => {
    if (!Object.values(draft).some((v) => v?.trim())) return;
    setEntries([{ id: uid(), at: new Date().toISOString(), answers: draft }, ...entries]);
    setDraft({});
  };
  return (
    <div>
      <div className="studio-private">
        Private. Saved only in this browser on this computer. Not in the content export, not in the build,
        never on the site. Not encrypted — anyone using this computer&rsquo;s browser profile could read it.
      </div>
      {REFLECT.map((q, i) => (
        <Text key={q} label={q} area rows={2} value={draft[i]} onChange={(v) => setDraft({ ...draft, [i]: v })} />
      ))}
      <div className="row">
        <button className="btn" onClick={save}>Save reflection</button>
        <button className="btn soft" onClick={() => download(`private-reflections-${new Date().toISOString().slice(0, 10)}.json`, entries)} disabled={!entries.length}>
          <Download size={14} /> Backup (private file)
        </button>
      </div>
      {entries.map((e) => (
        <details className="studio-item" key={e.id}>
          <summary className="studio-item-head">
            <strong>{new Date(e.at).toLocaleString("en-IN")}</strong>
          </summary>
          <div className="studio-item-body">
            {REFLECT.map((q, i) => e.answers[i]?.trim() && (
              <p key={i}><span className="small">{q}</span><br />{e.answers[i]}</p>
            ))}
            <button className="btn ghost" onClick={() => window.confirm("Delete this reflection?") && setEntries(entries.filter((x) => x.id !== e.id))}>
              Delete
            </button>
          </div>
        </details>
      ))}
    </div>
  );
}

/* ---------------- export / import ---------------- */

function ExportImport({ say }) {
  const { story, letter, notes, promises, replaceAll, resetStudio } = useContent();
  const ref = useRef(null);

  const exportContent = () => {
    // strip private per-moment reflections before anything leaves the Studio
    const clean = story.map(({ reflection, ...m }) => m);
    download("overrides.json", { story: clean, letter, notes, promises });
  };

  const size = new Blob([JSON.stringify({ story, notes })]).size;

  const importContent = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data.story && !data.letter && !data.notes && !data.promises) throw new Error("no sections");
      if (window.confirm("Replace current Studio edits with this file?")) {
        replaceAll(data);
        say("Imported");
      }
    } catch {
      say("That isn't a Back to Us content file");
    }
  };

  return (
    <div>
      <ol className="studio-steps">
        <li>Edit in the other tabs (auto-saved in this browser).</li>
        <li><strong>Export</strong> → save the file as <code>src/content/overrides.json</code> (replace the old one).</li>
        <li><code>npm run build</code> then <code>npm run deploy</code>.</li>
      </ol>
      <p className="small">Content size with photos: ~{Math.round(size / 1024)} KB{size > 4e6 ? " — getting heavy; put big photos in public/photos instead of uploading." : ""}</p>
      <div className="row">
        <button className="btn" onClick={exportContent}><Download size={14} /> Export overrides.json</button>
        <button className="btn soft" onClick={() => ref.current?.click()}><Upload size={14} /> Import</button>
        <input ref={ref} type="file" accept=".json,application/json" hidden onChange={importContent} />
        <button
          className="btn ghost"
          onClick={() => window.confirm("Throw away all Studio edits in this browser and go back to the files? (Private reflections are kept.)") && (resetStudio(), say("Studio reset"))}
        >
          Reset Studio edits
        </button>
      </div>
    </div>
  );
}

export default function Studio() {
  const [tab, setTab] = useLocal("studio:tab", TABS[0]);
  const [toast, say] = useToast();
  return (
    <div className="column studio">
      <header className="chapter-head">
        <div className="chapter-no">Sravan only</div>
        <h1 className="chapter-title">Studio</h1>
        <p className="chapter-sub">
          Only on <code>npm run dev</code>. Changes show on the site instantly here; she sees them only after you export and deploy.
        </p>
      </header>
      <div className="chips" role="tablist" style={{ margin: "12px 0 20px" }}>
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className="chip" onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <section className="paper">
        {tab === "Timeline" && <TimelineEditor say={say} />}
        {tab === "Letter" && <LetterEditor />}
        {tab === "Notes" && <NotesEditor say={say} />}
        {tab === "Promises" && <PromisesEditor />}
        {tab === "Private reflection" && <Reflection />}
        {tab === "Export / Import" && <ExportImport say={say} />}
      </section>
      {toast}
    </div>
  );
}
