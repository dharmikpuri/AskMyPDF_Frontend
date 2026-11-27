import { Link } from "react-router-dom";
import { MessagesSquare, Quote, ShieldCheck } from "lucide-react";
import Wordmark from "../Wordmark";

const POINTS = [
  { icon: Quote, text: "Grounded answers with citations" },
  { icon: MessagesSquare, text: "Follow-up questions remember context" },
  { icon: ShieldCheck, text: "Private: your documents are only yours" },
];

export default function AuthLayout({ children }) {
  return (
    <div className="auth">
      <section className="auth-pitch">
        <div className="auth-pitch-inner">
          <Link to="/" className="brand-link" aria-label="AskMyPDF home">
            <Wordmark />
          </Link>
          <h1 className="auth-headline">Ask your PDFs anything.</h1>
          <p className="auth-subhead">
            Answers come only from your document &mdash; with the sources to prove it.
          </p>
          <ul className="auth-points">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="auth-point-icon" aria-hidden="true">
                  <Icon size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <p className="auth-powered mono">Powered by Gemini &middot; MongoDB Atlas Vector Search</p>
        </div>
      </section>
      <main className="auth-main">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}
