import { Link } from "react-router-dom";
import { CHAPTERS } from "../chapters";

export function ChapterHead({ path, sub, children }) {
  const i = CHAPTERS.findIndex((c) => c.path === path);
  const c = CHAPTERS[i];
  return (
    <header className="chapter-head">
      <div className="chapter-no">chapter {i + 1}</div>
      <h1 className="chapter-title">{c.title}</h1>
      {sub && <p className="chapter-sub">{sub}</p>}
      {children}
    </header>
  );
}

// The chapter ending: "inka five minutes?" instead of a Next button.
export function FiveMore({ path }) {
  const i = CHAPTERS.findIndex((c) => c.path === path);
  const next = CHAPTERS[i + 1];
  return (
    <div className="five-more">
      <p>{next ? "Inka five minutes, Nanna?" : "Ivvaltiki inthe, Nanna."}</p>
      <div className="row" style={{ justifyContent: "center" }}>
        {next ? (
          <Link className="btn" to={next.path}>
            Sare, inka konchem → {next.title}
          </Link>
        ) : (
          <Link className="btn soft" to="/">
            Modhatiki
          </Link>
        )}
        {next && (
          <Link className="btn ghost" to="/">
            Ippatiki chaalu
          </Link>
        )}
      </div>
    </div>
  );
}
