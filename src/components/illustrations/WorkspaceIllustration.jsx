/** Decorative: no document selected. Two-tone ink + jade stack of pages with a magnifier. */
export default function WorkspaceIllustration() {
  return (
    <svg className="illustration" width="220" height="160" viewBox="0 0 220 160" fill="none" aria-hidden="true">
      <ellipse cx="110" cy="84" rx="92" ry="64" fill="var(--accent-soft)" />
      <circle cx="40" cy="38" r="5" fill="var(--accent)" opacity="0.35" />
      <circle cx="190" cy="132" r="7" fill="var(--accent)" opacity="0.25" />
      <rect x="62" y="26" width="84" height="108" rx="9" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.8" transform="rotate(-7 104 80)" />
      <rect x="68" y="20" width="84" height="108" rx="9" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.8" />
      <path d="M82 44h40M82 56h56M82 68h48" stroke="var(--ink-2)" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="82" y="80" width="34" height="16" rx="4" fill="var(--accent)" opacity="0.18" stroke="var(--accent)" strokeWidth="1.8" />
      <path d="M82 108h30" stroke="var(--ink-2)" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="148" cy="104" r="23" fill="var(--surface)" fillOpacity="0.9" stroke="var(--accent)" strokeWidth="2.4" />
      <path d="M165 121l17 17" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" />
      <path d="M138 104h20M148 94v20" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}