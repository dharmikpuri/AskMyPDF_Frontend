import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmModal({ title, message, confirmLabel, busyLabel = "Working\u2026", onConfirm, onCancel }) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={title} onClose={() => !busy && onCancel()} closeOnBackdrop={!busy}
      actions={
        <>
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy} data-autofocus>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={confirm} disabled={busy}>
            {busy && <Loader2 size={16} className="spin" aria-hidden="true" />}
            {busy ? busyLabel : confirmLabel}
          </button>
        </>
      }
    >
      {message}
    </Modal>
  );
}