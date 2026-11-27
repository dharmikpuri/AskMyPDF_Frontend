import { useEffect, useState } from "react";
import { Lock, Trash2 } from "lucide-react";
import UploadCard from "./UploadCard";
import NoDocsIllustration from "../illustrations/NoDocsIllustration";
import { formatDate } from "../../lib/format";

function LockedCard({ onSignup }) {
  return (
    <section className="card locked-card" aria-label="Upload limit reached">
      <span className="locked-icon" aria-hidden="true">
        <Lock size={18} />
      </span>
      <h2 className="locked-title">You&apos;ve used your free upload</h2>
      <p className="locked-text">Sign up free to upload unlimited PDFs.</p>
      <button type="button" className="btn btn-primary btn-block" onClick={onSignup}>
        Sign up free
      </button>
    </section>
  );
}

function DocSkeletons() {
  return (
    <ul className="doc-list" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="doc-skeleton">
          <span className="skeleton skeleton-line" style={{ width: `${70 - i * 12}%` }} />
          <span className="skeleton skeleton-line skeleton-line-sm" style={{ width: "45%" }} />
        </li>
      ))}
    </ul>
  );
}

/** Live "Expires in N min" tag, refreshed every minute. */
function ExpiryTag({ expiresAt }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  const ms = new Date(expiresAt).getTime() - now;
  if (!Number.isFinite(ms)) return null;
  if (ms <= 0) return <span className="tag tag-warn">Expired</span>;
  return <span className="tag tag-warn">Expires in {Math.max(1, Math.ceil(ms / 60000))} min</span>;
}

function DocRow({ doc, isGuest, active, pending, deleting, onSelect, onDelete }) {
  const canDelete = isGuest ? !!doc.isGuestUpload : !doc.isDemo;
  const title = doc.title || doc.fileName;
  return (
    <li className={`doc-row${active ? " doc-row-active" : ""}`}>
      <button
        type="button"
        className="doc-main"
        onClick={() => onSelect(doc)}
        aria-current={active ? "true" : undefined}
      >
        <span className="doc-name-line">
          <span className="doc-name" title={title}>
            {title}
          </span>
          {doc.isDemo && <span className="tag">Sample</span>}
          {doc.isGuestUpload && doc.expiresAt && <ExpiryTag expiresAt={doc.expiresAt} />}
        </span>
        {doc.description && <span className="doc-desc">{doc.description}</span>}
        <span className="doc-meta mono">
          {doc.totalChunks} {doc.totalChunks === 1 ? "chunk" : "chunks"} &middot; {formatDate(doc.createdAt)}
          {pending && <span className="badge-pending">Answering&hellip;</span>}
        </span>
      </button>
      {canDelete && (
        <button
          type="button"
          className="icon-btn icon-btn-danger"
          aria-label={`Delete ${doc.fileName}`}
          onClick={() => onDelete(doc)}
          disabled={deleting}
        >
          <Trash2 size={16} />
        </button>
      )}
    </li>
  );
}

export default function Sidebar({
  id,
  asideRef,
  isGuest,
  demo,
  documents,
  loading,
  selectedId,
  pendingByDocId,
  deletingId,
  onSelect,
  onDelete,
  onUploaded,
  onSignup,
  onUploadLimit,
}) {
  const rowProps = (doc) => ({
    doc,
    isGuest,
    active: selectedId === doc.documentId,
    pending: !!pendingByDocId[doc.documentId],
    deleting: deletingId === doc.documentId,
    onSelect,
    onDelete,
  });

  const samples = isGuest ? documents.filter((d) => !d.isGuestUpload) : documents;
  const uploads = isGuest ? documents.filter((d) => d.isGuestUpload) : [];
  const uploadLimit = demo?.uploadLimit ?? 1;
  const uploadsUsed = Math.max(demo?.uploadsUsed ?? 0, uploads.length);
  const guestCanUpload = uploadsUsed < uploadLimit;

  return (
    <aside id={id} ref={asideRef} className="sidebar" aria-label="Documents" tabIndex={-1}>
      {!isGuest ? (
        <UploadCard onUploaded={onUploaded} />
      ) : guestCanUpload ? (
        <UploadCard guest maxMb={demo?.uploadMaxMb ?? 2} onUploaded={onUploaded} onLimit={onUploadLimit} />
      ) : (
        <LockedCard onSignup={onSignup} />
      )}

      <div className="docs">
        <h2 className="section-label">{isGuest ? "Sample documents" : "Your documents"}</h2>
        {loading ? (
          <DocSkeletons />
        ) : samples.length === 0 ? (
          <div className="doc-empty">
            <NoDocsIllustration />
            <p className="doc-empty-title">No documents yet</p>
            <p className="doc-empty-sub">Upload a PDF above to start asking questions.</p>
          </div>
        ) : (
          <ul className="doc-list">
            {samples.map((doc) => (
              <DocRow key={doc.documentId} {...rowProps(doc)} />
            ))}
          </ul>
        )}
      </div>

      {isGuest && uploads.length > 0 && (
        <div className="docs">
          <h2 className="section-label">Your upload</h2>
          <ul className="doc-list">
            {uploads.map((doc) => (
              <DocRow key={doc.documentId} {...rowProps(doc)} />
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}