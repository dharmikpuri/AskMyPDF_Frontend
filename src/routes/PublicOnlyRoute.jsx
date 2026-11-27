import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../lib/session";

/** /login and /signup bounce to the app when a session already exists. */
export default function PublicOnlyRoute() {
  return getToken() ? <Navigate to="/app" replace /> : <Outlet />;
}