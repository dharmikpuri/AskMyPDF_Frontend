import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/auth.css";
import "./styles/home.css";
import "./styles/landing.css";
import App from "./App.jsx";
import { migrateLegacySession } from "./lib/session";

migrateLegacySession();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
