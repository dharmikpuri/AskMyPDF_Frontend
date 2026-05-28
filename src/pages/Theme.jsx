const Theme = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #0a0118;
      color: #f0ebff;
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
    }

    body::before {
      content: '';
      position: fixed; inset: 0; z-index: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(120,60,220,0.45) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(60,100,255,0.35) 0%, transparent 55%),
        radial-gradient(ellipse 50% 40% at 60% 30%, rgba(200,50,200,0.2) 0%, transparent 50%),
        #0a0118;
      pointer-events: none;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(150,100,255,0.3); border-radius: 99px; }

    .shell {
      position: relative; z-index: 1;
      display: grid;
      grid-template-columns: 280px 1fr;
      grid-template-rows: 58px 1fr;
      height: 100vh;
      overflow: hidden;
    }

    .topbar {
      grid-column: 1 / -1;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px;
      background: rgba(255,255,255,0.04);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(20px);
    }
    .logo {
      font-size: 1.15rem; font-weight: 800; letter-spacing: -0.5px;
      background: linear-gradient(135deg, #c084fc, #818cf8, #60a5fa);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .logo-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.58rem; color: rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 2px 9px; border-radius: 99px; margin-left: 10px;
    }
    .top-right {
      display: flex; align-items: center; gap: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6rem; color: rgba(255,255,255,0.35);
    }
    .live-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 8px #34d399, 0 0 20px rgba(52,211,153,0.4);
      animation: glow-pulse 2s ease-in-out infinite;
    }
    @keyframes glow-pulse {
      0%,100% { box-shadow: 0 0 6px #34d399, 0 0 14px rgba(52,211,153,0.3); }
      50%      { box-shadow: 0 0 10px #34d399, 0 0 28px rgba(52,211,153,0.5); }
    }

    .sidebar {
      background: rgba(255,255,255,0.03);
      border-right: 1px solid rgba(255,255,255,0.07);
      backdrop-filter: blur(20px);
      display: flex; flex-direction: column; overflow: hidden;
    }

    .user-card {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.07);
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      margin-top: auto;
    }
    .user-text {
      display: flex; flex-direction: column; gap: 4px;
    }
    .user-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.58rem; color: rgba(255,255,255,0.35);
      text-transform: uppercase; letter-spacing: 1.5px;
    }
    .user-name {
      font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9);
    }
    .logout-btn {
      background: linear-gradient(135deg, rgba(248,113,113,0.9), rgba(239,68,68,0.9));
      border: 1px solid rgba(248,113,113,0.6);
      color: #fff; font-size: 0.7rem; padding: 6px 10px;
      border-radius: 10px; cursor: pointer; transition: all 0.15s;
      white-space: nowrap;
      box-shadow: 0 6px 18px rgba(248,113,113,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
    }
    .logout-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(248,113,113,0.45), inset 0 1px 0 rgba(255,255,255,0.25);
    }

    .up-section {
      padding: 18px 16px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .sec-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.58rem; font-weight: 500;
      color: rgba(255,255,255,0.3);
      text-transform: uppercase; letter-spacing: 1.5px;
      margin-bottom: 12px;
    }

    .drop {
      position: relative;
      border: 1.5px dashed rgba(192,132,252,0.3);
      border-radius: 12px;
      padding: 20px 12px;
      text-align: center;
      cursor: pointer;
      background: rgba(192,132,252,0.04);
      transition: all 0.2s;
    }
    .drop:hover {
      border-color: rgba(192,132,252,0.7);
      background: rgba(192,132,252,0.08);
      box-shadow: 0 0 20px rgba(192,132,252,0.1), inset 0 0 20px rgba(192,132,252,0.05);
    }
    .drop input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
    .drop-ico { font-size: 1.6rem; display: block; margin-bottom: 6px; }
    .drop-txt {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.62rem; color: rgba(255,255,255,0.3); line-height: 1.5;
    }
    .drop-name {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.62rem; color: #c084fc; margin-top: 4px; word-break: break-all;
    }

    .spill {
      display: inline-flex; align-items: center; gap: 5px;
      font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
      padding: 3px 10px; border-radius: 99px; margin-top: 8px; font-weight: 500;
    }
    .spill.ok   { background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
    .spill.fail { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }
    .spill.busy { background: rgba(251,191,36,0.12);  color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
    .sd { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .sd.blink { animation: blink 0.8s ease-in-out infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

    .up-btn {
      display: flex; align-items: center; justify-content: center; gap: 7px;
      width: 100%; margin-top: 10px; padding: 10px 0;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff; border: none; border-radius: 10px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.78rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
    }
    .up-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      box-shadow: 0 6px 24px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.2);
      transform: translateY(-1px);
    }
    .up-btn:active:not(:disabled) { transform: translateY(0); }
    .up-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .docs-section {
      flex: 1; display: flex; flex-direction: column; overflow: hidden;
    }
    .docs-head {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px 8px;
    }
    .refresh {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5); font-size: 0.8rem;
      width: 26px; height: 26px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.15s;
    }
    .refresh:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .refresh:disabled { opacity: 0.25; cursor: not-allowed; }

    .doc-list { flex: 1; overflow-y: auto; padding: 4px 10px 14px; display: flex; flex-direction: column; gap: 5px; }
    .doc-empty {
      padding: 30px 16px; text-align: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.63rem; color: rgba(255,255,255,0.2); line-height: 2;
    }
    .doc-empty-icon { font-size: 1.8rem; display: block; margin-bottom: 6px; opacity: 0.3; }

    .doc-row {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 11px; border-radius: 10px; cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s;
    }
    .doc-row:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); }
    .doc-row.active {
      background: rgba(124,58,237,0.15);
      border-color: rgba(124,58,237,0.4);
      box-shadow: 0 0 20px rgba(124,58,237,0.1), inset 0 0 12px rgba(124,58,237,0.05);
    }
    .doc-ico { font-size: 1rem; flex-shrink: 0; }
    .doc-info { flex: 1; overflow: hidden; }
    .doc-name {
      font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.85);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .doc-row.active .doc-name { color: #c084fc; }
    .doc-meta {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.58rem; color: rgba(255,255,255,0.25); margin-top: 2px;
    }
    .del {
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,0.15); font-size: 0.7rem; font-weight: 700;
      width: 22px; height: 22px; border-radius: 5px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .del:hover:not(:disabled) { color: #f87171; background: rgba(248,113,113,0.12); }
    .del:disabled { opacity: 0.2; cursor: not-allowed; }

    .chat {
      display: flex; flex-direction: column; overflow: hidden;
      background: rgba(255,255,255,0.01);
    }

    .chat-hdr {
      height: 58px; padding: 0 28px;
      display: flex; align-items: center; justify-content: space-between; gap: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      backdrop-filter: blur(20px);
      background: rgba(255,255,255,0.02);
      flex-shrink: 0;
    }
    .chat-actions { display: flex; align-items: center; gap: 8px; }
    .clear-chat {
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.65); font-size: 0.7rem; padding: 6px 10px;
      border-radius: 10px; cursor: pointer; transition: all 0.15s;
    }
    .clear-chat:hover:not(:disabled) { background: rgba(255,255,255,0.12); color: #fff; }
    .clear-chat:disabled { opacity: 0.35; cursor: not-allowed; }
    .chat-hdr-pill {
      display: flex; align-items: center; gap: 7px;
      font-size: 0.75rem; font-weight: 600; color: #c084fc;
      background: rgba(192,132,252,0.12);
      border: 1px solid rgba(192,132,252,0.25);
      padding: 5px 14px; border-radius: 99px;
      max-width: 400px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      box-shadow: 0 0 16px rgba(192,132,252,0.08);
    }
    .chat-hdr-none {
      font-size: 0.8rem; color: rgba(255,255,255,0.25); font-style: italic;
    }

    .msgs {
      flex: 1; overflow-y: auto; padding: 28px 32px 12px;
      display: flex; flex-direction: column; gap: 18px;
    }
    .empty-state {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 14px;
      text-align: center; padding-bottom: 80px;
    }
    .empty-glow {
      width: 72px; height: 72px; border-radius: 20px;
      background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2));
      border: 1px solid rgba(124,58,237,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem;
      box-shadow: 0 0 40px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .empty-title {
      font-size: 1.2rem; font-weight: 700; color: rgba(255,255,255,0.75);
      line-height: 1.4;
    }
    .empty-sub {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.63rem; color: rgba(255,255,255,0.25); line-height: 1.9;
    }

    .mw { display: flex; gap: 10px; animation: slide-up 0.2s ease; }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .mw.user { flex-direction: row-reverse; }

    .av {
      width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.3px;
    }
    .av.user {
      background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .av.ai {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #fff;
      box-shadow: 0 2px 12px rgba(124,58,237,0.5);
    }

    .bbl {
      max-width: 70%; padding: 12px 16px; border-radius: 14px;
      font-size: 0.83rem; line-height: 1.65;
    }
    .bbl.user {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-top-right-radius: 3px; color: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
    }
    .bbl.ai {
      background: linear-gradient(135deg, rgba(124,58,237,0.18), rgba(79,70,229,0.12));
      border: 1px solid rgba(124,58,237,0.25);
      border-top-left-radius: 3px; color: #ddd6fe;
      box-shadow: 0 4px 20px rgba(124,58,237,0.1);
    }

    .dots { display: flex; gap: 5px; padding: 3px 2px; }
    .dots span {
      width: 6px; height: 6px; border-radius: 50%;
      background: #818cf8;
      animation: hop 1s ease-in-out infinite;
      box-shadow: 0 0 6px rgba(129,140,248,0.5);
    }
    .dots span:nth-child(2) { animation-delay: 0.18s; }
    .dots span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes hop { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

    .inp-row {
      padding: 16px 28px 22px;
      display: flex; gap: 10px; align-items: flex-end;
      border-top: 1px solid rgba(255,255,255,0.07);
      flex-shrink: 0;
    }
    .inp-wrap {
      flex: 1;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      backdrop-filter: blur(12px);
      transition: all 0.2s;
      overflow: hidden;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
    }
    .inp-wrap:focus-within {
      border-color: rgba(192,132,252,0.5);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
    }
    .inp-wrap textarea {
      width: 100%; padding: 11px 16px; background: transparent;
      border: none; outline: none; resize: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.83rem; color: rgba(255,255,255,0.9); line-height: 1.55; display: block;
    }
    .inp-wrap textarea::placeholder { color: rgba(255,255,255,0.25); }
    .inp-wrap textarea:disabled { cursor: not-allowed; }

    .send {
      width: 42px; height: 42px; flex-shrink: 0;
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      border: none; border-radius: 12px; color: #fff;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 0.95rem;
      box-shadow: 0 4px 16px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15);
      transition: all 0.2s;
    }
    .send:hover:not(:disabled) {
      box-shadow: 0 6px 24px rgba(124,58,237,0.65), inset 0 1px 0 rgba(255,255,255,0.2);
      transform: translateY(-1px);
    }
    .send:active:not(:disabled) { transform: translateY(0); }
    .send:disabled { opacity: 0.25; cursor: not-allowed; box-shadow: none; }
  `}</style>
);

export default Theme;
