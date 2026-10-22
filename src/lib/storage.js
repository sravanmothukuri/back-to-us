import { useEffect, useState } from "react";

// Everything here lives only in this browser. Private mode, clearing site
// data, or another phone means it's gone / not there, so every access is guarded.
const PREFIX = "backtous:";

export function readLocal(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeLocal(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeLocal(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* nothing to do */
  }
}

export function useLocal(key, fallback) {
  const [value, setValue] = useState(() => readLocal(key, fallback));
  useEffect(() => {
    writeLocal(key, value);
  }, [key, value]);
  return [value, setValue];
}

export function allLocalKeys() {
  try {
    return Object.keys(window.localStorage).filter((k) => k.startsWith(PREFIX));
  } catch {
    return [];
  }
}
