import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Check, Loader2 } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout";
import Field from "../components/auth/Field";
import { signupUser } from "../api/auth";
import { setAuth } from "../lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the server rules: name 1-60, valid email, password 8-128.
const validate = ({ name, email, password }) => {
  const errors = {};
  if (!name) errors.name = "Enter your name.";
  else if (name.length > 60) errors.name = "Name must be 60 characters or fewer.";
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Choose a password.";
  else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  else if (password.length > 128) errors.password = "Password must be 128 characters or fewer.";
  return errors;
};

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const longEnough = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const values = { name: name.trim(), email: email.trim(), password };
    const found = validate(values);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) return;

    setLoading(true);
    const result = await signupUser(values);
    setLoading(false);
    if (result?.success && result?.token) {
      setAuth({ token: result.token, user: result.user });
      toast.success("Account created");
      navigate("/app", { replace: true });
    } else if (result?.code === "EMAIL_TAKEN") {
      setErrors({ email: result.message || "An account with this email already exists." });
    } else {
      setFormError(result?.message || "Signup failed. Please try again.");
    }
  };

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <AuthLayout>
      <h2 className="auth-title">Create your account</h2>
      <p className="auth-sub">Upload your own PDFs and keep your chat history.</p>

      <form onSubmit={handleSubmit} noValidate>
        <Field
          id="name"
          label="Name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          maxLength={60}
          onChange={(e) => {
            setName(e.target.value);
            clearError("name");
          }}
          error={errors.name}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError("email");
          }}
          error={errors.email}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          maxLength={128}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError("password");
          }}
          error={errors.password}
          hint={
            <span className={`hint-rule${longEnough ? " hint-rule-ok" : ""}`}>
              <Check size={14} aria-hidden="true" /> At least 8 characters
            </span>
          }
        />

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading && <Loader2 size={16} className="spin" aria-hidden="true" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
