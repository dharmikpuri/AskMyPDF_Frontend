import { Link } from "react-router-dom";
import Theme from "./Theme";

const AuthStyles = () => (
  <style>{`
    .auth-shell {
      position: relative; z-index: 1;
      min-height: 100vh;
      display: grid; place-items: center;
      padding: 32px 18px;
    }
    .auth-card {
      width: min(440px, 100%);
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 18px;
      padding: 26px 26px 24px;
      box-shadow: 0 20px 60px rgba(10,1,24,0.65), inset 0 1px 0 rgba(255,255,255,0.08);
      backdrop-filter: blur(16px);
    }
    .auth-title {
      font-size: 1.25rem; font-weight: 700; color: rgba(255,255,255,0.9);
      margin-bottom: 6px;
    }
    .auth-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem; color: rgba(255,255,255,0.35);
      margin-bottom: 18px;
      text-transform: uppercase; letter-spacing: 1px;
    }
    .auth-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
    .auth-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.62rem; color: rgba(255,255,255,0.4);
      text-transform: uppercase; letter-spacing: 1px;
    }
    .auth-input {
      height: 42px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.9);
      padding: 0 12px; font-size: 0.85rem; outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .auth-input:focus {
      border-color: rgba(192,132,252,0.6);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.18);
    }
    .auth-btn {
      width: 100%; height: 44px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff; font-weight: 600; font-size: 0.9rem;
      cursor: pointer; margin-top: 6px;
      box-shadow: 0 8px 20px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .auth-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(124,58,237,0.5); }
    .auth-row {
      margin-top: 14px; font-size: 0.78rem; color: rgba(255,255,255,0.5);
      text-align: center;
    }
    .auth-link { color: #c084fc; text-decoration: none; }
    .auth-link:hover { text-decoration: underline; }
  `}</style>
);

export default function Signup() {
  return (
    <>
      <Theme />
      <AuthStyles />
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-title">Create your account</div>
          <div className="auth-sub">Start chatting with PDFs</div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="name">Full name</label>
            <input id="name" type="text" className="auth-input" placeholder="Your name" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="auth-input" placeholder="you@email.com" />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="auth-input" placeholder="Create a password" />
          </div>

          <button className="auth-btn" type="button">Sign up</button>

          <div className="auth-row">
            Already have an account? <Link className="auth-link" to="/login">Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}
