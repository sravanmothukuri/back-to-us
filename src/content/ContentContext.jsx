import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { story } from "./story";
import { letter } from "./letter";
import { notes, noteCategories } from "./notes";
import { promises } from "./promises";
import overrides from "./overrides.json";
import { readLocal, writeLocal, removeLocal } from "../lib/storage";

// Content = the defaults in this folder, replaced section by section by
// overrides.json (exported from the Studio), and — on the dev server only —
// by unsaved Studio edits in this browser.
export const STUDIO_KEY = "studio:content";
export const SECTIONS = ["story", "letter", "notes", "promises"];

const defaults = { story, letter, notes, promises };

function build(studioEdits) {
  const merged = { ...defaults, ...pick(overrides) };
  if (import.meta.env.DEV) Object.assign(merged, pick(studioEdits));
  if (import.meta.env.PROD) merged.notes = merged.notes.filter((n) => !n.placeholder);
  return merged;
}

function pick(obj) {
  const out = {};
  for (const k of SECTIONS) if (obj && obj[k] != null) out[k] = obj[k];
  return out;
}

const Ctx = createContext(null);

export function ContentProvider({ children }) {
  const [studio, setStudio] = useState(() =>
    import.meta.env.DEV ? readLocal(STUDIO_KEY, {}) : {}
  );

  const content = useMemo(() => build(studio), [studio]);

  const saveSection = useCallback((section, value) => {
    setStudio((prev) => {
      const next = { ...prev, [section]: value };
      writeLocal(STUDIO_KEY, next);
      return next;
    });
  }, []);

  const replaceAll = useCallback((data) => {
    const next = pick(data);
    writeLocal(STUDIO_KEY, next);
    setStudio(next);
  }, []);

  const resetStudio = useCallback(() => {
    removeLocal(STUDIO_KEY);
    setStudio({});
  }, []);

  const value = useMemo(
    () => ({ ...content, noteCategories, saveSection, replaceAll, resetStudio }),
    [content, saveSection, replaceAll, resetStudio]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useContent = () => useContext(Ctx);
