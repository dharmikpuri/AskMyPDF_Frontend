/** Decorative: empty folder, ink + jade. */
export default function NoDocsIllustration() {
  return (
    <svg className="illustration" width="140" height="104" viewBox="0 0 140 104" fill="none" aria-hidden="true">
      <ellipse cx="70" cy="56" rx="58" ry="40" fill="var(--accent-soft)" />
      <path d="M24 28a7 7 0 0 1 7-7h26l9 11h40a7 7 0 0 1 7 7v42a7 7 0 0 1-7 7H31a7 7 0 0 1-7-7V28z" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M24 44h92" stroke="var(--ink)" strokeWidth="1.8" />
      <path d="M52 66h36" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 8" />
      <circle cx="112" cy="18" r="4" fill="var(--accent)" />
      <circle cx="22" cy="86" r="3" fill="var(--accent)" opacity="0.5" />
    </svg>
  );
}