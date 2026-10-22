import { photoSrc } from "../lib/photo";

// Tilt is derived from the index so it stays the same between visits.
const TILTS = [-2.4, 1.6, -1.1, 2.2, -0.6, 1.2];

export default function Polaroid({ src, caption, alt, index = 0, style }) {
  return (
    <figure
      className="polaroid"
      style={{ transform: `rotate(${TILTS[index % TILTS.length]}deg)`, ...style }}
    >
      <img src={photoSrc(src)} alt={alt || caption || "Mana photo"} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
