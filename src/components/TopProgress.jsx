import { useEffect, useState, useSyncExternalStore } from "react";
import { getInflight, subscribeInflight } from "../api/config";

/** Thin jade bar at the top of the window while any API request has been in flight for > 300 ms. */
export default function TopProgress() {
  const busy = useSyncExternalStore(subscribeInflight, () => getInflight() > 0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!busy) return undefined;
    const t = setTimeout(() => setShow(true), 300);
    return () => {
      clearTimeout(t);
      setShow(false);
    };
  }, [busy]);

  if (!busy || !show) return null;
  return <div className="top-progress" role="progressbar" aria-label="Loading" aria-busy="true" />;
}