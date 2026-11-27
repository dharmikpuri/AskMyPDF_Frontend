import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import PrivateRoute from "./PrivateRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<PrivateRoute />}>
        <Route path="/app" element={<Home />} />
      </Route>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      {/* Old typo'd path kept as a redirect for existing links. */}
      <Route path="/singup" element={<Navigate to="/signup" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}