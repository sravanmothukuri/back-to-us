import { Link } from "react-router-dom";
import { ChapterHead, FiveMore } from "../components/Chapter";
import { useContent } from "../content/ContentContext";
import "./Letter.css";

export default function Letter() {
  const { letter } = useContent();
  const paragraphs = letter.body.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="column">
      <ChapterHead path="/letter" sub="Excuses kaadhu. Naaku ippudu ardham ayyindhi idhi." />

      <article className="letter-sheet">
        <p className="letter-greeting">{letter.greeting}</p>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="letter-closing">{letter.closing}</p>
        <p className="letter-sign">— {letter.signature}</p>
      </article>

      <p className="small letter-after">
        Deeniki reply avasaram ledhu. Edhaina cheppalanipisthe, eppudaina —{" "}
        <Link to="/you">nee space lo</Link> raayi, leda direct ga cheppu.
      </p>

      <FiveMore path="/letter" />
    </div>
  );
}
