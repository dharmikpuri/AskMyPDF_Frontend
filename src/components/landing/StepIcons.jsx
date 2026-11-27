export function UploadIcon() {
  return (
    <span className="step-icon-wrap">
      <svg className="step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="12" y="5" width="24" height="31" rx="4" className="si-fill" />
        <path d="M18 14h12M18 20h12" className="si-stroke" />
        <g className="si-arrow">
          <path d="M24 44V29M18 34l6-6 6 6" className="si-accent" />
        </g>
      </svg>
    </span>
  );
}

export function IndexIcon() {
  return (
    <span className="step-icon-wrap">
      <svg className="step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="6" y="8" width="36" height="32" rx="6" className="si-fill" />
        <rect x="13" y="22" width="5" height="12" rx="2.5" className="si-bar si-bar-1" />
        <rect x="21.5" y="15" width="5" height="19" rx="2.5" className="si-bar si-bar-2" />
        <rect x="30" y="26" width="5" height="8" rx="2.5" className="si-bar si-bar-3" />
      </svg>
    </span>
  );
}

export function AskIcon() {
  return (
    <span className="step-icon-wrap">
      <svg className="step-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M10 8h28a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H26l-8 7v-7h-8a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" className="si-fill" />
        <circle cx="16" cy="20.5" r="2.4" className="si-dot si-dot-1" />
        <circle cx="24" cy="20.5" r="2.4" className="si-dot si-dot-2" />
        <circle cx="32" cy="20.5" r="2.4" className="si-dot si-dot-3" />
      </svg>
    </span>
  );
}