import { Link } from "react-router-dom";
import { ChapterHead, FiveMore } from "../components/Chapter";
import Polaroid from "../components/Polaroid";
import { useContent } from "../content/ContentContext";
import { months } from "../content/story";
import "./Story.css";

function Moment({ m }) {
  return (
    <li className={`moment ${m.tone || "old"}${m.featured ? " featured" : ""}`}>
      <div className="when">
        {/* "around" only reads right in front of an actual date or class */}
        {m.approx && /\d/.test(m.when) ? `around ${m.when}` : m.when}
      </div>
      <h2>{m.title}</h2>
      <p className="body">{m.body}</p>
      {m.margin && <div className="margin-note">— {m.margin}</div>}

      {m.strip && m.photos?.length > 0 && (
        <div className="months strip" tabIndex={0} aria-label="Mana photos">
          {m.photos.map((p, i) => (
            <Polaroid key={p.src + i} src={p.src} caption={p.caption} index={i} />
          ))}
        </div>
      )}

      {!m.strip && m.photos?.length > 0 && (
        <div className="moment-photos">
          {m.photos.map((p, i) => (
            <Polaroid key={p.src + i} src={p.src} caption={p.caption} index={i + m.title.length} />
          ))}
        </div>
      )}

      {m.showMonths && (
        <>
          <p className="small" style={{ marginTop: 16 }}>Mana 13 nelalu — nee birthday card lo unna photos</p>
          <div className="months" tabIndex={0} aria-label="Monthly photos, January 2024 to January 2025">
            {months.map((p, i) => (
              <Polaroid key={p.src} src={p.src} caption={p.label} index={i} />
            ))}
          </div>
        </>
      )}

      {m.herAsk && (
        <Link className="her-ask hand" to={`/you?about=${encodeURIComponent(m.title)}#her-version`}>
          nuvvu ela gurthupettukunnav? →
        </Link>
      )}

      {m.link && (
        <Link className="btn soft moment-link" to={m.link.to}>
          {m.link.label} →
        </Link>
      )}
    </li>
  );
}

export default function Story() {
  const { story } = useContent();
  return (
    <div className="column">
      <ChapterHead
        path="/story"
        sub="10th class nunchi ippati dhaka. Date kachitham ga gurthu leni chota “around” ani raasanu — guess cheyyaledhu."
      />
      <ol className="timeline">
        {story.map((m) => (
          <Moment key={m.id} m={m} />
        ))}
      </ol>
      <FiveMore path="/story" />
    </div>
  );
}
