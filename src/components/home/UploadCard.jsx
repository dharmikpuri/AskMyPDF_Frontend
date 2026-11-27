import { useEffect, useRef, useState } from "react";
import { Check, FileText, Loader2, X } from "lucide-react";
import apiClient from "../../api/config";
import { parseApiError } from "../../api/errors";
import { formatSize } from "../../lib/format";
import DropzoneIllustration from "../illustrations/DropzoneIllustration";

const STEPS = ["Extracting text", "Creating embeddings", "Making it searchable"];

/** Honest, time-based checklist: we cannot see server progress, so we never claim exact numbers. */
function IndexSteps({ done }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - t0), 400);
    return () => clearInterval(id);
  }, []);
  const active = elapsed < 2000 ? 0 : elapsed < 6000 ? 1 : 2;
  return (
    <ul className="steps-list" aria-label="Indexing steps">
      {STEPS.map((label, i) => {
        const complete = done || i < active;
        const current = !done && i === active;
        return (
          <li key={label} className={complete ? "step-done" : current ? "step-active" : ""}>
            <span className="step-mark" aria-hidden="true">
              {complete ? <Check size={14} /> : current ? <Loader2 size={14} className="spin" /> : null}
            </span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}

const validateFile = (file, maxMb) => {
  const MAX_BYTES = maxMb * 1024 * 1024;
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
  if (!isPdf) return "Only PDF files are supported.";
  if (file.size > MAX_BYTES) return `That file is ${formatSize(file.size)}. The limit is ${maxMb} MB.`;
  if (file.size === 0) return "That file is empty.";
  return "";
};

export default function UploadCard({ onUploaded, guest = false, maxMb = 10, onLimit }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const indexing = busy && progress >= 100;

  const choose = (picked) => {
    if (!picked || busy) return;
    const problem = validateFile(picked, maxMb);
    if (problem) {
      setFile(null);
      setError(problem);
      return;
    }
    setError("");
    setFile(picked);
  };

  const upload = async () => {
    if (!file || busy) return;
    setBusy(true);
    setProgress(0);
    setError("");
    let result = null;
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      const { data } = await apiClient.post("/upload-pdf", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.min(100, Math.round((e.loaded / e.total) * 100)));
        },
      });
      result = data;
      setProgress(100);
      setSucceeded(true);
      await new Promise((r) => setTimeout(r, 600)); // let the checklist show all ticks
      setFile(null);
    } catch (e) {
      const err = parseApiError(e, "Upload failed. Please try again.");
      setError(err.message);
      if (err.code === "GUEST_UPLOAD_LIMIT" && onLimit) onLimit();
    } finally {
      setBusy(false);
      setSucceeded(false);
      setProgress(0);
    }
    if (result) onUploaded(result);
  };

  const openPicker = () => {
    if (!busy) inputRef.current?.click();
  };

  return (
    <section className="card upload-card" aria-label="Upload a PDF">
      <h2 className="section-label">{guest ? "Try your own PDF" : "Upload PDF"}</h2>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          choose(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {!file && (
        <div
          className={`dropzone${dragOver ? " dropzone-over" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Choose a PDF to upload, or drop one here"
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            choose(e.dataTransfer.files?.[0]);
          }}
        >
          <DropzoneIllustration />
          <span className="dropzone-title">Drop a PDF here or click to choose</span>
          <span className="dropzone-sub mono">
            {guest ? "1 PDF \u00b7 up to 2 MB \u00b7 ~15 pages \u00b7 deleted after 1 hour" : `PDF \u00b7 up to ${maxMb} MB`}
          </span>
        </div>
      )}

      {file && (
        <div className="file-chip">
          <FileText size={18} aria-hidden="true" />
          <div className="file-chip-text">
            <span className="file-chip-name" title={file.name}>
              {file.name}
            </span>
            <span className="mono file-chip-size">{formatSize(file.size)}</span>
          </div>
          {!busy && (
            <button
              type="button"
              className="icon-btn"
              aria-label="Remove selected file"
              onClick={() => setFile(null)}
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {busy && (
        <div className="progress-block" role="status" aria-live="polite">
          {indexing ? (
            <>
              <IndexSteps done={succeeded} />
              <p className="progress-label">Indexing&hellip; this can take a moment for long PDFs</p>
            </>
          ) : (
            <>
              <div
                className="progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label="Upload progress"
              >
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <p className="progress-label mono">Uploading {progress}%</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      {file && (
        <button type="button" className="btn btn-primary btn-block" onClick={upload} disabled={busy}>
          {busy && <Loader2 size={16} className="spin" aria-hidden="true" />}
          {busy ? (indexing ? "Indexing\u2026" : "Uploading\u2026") : "Upload & index"}
        </button>
      )}
    </section>
  );
}