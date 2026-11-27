/** Decorative: a document talking to a chat bubble, ink + jade. */
export default function EmptyChatIllustration() {
  return (
    <svg className="illustration" width="240" height="140" viewBox="0 0 240 140" fill="none" aria-hidden="true">
      <ellipse cx="120" cy="72" rx="108" ry="58" fill="var(--accent-soft)" />
      <rect x="26" y="20" width="76" height="98" rx="9" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.8" />
      <path d="M40 42h38M40 54h50M40 66h42" stroke="var(--ink-2)" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="40" y="78" width="30" height="14" rx="4" fill="var(--accent)" opacity="0.2" stroke="var(--accent)" strokeWidth="1.8" />
      <path d="M40 104h34" stroke="var(--ink-2)" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M108 66h30" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 6" />
      <path d="M148 24h62a9 9 0 0 1 9 9v36a9 9 0 0 1-9 9h-40l-16 13V78h-6a9 9 0 0 1-9-9V33a9 9 0 0 1 9-9z" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M162 42h44M162 55h28" stroke="var(--ink-2)" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="196" y="50" width="18" height="12" rx="4" fill="var(--accent)" />
    </svg>
  );
}