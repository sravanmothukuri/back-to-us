import { lazy, Suspense, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, X } from "lucide-react";
import { CHAPTERS } from "./chapters";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Letter from "./pages/Letter";
import Promises from "./pages/Promises";
import Jar from "./pages/Jar";
import Play from "./pages/Play";
import You from "./pages/You";
import Next from "./pages/Next";
import Birthday from "./birthday/Birthday";

// The Studio (editing + private reflections) only exists on the dev server.
// In a production build this branch is removed, so it never gets deployed.
const Studio = import.meta.env.DEV ? lazy(() => import("./studio/Studio")) : null;

const BACKGROUNDS = {
  "/letter": "var(--ivory)",
  "/promises": "var(--ivory)",
  "/play": "var(--ivory)",
  "/next": "#f7e6df",
};

function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    setOpen(false);
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="page" style={{ "--page-bg": BACKGROUNDS[pathname] || "var(--blush)" }}>
      <nav className="topbar" aria-label="Main">
        <Link to="/" className="wordmark">Back to Us</Link>
        <button className="menu-btn" onClick={() => setOpen(true)} aria-expanded={open}>
          <BookOpen size={15} aria-hidden /> Chapters
        </button>
      </nav>
      {open && (
        <div className="index-overlay" onClick={() => setOpen(false)}>
          <div
            className="index-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Chapters"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2>mana chapters</h2>
              <button className="btn ghost" onClick={() => setOpen(false)} aria-label="Close" autoFocus>
                <X size={18} />
              </button>
            </div>
            <ol className="index-list">
              <li>
                <NavLink to="/" end>
                  <span className="num">·</span>
                  <span className="t">Modhalu</span>
                  <span className="s">Where we are now</span>
                </NavLink>
              </li>
              {CHAPTERS.map((c, i) => (
                <li key={c.path}>
                  <NavLink to={c.path}>
                    <span className="num">{i + 1}</span>
                    <span className="t">{c.title}</span>
                    <span className="s">{c.sub}</span>
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/birthday">
                  <span className="num">♡</span>
                  <span className="t">Nee birthday card</span>
                  <span className="s">January 2025</span>
                </NavLink>
              </li>
              {Studio && (
                <li>
                  <NavLink to="/studio">
                    <span className="num">✎</span>
                    <span className="t">Studio</span>
                    <span className="s">Sravan only · this computer only</span>
                  </NavLink>
                </li>
              )}
            </ol>
          </div>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/birthday" element={<Birthday onExit={() => navigate("/story")} />} />
      <Route
        path="*"
        element={
          <Shell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/story" element={<Story />} />
              <Route path="/letter" element={<Letter />} />
              <Route path="/promises" element={<Promises />} />
              <Route path="/jar" element={<Jar />} />
              <Route path="/play" element={<Play />} />
              <Route path="/you" element={<You />} />
              <Route path="/next" element={<Next />} />
              {Studio && (
                <Route
                  path="/studio"
                  element={
                    <Suspense fallback={<p className="column">Loading…</p>}>
                      <Studio />
                    </Suspense>
                  }
                />
              )}
              <Route path="*" element={<Home />} />
            </Routes>
          </Shell>
        }
      />
    </Routes>
  );
}
