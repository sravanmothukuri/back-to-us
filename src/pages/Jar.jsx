import { useMemo, useState } from "react";
import { Heart, Shuffle } from "lucide-react";
import { ChapterHead, FiveMore } from "../components/Chapter";
import Polaroid from "../components/Polaroid";
import { useContent } from "../content/ContentContext";
import { useLocal } from "../lib/storage";
import "./Jar.css";

export default function Jar() {
  const { notes, noteCategories } = useContent();
  const [cat, setCat] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [favs, setFavs] = useLocal("jar:favourites", []);

  const cats = noteCategories.filter((c) => notes.some((n) => n.category === c.id));
  const pool = useMemo(
    () => (cat === "all" ? notes : notes.filter((n) => n.category === cat)),
    [cat, notes]
  );
  const open = notes.find((n) => n.id === openId);

  const draw = () => {
    if (!pool.length) return;
    // avoid drawing the same slip twice in a row when there's a choice
    const options = pool.length > 1 ? pool.filter((n) => n.id !== openId) : pool;
    setOpenId(options[Math.floor(Math.random() * options.length)].id);
  };

  const isFav = open && favs.includes(open.id);
  const toggleFav = () =>
    setFavs(isFav ? favs.filter((id) => id !== open.id) : [...favs, open.id]);

  const favNotes = notes.filter((n) => favs.includes(n.id));

  return (
    <div className="column">
      <ChapterHead
        path="/jar"
        sub="Chinna chinna slips. Eppudu kavalante appudu okati teeyi — roju teeyalani rule ledhu."
      />

      <div className="chips" role="group" aria-label="Categories" style={{ margin: "18px 0" }}>
        <button className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>
          Edhaina
        </button>
        {cats.map((c) => (
          <button key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="jar-stage">
        <button className="jar" onClick={draw} aria-label="Open a note">
          <span className="jar-lid" aria-hidden />
          <span className="jar-body" aria-hidden>
            {pool.slice(0, 9).map((n, i) => (
              <i key={n.id} style={{ "--r": `${(i * 37) % 50 - 25}deg`, "--x": `${(i * 23) % 70}%`, "--y": `${(i * 41) % 55}%` }} />
            ))}
          </span>
          <span className="jar-cta">
            <Shuffle size={15} aria-hidden /> {open ? "Inkokati teeyi" : "Okati teeyi"}
          </span>
        </button>

        {open && (
          <div className="slip" key={open.id} aria-live="polite">
            <div className="slip-cat">
              {noteCategories.find((c) => c.id === open.category)?.label}
            </div>
            <p className="slip-text">{open.text}</p>
            {open.photo && (
              <div style={{ display: "grid", placeItems: "center", margin: "14px 0 6px" }}>
                <Polaroid src={open.photo} index={2} style={{ maxWidth: 200 }} />
              </div>
            )}
            <button className="btn ghost" onClick={toggleFav} aria-pressed={isFav}>
              <Heart size={16} fill={isFav ? "currentColor" : "none"} aria-hidden />
              {isFav ? "Favourite lo undhi" : "Favourite"}
            </button>
          </div>
        )}
      </div>

      {favNotes.length > 0 && (
        <section style={{ marginTop: 36 }}>
          <h2 className="hand" style={{ color: "var(--rose-ink)", fontWeight: 400 }}>nee favourites</h2>
          <ul className="fav-list">
            {favNotes.map((n) => (
              <li key={n.id}>
                <button className="fav" onClick={() => setOpenId(n.id)}>{n.text}</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FiveMore path="/jar" />
    </div>
  );
}
