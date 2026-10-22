import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hearts from "../components/Hearts";
import Polaroid from "../components/Polaroid";
import { CHAPTERS } from "../chapters";
import { readLocal } from "../lib/storage";
import "./Home.css";

const RITUAL = [
  "Hi Nanna 😌",
  "Gurthunda? Nee birthday ki oka card chesa.",
  "Ee saari kuda neekosam okati chesa. Kani idhi birthday kosam kaadhu.",
  "Idhi mana gurinchi. Manchi rojulu, badha petina rojulu, ippudu.",
  "Nee time lo chudu. Inka five minutes istava?",
];

const SEEN_KEY = "backtous:ritual-seen";

function Ritual({ onDone }) {
  const [i, setI] = useState(0);
  const last = i === RITUAL.length - 1;
  const advance = () => (last ? onDone() : setI(i + 1));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const stop = (fn) => (e) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="ritual" onClick={advance}>
      <Hearts />
      <button className="btn ghost ritual-skip" onClick={stop(onDone)}>
        Skip
      </button>
      <div className="ritual-card" aria-live="polite">
        <div className="spark" aria-hidden>✨</div>
        <p key={i}>{RITUAL[i]}</p>
        {last ? (
          <div>
            <button className="btn" onClick={stop(onDone)}>Sare 😌</button>
          </div>
        ) : (
          <div className="ritual-dots" aria-hidden>
            {RITUAL.map((_, j) => <i key={j} className={j <= i ? "on" : ""} />)}
          </div>
        )}
      </div>
      {!last && <p className="ritual-hint">tap chey, leda Enter ✨</p>}
    </div>
  );
}

const MOMENTS = [
  { d: "~Jan 2021", t: "First maata" },
  { d: "Inter", t: "“Inka five minutes”" },
  { d: "27 Feb 2024", t: "First kiss" },
  { d: "~10 Mar 2024", t: "“If I propose…”" },
  { d: "~Aug 2024", t: "Chennai, rendu rojulu" },
  { d: "~Mar 2025", t: "Kashtamaina time", hard: true },
  { d: "Sep 2026", t: "Chavithi surprise" },
  { d: "Ippudu", t: "Malli modhalu" },
];

function seenThisSession() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

const shortDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default function Home() {
  const [showRitual, setShowRitual] = useState(() => !seenThisSession());
  const visit = readLocal("next:visit", null);

  const finish = () => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* fine — she'll just see the ritual again next time */
    }
    setShowRitual(false);
  };

  if (showRitual) return <Ritual onDone={finish} />;

  return (
    <div className="column">
      <section className="home-hero">
        <h1>Back to Us</h1>
        <p className="hand">Nanna — idhi neekosam.</p>
      </section>

      <div className="home-photo">
        <Polaroid src="vyshusravan.jpg" caption="manam ♡" index={1} />
      </div>

      <p className="home-intro">
        Manam okappudu maatalu aapaleni iddaru friends. Aa maatale ekkado love ayyindhi.
        Gurthupettukovalsina memories unnayi, ardham chesukovalsina badhalu unnayi.
        Ee chinna place — em jarigindho nijayithiga gurthupettukodaniki, naa thappulu
        oppukovadaniki, inka manam ela undalo iddaram kalisi decide cheyyadaniki.
      </p>

      <figure className="film">
        <figcaption className="hand">Neekosam oka chinna video — sound on chey 😌</figcaption>
        <video
          controls
          playsInline
          preload="none"
          poster={`${import.meta.env.BASE_URL}videos/mana-moments-poster.jpg`}
          src={`${import.meta.env.BASE_URL}videos/mana-moments.mp4`}
        >
          Ee phone lo video play avvatledhu.
        </video>
      </figure>

      <ol className="mini-line" aria-label="Mana timeline">
        {MOMENTS.map((m) => (
          <li key={m.d} className={m.hard ? "hard" : ""}>
            <div className="d">{m.d}</div>
            <div className="t">{m.t}</div>
          </li>
        ))}
      </ol>
      <Link className="btn" to="/story">Mana story chuddam</Link>

      {visit?.from && (
        <div className="next-up">
          <span className="small">Next anukunnadhi</span>
          <div className="hand" style={{ fontSize: "1.15rem" }}>
            Chennai visit — {shortDate(visit.from)}
            {visit.to ? ` to ${shortDate(visit.to)}` : ""}
          </div>
          <Link to="/next" className="small">plan chudu →</Link>
        </div>
      )}

      <div className="shortcuts">
        <Link className="shortcut" to="/play">
          <strong>Kalisi em cheddham?</strong>
          <span>Games, movie night, dates</span>
        </Link>
        <Link className="shortcut" to="/you">
          <strong>Nee manasulo unnadhi</strong>
          <span>Check-in, nee needs — only if you want</span>
        </Link>
        <Link className="shortcut" to="/next">
          <strong>Next visit</strong>
          <span>Chennai plan, iddaram kalisi</span>
        </Link>
      </div>

      <ol className="index-list" style={{ marginTop: 24 }}>
        {CHAPTERS.map((c, i) => (
          <li key={c.path}>
            <Link to={c.path}>
              <span className="num">{i + 1}</span>
              <span className="t">{c.title}</span>
              <span className="s">{c.sub}</span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="process-note">
        <span className="margin-note">idhi oka process, Nanna — deadline kaadhu.</span>
      </div>
    </div>
  );
}
