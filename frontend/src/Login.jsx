
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (
      !normalizedEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to sign in. Please try again.",
        );
      }

      if (!result.data?.token || !result.data?.user) {
        throw new Error("The server returned an unexpected response.");
      }

      const { token, user } = result.data;

      if (!["student", "recruiter", "admin"].includes(user.role)) {
        throw new Error("Your account has an unsupported role.");
      }

      signIn({ token, user });
      setPassword("");

      const dashboardRoutes = {
        student: "/student",
        recruiter: "/recruiter",
        admin: "/admin",
      };

      navigate(dashboardRoutes[user.role], { replace: true });
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
      <section className="login-card" aria-labelledby="login-heading">
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

        <p className="eyebrow login-eyebrow">WELCOME BACK</p>
        <h1 id="login-heading">Sign in to CPRMP</h1>
        <p className="login-description">
          Access your campus placement workspace.
        </p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              required
              disabled={loading}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              required
              disabled={loading}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          {error && (
            <p
              className="login-message login-error"
              id="login-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="login-note">
          Use the email address associated with your CPRMP account.
        </p>

        <p className="login-note">
          New to CPRMP? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
