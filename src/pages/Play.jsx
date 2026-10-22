import { useMemo, useState } from "react";
import { Clock, Plus, Trash2 } from "lucide-react";
import { ChapterHead, FiveMore } from "../components/Chapter";
import Polaroid from "../components/Polaroid";
import SendToSravan from "../components/SendToSravan";
import { months } from "../content/story";
import { dates, prompts, twentyQuestionsIdeas, wouldYouRather } from "../content/play";
import { useLocal } from "../lib/storage";
import "./Play.css";

const TABS = [
  { id: "wyr", label: "Would you rather" },
  { id: "twenty", label: "20 Questions" },
  { id: "month", label: "Ee photo ye nela?" },
  { id: "movie", label: "Movie night" },
  { id: "talk", label: "Maatalu" },
  { id: "dates", label: "Virtual dates" },
];

const rand = (n) => Math.floor(Math.random() * n);

/* ---------------- would you rather ---------------- */

function WouldYouRather() {
  const [i, setI] = useState(() => rand(wouldYouRather.length));
  const [pick, setPick] = useState(null);
  const [a, b] = wouldYouRather[i];
  const next = () => {
    setI((i + 1) % wouldYouRather.length);
    setPick(null);
  };
  return (
    <div className="game">
      <p className="small">Call lo unnappudu okaru adugu, iddaram answer cheppali. Endhuku ani kuda 😌</p>
      <div className="wyr">
        {[a, b].map((opt) => (
          <button key={opt} className="wyr-opt" aria-pressed={pick === opt} onClick={() => setPick(opt)}>
            {opt}
          </button>
        ))}
        <span className="wyr-or hand" aria-hidden>leda</span>
      </div>
      <div className="row" style={{ justifyContent: "center", marginTop: 16 }}>
        <button className="btn soft" onClick={next}>Next question</button>
        {pick && (
          <SendToSravan
            text={`Would you rather: ${a} leda ${b}?\nNaa answer: ${pick}. Nee answer enti?`}
            label="Sravan ni adugu"
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- 20 questions ---------------- */

function TwentyQuestions() {
  const [log, setLog] = useState([]);
  const [q, setQ] = useState("");
  const [done, setDone] = useState(null);
  const left = 20 - log.length;

  const answer = (a) => {
    setLog([...log, { q: q.trim() || `Question ${log.length + 1}`, a }]);
    setQ("");
    if (log.length + 1 >= 20) setDone("out");
  };
  const reset = () => {
    setLog([]);
    setDone(null);
    setQ("");
  };

  return (
    <div className="game">
      <p className="small">
        Okaru edhaina manasulo anukovali — iddaram call lo. Inkokaru yes/no questions tho guess cheyyali.
        Ideas: {twentyQuestionsIdeas.join(" · ")}
      </p>
      <div className="twenty-count" aria-live="polite">
        <span className="big">{left}</span> questions migilayi
      </div>
      {!done ? (
        <>
          <label className="field">
            <span>Question (optional — gurthu kosam)</span>
            <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Adhi tinagalama?" />
          </label>
          <div className="row">
            <button className="btn" onClick={() => answer("Yes")}>Yes</button>
            <button className="btn" onClick={() => answer("No")}>No</button>
            <button className="btn soft" onClick={() => answer("Maybe")}>Konchem</button>
            <button className="btn ghost" onClick={() => setDone("won")}>Guess correct! 🎉</button>
          </div>
        </>
      ) : (
        <p className="hand result">
          {done === "won"
            ? `${log.length} questions lo kanipettesav! 😌`
            : "20 ayipoyayi — answer cheppeyyi, edhi?"}
        </p>
      )}
      {log.length > 0 && (
        <ol className="twenty-log">
          {log.map((l, i) => (
            <li key={i}>
              {l.q} — <strong>{l.a}</strong>
            </li>
          ))}
        </ol>
      )}
      <button className="btn ghost" onClick={reset}>Kotha game</button>
    </div>
  );
}

/* ---------------- guess the month ---------------- */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRound() {
  const answer = months[rand(months.length)];
  const others = shuffle(months.filter((m) => m !== answer)).slice(0, 3);
  return { answer, options: shuffle([answer, ...others]) };
}

function GuessMonth() {
  const [round, setRound] = useState(makeRound);
  const [guess, setGuess] = useState(null);
  const right = guess === round.answer;
  return (
    <div className="game">
      <p className="small">Nee birthday card lo unna photos. Ye nela photo idhi? Gurthu unda?</p>
      <div style={{ display: "grid", placeItems: "center", margin: "20px 0" }}>
        <Polaroid
          src={round.answer.src}
          alt="Mana photo — guess the month"
          caption={guess ? round.answer.label : "?"}
          index={round.answer.label.length}
          style={{ maxWidth: 240 }}
        />
      </div>
      <div className="month-options">
        {round.options.map((o) => (
          <button
            key={o.label}
            className={`chip${guess && o === round.answer ? " right" : ""}${guess === o && !right ? " wrong" : ""}`}
            onClick={() => !guess && setGuess(o)}
            disabled={!!guess && guess !== o && o !== round.answer}
          >
            {o.label}
          </button>
        ))}
      </div>
      {guess && (
        <p className="hand result" aria-live="polite">
          {right ? "Correct! Nee memory super 😌" : `Kaadhu — idhi ${round.answer.label}. Aa nela em jarigindho gurthunda?`}
        </p>
      )}
      <button className="btn soft" onClick={() => { setRound(makeRound()); setGuess(null); }}>
        Inkokati
      </button>
    </div>
  );
}

/* ---------------- movie night ---------------- */

const AFTER_MOVIE = [
  "Neeku ekkuva nachina scene?",
  "Aa characters lo manam kanapaddama?",
  "Ending maarchagaligithe, ela maarchedhanivi?",
  "10 lo entha?",
];

function MovieNight() {
  const [list, setList] = useLocal("play:movies", []);
  const [turn, setTurn] = useLocal("play:movie-turn", "Vyshu");
  const [title, setTitle] = useState("");
  const [by, setBy] = useState("Vyshu");
  const [tonight, setTonight] = useState(null);

  const add = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setList([...list, { id: Date.now().toString(36), title: title.trim(), by, watched: false, review: "" }]);
    setTitle("");
  };
  const update = (id, patch) => setList(list.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const remove = (id) => setList(list.filter((m) => m.id !== id));

  const unwatched = list.filter((m) => !m.watched);
  const pickTonight = () => {
    const theirs = unwatched.filter((m) => m.by === turn);
    const pool = theirs.length ? theirs : unwatched;
    if (pool.length) setTonight(pool[rand(pool.length)].id);
  };
  const tonightMovie = list.find((m) => m.id === tonight);
  const markWatched = (m) => {
    update(m.id, { watched: true });
    setTurn(turn === "Vyshu" ? "Sravan" : "Vyshu");
    setTonight(null);
  };

  return (
    <div className="game">
      <p className="small">
        Mana watchlist. Okasari nuvvu choose chey, okasari nenu. Ee saari turn:{" "}
        <strong className="hand" style={{ fontSize: "1.1rem" }}>{turn === "Vyshu" ? "needhi, Bujjamma" : "Sravan dhi"}</strong>
        <button className="btn ghost" onClick={() => setTurn(turn === "Vyshu" ? "Sravan" : "Vyshu")}>maarchu</button>
      </p>

      <form className="row" onSubmit={add} style={{ margin: "12px 0" }}>
        <input
          className="input"
          style={{ flex: "1 1 180px" }}
          placeholder="Movie peru"
          aria-label="Movie name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select className="input" style={{ flex: "0 0 auto", width: "auto" }} value={by} onChange={(e) => setBy(e.target.value)} aria-label="Whose suggestion">
          <option value="Vyshu">nee suggestion</option>
          <option value="Sravan">Sravan dhi</option>
        </select>
        <button className="btn" type="submit"><Plus size={16} aria-hidden /> Add</button>
      </form>

      {list.length === 0 ? (
        <p className="empty">Inka em movies levu. Okati add chey — first pick neeke.</p>
      ) : (
        <>
          <div className="row">
            <button className="btn soft" onClick={pickTonight} disabled={!unwatched.length}>
              Ee roju edhi? 🎬
            </button>
          </div>
          {tonightMovie && (
            <div className="tonight paper">
              <span className="small">Ee roju</span>
              <h3>{tonightMovie.title}</h3>
              <div className="row">
                <SendToSravan text={`Movie night? Ee roju: ${tonightMovie.title} 🎬 Ye time ki?`} label="Sravan ki cheppu" />
                <button className="btn ghost" onClick={() => markWatched(tonightMovie)}>Chusesam ✓</button>
              </div>
            </div>
          )}
          <ul className="movie-list">
            {list.map((m) => (
              <li key={m.id} className={m.watched ? "watched" : ""}>
                <div className="movie-top">
                  <span>{m.title}</span>
                  <span className="small">{m.by === "Vyshu" ? "nee pick" : "Sravan pick"}</span>
                  {!m.watched && (
                    <button className="btn ghost" onClick={() => markWatched(m)} aria-label={`Mark ${m.title} watched`}>✓</button>
                  )}
                  <button className="btn ghost" onClick={() => remove(m.id)} aria-label={`Remove ${m.title}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
                {m.watched && (
                  <input
                    className="input"
                    placeholder="okka line lo — ela undhi?"
                    aria-label={`Review of ${m.title}`}
                    value={m.review}
                    onChange={(e) => update(m.id, { review: e.target.value })}
                  />
                )}
              </li>
            ))}
          </ul>
          <details className="after-movie">
            <summary>Movie ayyaka maatladukodaniki</summary>
            <ul>{AFTER_MOVIE.map((q) => <li key={q}>{q}</li>)}</ul>
          </details>
        </>
      )}
    </div>
  );
}

/* ---------------- conversation prompts ---------------- */

const TALK = [
  { id: "deep", label: "Lothu ga" },
  { id: "playful", label: "Sardaga" },
  { id: "romantic", label: "Romantic" },
];

function Talk() {
  const [kind, setKind] = useState("deep");
  const [closerOpen, setCloserOpen] = useState(false);
  const list = prompts[kind];
  const [i, setI] = useState(0);
  const q = list[i % list.length];

  return (
    <div className="game">
      <div className="chips" role="group" aria-label="Type of question">
        {TALK.map((t) => (
          <button key={t.id} className="chip" aria-pressed={kind === t.id} onClick={() => { setKind(t.id); setI(0); }}>
            {t.label}
          </button>
        ))}
      </div>
      <p className="talk-q">{q}</p>
      <div className="row">
        <button className="btn soft" onClick={() => setI(i + 1)}>Next</button>
        <SendToSravan text={q} label="Ee question Sravan ki" />
      </div>

      <div className="closer">
        {!closerOpen ? (
          <>
            <p className="small">
              Inka konni questions unnayi — konchem personal, touch gurinchi, boundaries gurinchi.
              Iddariki comfortable ga unnappudu matrame. Eppudaina &ldquo;vaddu&rdquo; anochu.
            </p>
            <button className="btn ghost" onClick={() => setCloserOpen(true)}>Open cheyyi</button>
          </>
        ) : (
          <>
            <ul>{prompts.closer.map((c) => <li key={c}>{c}</li>)}</ul>
            <button className="btn ghost" onClick={() => setCloserOpen(false)}>Moseyyi</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- virtual dates ---------------- */

function DateCard({ d }) {
  const [when, setWhen] = useState("");
  const pretty = when
    ? new Date(when).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
    : "";
  return (
    <article className="paper date-card">
      <h3>{d.title}</h3>
      <span className="small"><Clock size={13} aria-hidden /> ~{d.mins} min</span>
      <p>{d.text}</p>
      <label className="field">
        <span>Eppudu? (optional)</span>
        <input className="input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
      </label>
      <SendToSravan
        text={`Ee date cheddama? ${d.title}${pretty ? ` — ${pretty}` : ""} 😌`}
        label={pretty ? "Sravan ki invite" : "Sravan ki suggest chey"}
      />
    </article>
  );
}

/* ---------------- page ---------------- */

export default function Play() {
  const [tab, setTab] = useLocal("play:tab", "wyr");
  const current = useMemo(() => TABS.find((t) => t.id === tab) || TABS[0], [tab]);

  const onKey = (e) => {
    const i = TABS.findIndex((t) => t.id === current.id);
    if (e.key === "ArrowRight") setTab(TABS[(i + 1) % TABS.length].id);
    if (e.key === "ArrowLeft") setTab(TABS[(i - 1 + TABS.length) % TABS.length].id);
  };

  return (
    <div className="column">
      <ChapterHead
        path="/play"
        sub="Vaaraniki 2–3 saarlu games, 1–2 saarlu movie — kani mood batti. Idhi homework kaadhu."
      />
      <div className="tabs" role="tablist" aria-label="Games" onKeyDown={onKey}>
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={current.id === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={current.id === t.id ? 0 : -1}
            className="tab"
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <section className="paper play-panel" role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
        {current.id === "wyr" && <WouldYouRather />}
        {current.id === "twenty" && <TwentyQuestions />}
        {current.id === "month" && <GuessMonth />}
        {current.id === "movie" && <MovieNight />}
        {current.id === "talk" && <Talk />}
        {current.id === "dates" && (
          <div className="dates">
            {dates.map((d) => <DateCard key={d.id} d={d} />)}
          </div>
        )}
      </section>
      <FiveMore path="/play" />
    </div>
  );
}
