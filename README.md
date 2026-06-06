# AskMyPDF

AskMyPDF is a full-stack PDF conversational Q&A web application. Users can upload PDF documents and ask natural-language questions; the app uses retrieval-augmented generation (RAG) with LangChain on the backend to return context-aware answers.

## Demo
- Local: `npm install` → `npm run dev` → open `http://localhost:5173`
- Build: `npm run build` → deploy artifacts in `dist` (Vercel recommended)

## Features
- Upload and manage PDF documents
- Chat-style Q&A interface powered by RAG (LangChain)
- Authentication: signup / login flows
- Protected routes for authenticated users
- Global notifications via `react-toastify`
- SPA-friendly routing (Vercel rewrites configured in `vercel.json`)

## Tech stack
- Frontend: React, Vite, React Router, react-toastify
- HTTP: axios
- Backend: Custom API (RAG + LangChain) — separate repository
- Deployment: Vercel (static site serving `dist`)

## Key files
- `src/` — React source
- `src/api/config.js` — API base URL via `VITE_API_URL`
- `src/api/auth.js` — authentication handlers
- `routes/route.jsx`, `routes/PrivateRoute.jsx` — app routing and protection
- `public/favicon.svg` — project favicon (custom)
- `vercel.json` — SPA rewrites for Vercel

## Deployment steps
1. Ensure `VITE_API_URL` in `.env` points to your backend API.
2. Build:
```bash
npm install
npm run build
```
3. Deploy to Vercel (or any static host) and set Build Command to `vite build` and Output Directory to `dist`.

## Screenshots
Add screenshots below (update path or paste images):

- Screenshot 1: /public/screenshots/home.png
- <img width="956" height="476" alt="image" src="https://github.com/user-attachments/assets/39aadc47-b6cc-48e7-945b-e72cc4898aa4" />

- Screenshot 2: /public/screenshots/chat.png
- <img width="956" height="476" alt="image" src="https://github.com/user-attachments/assets/d06cdfb2-8882-4e67-a808-8e02ed06f01c" />

- Screenshot 3: /public/screenshots/login.png
- <img width="955" height="473" alt="image" src="https://github.com/user-attachments/assets/75adb9ed-5620-4e29-ac5c-203553ac9c12" />
