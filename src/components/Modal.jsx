import { useId, useRef } from "react";
import useFocusTrap from "../hooks/useFocusTrap";

/** Mount only while open. Backdrop click and Escape call onClose. */
export default function Modal({ title, children, actions, onClose, closeOnBackdrop = true }) {
  const ref = useRef(null);
  const titleId = useId();
  const bodyId = useId();
  useFocusTrap(ref, onClose);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        tabIndex={-1}
      >
        <h2 className="modal-title" id={titleId}>
          {title}
        </h2>
        <div className="modal-body" id={bodyId}>
          {children}
        </div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  );
}
