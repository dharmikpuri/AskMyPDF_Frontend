import { useEffect } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Moves focus into `ref` on mount, keeps Tab inside it, calls `onEscape` on Escape,
 * and restores focus to the previously focused element on unmount.
 * Initial focus goes to `[data-autofocus]` if present, otherwise the first focusable.
 */
export default function useFocusTrap(ref, onEscape) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const previouslyFocused = document.activeElement;

    const focusables = () =>
      Array.from(node.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null);

    const initial = node.querySelector("[data-autofocus]") || focusables()[0] || node;
    initial.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (onEscape) onEscape();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !node.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) previouslyFocused.focus();
    };
    // Run once per mount; onEscape is read through the closure of the first render,
    // so callers should pass a stable-behaving handler (state setters are fine).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
