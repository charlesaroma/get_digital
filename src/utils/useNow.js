/* The current time, refreshed every minute, so "upcoming" and "past" stay right on an open page. */
import { useEffect, useState } from "react";

export default function useNow(everyMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(t);
  }, [everyMs]);
  return now;
}
