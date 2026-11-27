/** Decorative: page dropping into a tray, ink + jade. */
export default function DropzoneIllustration() {
  return (
    <svg className="illustration" width="84" height="64" viewBox="0 0 84 64" fill="none" aria-hidden="true">
      <ellipse cx="42" cy="34" rx="38" ry="26" fill="var(--accent-soft)" />
      <rect x="26" y="5" width="30" height="36" rx="5" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.8" />
      <path d="M33 15h16M33 22h16M33 29h9" stroke="var(--ink-2)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 56V43M36 49l6 6 6-6" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 46v8a4 4 0 0 0 4 4h52a4 4 0 0 0 4-4v-8" stroke="var(--ink)" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}