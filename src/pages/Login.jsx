import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Field from "../components/auth/Field";
import { loginUser } from "../api/auth";
import { setAuth } from "../lib/session";
import useStartDemo from "../hooks/useStartDemo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const { start: startGuest, loading: demoLoading, slow } = useStartDemo();
  const busy = loading || demoLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const cleanEmail = email.trim();
    const next = {};
    if (!cleanEmail) next.email = "Enter your email address.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    setLoading(true);
    const result = await loginUser({ email: cleanEmail, password });
    setLoading(false);
    if (result?.success && result?.token) {
      setAuth({ token: result.token, user: result.user });
      toast.success("Logged in");
      navigate("/app", { replace: true });
    } else {
      setFormError(result?.message || "Login failed. Please try again.");
    }
  };

  const handleDemo = () => {
    if (busy) return;
    setFormError("");
    startGuest();
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-sub">Log in to continue to your documents.</p>

      <form onSubmit={handleSubmit} noValidate>
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {loading && <Loader2 size={16} className="spin" aria-hidden="true" />}
          {loading ? "Logging in\u2026" : "Log in"}
        </button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <button
        type="button"
        className="btn btn-secondary btn-block btn-lg"
        onClick={handleDemo}
        disabled={busy}
      >
        {demoLoading && <Loader2 size={16} className="spin" aria-hidden="true" />}
        {demoLoading ? "Starting demo\u2026" : "Try the demo \u2014 no sign-up"}
      </button>
      <p className="helper" role="status">
        {slow ? "Waking up the server\u2026" : "Ask 3 questions about real documents \u2014 or upload your own PDF"}
      </p>

      <p className="auth-switch">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  );
}