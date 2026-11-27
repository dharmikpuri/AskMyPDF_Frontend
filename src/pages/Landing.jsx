import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Loader2,
  MessagesSquare,
  MonitorSmartphone,
  Quote,
  RefreshCcw,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import Wordmark from "../components/Wordmark";
import PipelineAnimation from "../components/landing/PipelineAnimation";
import ChatPreview from "../components/landing/ChatPreview";
import { AskIcon, IndexIcon, UploadIcon } from "../components/landing/StepIcons";
import useStartDemo from "../hooks/useStartDemo";
import { getToken } from "../lib/session";

const STEPS = [
  { icon: UploadIcon, title: "Upload", text: "Drag in a PDF — text is extracted and split into overlapping passages." },
  { icon: IndexIcon, title: "Index", text: "Each passage becomes a Gemini embedding stored in MongoDB Atlas Vector Search." },
  { icon: AskIcon, title: "Ask", text: "Your question finds the closest passages and Gemini answers only from them — with citations." },
];

const FEATURES = [
  { icon: Quote, title: "Grounded answers with sources", text: "Every answer links back to the passages it came from, with a match score." },
  { icon: MessagesSquare, title: "Follow-up questions remember context", text: "Each document keeps its own conversation, so you can dig deeper." },
  { icon: ShieldCheck, title: "Private: your documents are only yours", text: "Documents and chats are tied to your account and nobody else's." },
  { icon: UploadCloud, title: "Drag-and-drop upload up to 10 MB", text: "Drop a PDF in and watch it get indexed, with clear errors if something is off." },
  { icon: RefreshCcw, title: "Reliable: automatic fallback across Gemini models", text: "If one model is busy, the next one picks up the question." },
  { icon: MonitorSmartphone, title: "Works on any screen", text: "A calm, responsive layout from phone to widescreen." },
];

const SAMPLES = [
  {
    id: "64656d6f0000000000000006",
    title: "NIST AI Risk Management Framework",
    text: "The U.S. government's 48-page framework for trustworthy AI.",
    questions: ["What are the four functions of the AI RMF Core?", "What makes an AI system trustworthy?", "Summarize the framework in 3 points"],
  },
  {
    id: "64656d6f0000000000000003",
    title: "The U.S. Constitution",
    text: "The original articles of the Constitution — a long legal text.",
    questions: ["How long is a senator's term?", "What are the requirements to be President?", "Who has the power to declare war?"],
  },
  {
    id: "64656d6f0000000000000004",
    title: "Sherlock Holmes: A Scandal in Bohemia",
    text: "Arthur Conan Doyle's classic short story.",
    questions: ["Why does the King seek Holmes's help?", "Who is Irene Adler?", "How does Holmes find the hidden photograph?"],
  },
  {
    id: "64656d6f0000000000000005",
    title: "Northwind Labs — Employee Handbook",
    text: "A fictional company handbook: leave, expenses and security rules.",
    questions: ["How many days of annual leave do employees get?", "What are the expense reimbursement rules?", "What should you do if you lose a company device?"],
  },
];

const FACTS = ["4 sample documents", "3,072-dimension embeddings", "Citations on every answer", "Free to try — no sign-up"];

const TECH = ["React 19", "Vite", "Node.js", "Express 5", "MongoDB Atlas Vector Search", "Google Gemini"];

const FAQ = [
  { q: "Is my PDF private?", a: "Yes. Only your account can access your documents and chats. Guest uploads are deleted automatically after 1 hour." },
  { q: "What are the demo limits?", a: "As a guest you can ask 3 questions and upload 1 PDF of up to 2 MB. A free account removes these limits (uploads up to 10 MB)." },
  { q: "Which AI models does it use?", a: "Google Gemini embeddings to find the right passages, and Gemini chat models to write the answer, with automatic fallback if one is busy." },
  { q: "What if the answer isn't in my PDF?", a: "It says so instead of guessing. Answers come only from the document." },
];

