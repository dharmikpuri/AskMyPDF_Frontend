import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Labelled input with inline error/hint and (for passwords) a show/hide toggle. */
export default function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  hint,
  ...inputProps
}) {
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="input-wrap">
        <input
          id={id}
          className={`input${error ? " input-invalid" : ""}${isPassword ? " input-has-action" : ""}`}
          type={isPassword && shown ? "text" : type}
          value={value}
          onChange={onChange}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            className="input-action"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? "Hide password" : "Show password"}
            aria-pressed={shown}
          >
            {shown ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <div className="field-hint" id={`${id}-hint`}>
            {hint}
          </div>
        )
      )}
    </div>
  );
}
