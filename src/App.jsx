import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/route.jsx";
import ServerStatus from "./components/ServerStatus.jsx";
import TopProgress from "./components/TopProgress.jsx";
import { setUnauthorizedHandler } from "./api/config";

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setUnauthorizedHandler(() => navigate("/login", { replace: true }));
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  return (
    <div className={`app${pathname.startsWith("/app") ? " app--workspace" : ""}`}>
      <TopProgress />
      <ServerStatus />
      <div className="app-body">
        <AppRoutes />
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={2600}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        limit={3}
      />
    </div>
  );
}