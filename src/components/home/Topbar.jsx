import { Link } from "react-router-dom";
import { LogOut, PanelLeft } from "lucide-react";
import Wordmark from "../Wordmark";

export default function Topbar({ user, isGuest, drawerOpen, drawerToggleRef, onToggleDrawer, onLogout, onSignup }) {
  const name = user?.name || "User";
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          ref={drawerToggleRef}
          type="button"
          className="btn btn-ghost btn-sm drawer-toggle"
          onClick={onToggleDrawer}
          aria-expanded={drawerOpen}
          aria-controls="sidebar"
          aria-label="Documents"
        >
          <PanelLeft size={16} aria-hidden="true" /> <span className="btn-label">Documents</span>
        </button>
        <Link to="/" className="brand-link" aria-label="AskMyPDF home">
          <Wordmark />
        </Link>
      </div>
      <div className="topbar-right">
        {isGuest ? (
          <>
            <span className="pill pill-demo">Demo</span>
            <button type="button" className="btn btn-primary btn-sm" onClick={onSignup}>
              <span className="btn-label">Sign up free</span>
              <span className="btn-label-short">Sign up</span>
            </button>
          </>
        ) : (
          <>
            <span className="avatar" aria-hidden="true">
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="topbar-name">{name}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onLogout} aria-label="Log out">
              <LogOut size={16} aria-hidden="true" /> <span className="btn-label">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
