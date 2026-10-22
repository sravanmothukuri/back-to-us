import { memo } from "react";

// A quieter version of the birthday card's floating ♡ — fewer, slower, softer.
const SEEDS = [6, 18, 29, 41, 52, 63, 74, 86, 94];

const Hearts = memo(function Hearts() {
  return (
    <div className="hearts" aria-hidden>
      {SEEDS.map((left, i) => (
        <span
          key={left}
          style={{
            left: `${left}%`,
            animationDelay: `${(i * 1.7) % 9}s`,
            animationDuration: `${12 + (i % 4) * 3}s`,
            fontSize: `${1 + (i % 3) * 0.4}rem`,
          }}
        >
          ♡
        </span>
      ))}
    </div>
  );
});
export default Hearts;
