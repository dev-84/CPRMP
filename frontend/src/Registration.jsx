import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();

    if (normalizedName.length < 2 || normalizedName.length > 100) {
      setError("Name must contain 2 to 100 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (new TextEncoder().encode(password).length > 72) {
      setError("Password must not exceed 72 UTF-8 bytes.");
      return;
    }

    if (!["student", "recruiter"].includes(role)) {
      setError("Please select Student or Recruiter.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const validationMessage = result.errors
          ?.map((item) => item.message)
          .filter(Boolean)
          .join(". ");

        throw new Error(
          validationMessage ||
            result.message ||
            "Unable to create your account. Please try again.",
        );
      }

      if (!result.data?.user) {
        throw new Error("The server returned an unexpected response.");
      }

      setPassword("");
      setSuccess(
        `Account created successfully for ${result.data.user.email}. You can now sign in.`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Cannot connect to the server. Check that the backend is running."
          : requestError.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="registration-heading">
        <Link className="login-back-link" to="/">
          ← Back to home
        </Link>

        <Link className="login-brand" to="/" aria-label="CPRMP home">
          <span className="brand-mark">C</span>
          <span>
            <strong>CPRMP</strong>
            <small>Campus Placement Portal</small>
          </span>
        </Link>

        <p className="eyebrow login-eyebrow">JOIN CPRMP</p>
        <h1 id="registration-heading">Create your account</h1>
        <p className="login-description">
          Register to access your campus placement workspace.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
                setSuccess("");
              }}
              minLength={2}
              maxLength={100}
              required
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
                setSuccess("");
              }}
              required
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
                setSuccess("");
              }}
              minLength={8}
              required
              disabled={loading}
            />
          </div>

          <div className="login-field">
            <label htmlFor="register-role">Account type</label>
            <select
              id="register-role"
              name="role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setError("");
                setSuccess("");
              }}
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {error && (
            <p className="login-message login-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <div className="login-message login-success-message" role="status">
              <p>{success}</p>
              <button
                className="login-back-link"
                type="button"
                onClick={() => navigate("/login")}
              >
                Go to sign in
              </button>
            </div>
          )}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="login-note">
          Already have an account?{" "}
          <Link className="login-back-link" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Registration;