function Eyebrow({ children }) {
  return <p className="eyebrow mono">{children}</p>;
}

export default function Landing() {
  const { start, loading, slow, activeId } = useStartDemo();
  const loggedIn = !!getToken();
  const generalLoading = loading && !activeId;

  const demoButton = (size = "btn-lg") => (
    <button type="button" className={`btn btn-primary ${size}`} onClick={() => start()} disabled={loading}>
      {generalLoading && <Loader2 size={16} className="spin" aria-hidden="true" />}
      {generalLoading ? "Starting demo\u2026" : "Try the demo \u2014 no sign-up"}
    </button>
  );

  return (
    <div className="landing">
      <header className="l-nav">
        <div className="l-wrap l-nav-inner">
          <Link to="/" className="l-brand" aria-label="AskMyPDF home">
            <Wordmark />
          </Link>
          <nav className="l-links" aria-label="Sections">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#samples">Samples</a>
          </nav>
          <div className="l-nav-actions">
            {loggedIn ? (
              <Link to="/app" className="btn btn-primary btn-sm">
                Open app
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => start()} disabled={loading}>
                  {generalLoading && <Loader2 size={14} className="spin" aria-hidden="true" />}
                  {generalLoading ? "Starting\u2026" : "Try the demo"}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="l-hero-wrap">
          <div className="l-hero l-wrap">
            <div className="l-hero-copy">
              <p className="l-pill mono">Retrieval-Augmented Generation &middot; Gemini + MongoDB Atlas</p>
              <h1 className="l-h1">
                Ask your PDFs <span className="l-accent">anything.</span>
              </h1>
              <p className="l-lead">
                Upload a PDF and get answers that come only from your document &mdash; with the sources to prove it.
              </p>
              <div className="l-cta">
                {loggedIn ? (
                  <Link to="/app" className="btn btn-primary btn-lg">
                    Open app <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <>
                    {demoButton()}
                    <Link to="/signup" className="btn btn-secondary btn-lg">
                      Create free account
                    </Link>
                  </>
                )}
              </div>
              {slow && generalLoading && (
                <p className="l-wake" role="status">
                  Waking up the server&hellip;
                </p>
              )}
              <p className="l-trust mono">Grounded answers &middot; Citations &middot; Free to try</p>
            </div>
            <div className="l-hero-visual">
              <PipelineAnimation />
            </div>
          </div>
        </section>

        <section className="l-section l-wrap" aria-labelledby="preview-h">
          <Eyebrow>SEE IT ANSWER</Eyebrow>
          <h2 id="preview-h" className="l-h2">Real questions, answers with receipts</h2>
          <ChatPreview />
        </section>

        <section className="l-facts" aria-label="Key facts">
          <ul className="l-wrap">
            {FACTS.map((f) => (
              <li key={f} className="mono">
                {f}
              </li>
            ))}
          </ul>
        </section>

        <section id="walkthrough" className="l-section l-wrap" aria-labelledby="video-h">
          <Eyebrow>WALKTHROUGH</Eyebrow>
          <h2 id="video-h" className="l-h2">See it in 80 seconds</h2>
          <figure className="l-video">
            <video
              controls
              preload="none"
              playsInline
              poster="/video/askmypdf-poster.png"
              width="1920"
              height="1080"
              aria-describedby="video-desc"
            >
              <source src="/video/askmypdf-walkthrough.mp4" type="video/mp4" />
              Your browser can&rsquo;t play this video.{" "}
              <a href="/video/askmypdf-walkthrough.mp4">Download the walkthrough</a>.
            </video>
            <figcaption id="video-desc">
              An 84-second tour with voice-over: the landing page, the demo, citations, follow-up questions,
              uploading a PDF, how RAG works, and mobile.
            </figcaption>
          </figure>
        </section>

        <section id="how" className="l-section l-wrap" aria-labelledby="how-h">
          <Eyebrow>HOW IT WORKS</Eyebrow>
          <h2 id="how-h" className="l-h2">From PDF to cited answer in three steps</h2>
          <ol className="l-steps">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="l-step card lift">
                <Icon />
                <h3>
                  <span className="mono l-step-n">0{i + 1}</span> {title}
                </h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="l-section l-wrap" aria-labelledby="vs-h">
          <Eyebrow>WHY NOT JUST A CHATBOT?</Eyebrow>
          <h2 id="vs-h" className="l-h2">Answers you can check</h2>
          <div className="l-vs">
            <div className="l-vs-col card">
              <h3>Generic chatbot</h3>
              <ul>
                <li><X size={16} aria-hidden="true" /> Answers from memory</li>
                <li><X size={16} aria-hidden="true" /> Can invent facts</li>
                <li><X size={16} aria-hidden="true" /> No way to check</li>
              </ul>
            </div>
            <div className="l-vs-col l-vs-good card">
              <h3>AskMyPDF</h3>
              <ul>
                <li><Check size={16} aria-hidden="true" /> Answers only from your PDF</li>
                <li><Check size={16} aria-hidden="true" /> Says when it can&apos;t find something</li>
                <li><Check size={16} aria-hidden="true" /> Shows the exact passages</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="l-section l-wrap" aria-labelledby="feat-h">
          <Eyebrow>FEATURES</Eyebrow>
          <h2 id="feat-h" className="l-h2">Built to be trusted</h2>
          <ul className="l-features">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="l-feature card lift">
                <span className="l-feature-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="samples" className="l-section l-wrap" aria-labelledby="samples-h">
          <Eyebrow>SAMPLES</Eyebrow>
          <h2 id="samples-h" className="l-h2">Try it on these</h2>
          <ul className="l-samples">
            {SAMPLES.map((s) => {
              const mine = loading && activeId === s.id;
              return (
                <li key={s.id} className="l-sample card lift">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul className="l-qchips" aria-label={`Suggested questions for ${s.title}`}>
                    {s.questions.map((q) => (
                      <li key={q}>
                        <button type="button" className="chip chip-sm" onClick={() => start(s.id, q)} disabled={loading}>
                          {q}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => start(s.id)} disabled={loading}>
                    {mine && <Loader2 size={14} className="spin" aria-hidden="true" />}
                    {mine ? "Starting demo\u2026" : "Ask this document"}
                    {!mine && <ArrowRight size={14} aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="l-callout">Or try your own PDF &mdash; 1 PDF, up to 2 MB, deleted after 1 hour.</p>
          {slow && loading && (
            <p className="l-wake" role="status">
              Waking up the server&hellip;
            </p>
          )}
        </section>

        <section className="l-section l-wrap l-faq-wrap" aria-labelledby="faq-h">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-h" className="l-h2">Good questions</h2>
          <div className="l-faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="l-tech l-wrap" aria-label="Technology">
          <ul>
            {TECH.map((t) => (
              <li key={t} className="mono">
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="l-final">
          <div className="l-wrap">
            <h2 className="l-h2">Stop skimming. Start asking.</h2>
            <p>Open a sample in one click, or bring your own PDF.</p>
            <div className="l-cta l-cta-center">
              {loggedIn ? (
                <Link to="/app" className="btn btn-primary btn-lg">
                  Open app
                </Link>
              ) : (
                <>
                  {demoButton()}
                  <Link to="/signup" className="btn btn-secondary btn-lg">
                    Create free account
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="l-footer">
        <div className="l-wrap l-footer-inner">
          <span>
            Built by <a href="https://dharmikpuri.github.io" target="_blank" rel="noopener noreferrer">Dharmik Puri Goswami</a>
          </span>
          <a href="https://github.com/dharmikpuri" target="_blank" rel="noopener noreferrer" className="l-gh">
            <ExternalLink size={16} aria-hidden="true" /> GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}