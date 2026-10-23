import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth.js";

const roleOptions = [
  {
    id: "student",
    label: "Student",
    icon: "♙",
    fieldLabel: "College Email Address",
    placeholder: "you@college.edu",
    helperTitle: "Student Gateway",
    helperText:
      "Sign in using the email address associated with your student account.",
  },
  {
    id: "admin",
    label: "Admin / TPO",
    icon: "♜",
    fieldLabel: "Administrator Email",
    placeholder: "tpo@college.edu",
    helperTitle: "Placement Officer Gateway",
    helperText:
      "Use your authorized placement officer or administrator account.",
  },
  {
    id: "recruiter",
    label: "Recruiter",
    icon: "▤",
    fieldLabel: "Corporate Email Address",
    placeholder: "you@company.com",
    helperTitle: "Recruiter Gateway",
    helperText:
      "Sign in using the email address registered with your recruiter account.",
  },
];

const roleNames = {
  student: "Student",
  admin: "Admin / TPO",
  recruiter: "Recruiter",
};

const dashboardRoutes = {
  student: "/student",
  recruiter: "/recruiter",
  admin: "/admin",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const registrationSuccess = location.state?.registrationSuccess;

  const activeRole = roleOptions.find((role) => role.id === selectedRole);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
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

      let result = null;
      try {
        result = await response.json();
      } catch {
        if (!response.ok) {
          throw new Error("Cannot connect to the server. Check that the backend is running on port 5000.");
        }
        throw new Error("Unable to parse server response.");
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Unable to sign in. Please try again.",
        );
      }

      if (!result.data?.token || !result.data?.user) {
        throw new Error("The server returned an unexpected response.");
      }

      const { token, user } = result.data;

      if (!Object.hasOwn(dashboardRoutes, user.role)) {
        throw new Error("Your account has an unsupported role.");
      }

      if (user.role !== selectedRole) {
        throw new Error(
          `This account is registered as ${roleNames[user.role]}. Please select the correct role and try again.`,
        );
      }

      signIn({ token, user });
      setPassword("");

      const defaultRoute = dashboardRoutes[user.role];
      const requestedPath = location.state?.from?.pathname;

      const allowedPrefix = defaultRoute;
      const isCompatibleRequestedPath =
        typeof requestedPath === "string" &&
        (requestedPath === allowedPrefix ||
          requestedPath.startsWith(`${allowedPrefix}/`));

      navigate(isCompatibleRequestedPath ? requestedPath : defaultRoute, {
        replace: true,
      });

    } catch (requestError) {
      const isConnectionError =
        requestError instanceof TypeError ||
        (requestError.message &&
          (requestError.message.includes("fetch") ||
            requestError.message.includes("Unexpected end of JSON") ||
            requestError.message.includes("Failed to execute 'json'")));

      setError(
        isConnectionError
          ? "Cannot connect to the server. Check that the backend is running."
          : requestError.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-utility-bar">
          <Link to="/" className="login-utility-brand">
            <span className="login-brand-symbol">C</span>
            <span>CPRMP ACCESS</span>
          </Link>

          <span className="login-security-note">
            <span className="login-status-dot" />
            Secure account access
          </span>
        </div>

        <section className="login-card" aria-labelledby="login-heading">
          <div className="login-main-panel">
            <Link to="/" className="login-back-link">
              <span aria-hidden="true">←</span> Back to home
            </Link>

            <div className="login-brand">
              <div className="login-brand-icon" aria-hidden="true">
                <img
                  src="/cprmp-logo.png"
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <span>C</span>
              </div>

              <div>
                <strong>CPRMP</strong>
                <small>Campus Placement &amp; Recruitment</small>
              </div>
            </div>

            <div className="login-heading-block">
              <p className="login-eyebrow">YOUR WORKSPACE AWAITS</p>
              <h1 id="login-heading">Sign in to CPRMP</h1>
              <p className="login-description">
                Select your account role to continue to your placement
                workspace.
              </p>
            </div>

            <div className="login-role-section">
              <span className="login-section-label">
                Select your account role
              </span>

              <div
                className="login-role-selector"
                role="group"
                aria-label="Account role"
              >
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={`login-role-button ${
                      selectedRole === role.id ? "is-active" : ""
                    }`}
                    aria-pressed={selectedRole === role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setError("");
                    }}
                    disabled={loading}
                  >
                    <span aria-hidden="true">{role.icon}</span>
                    <span>{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="login-role-helper" aria-live="polite">
              <span className="login-helper-icon" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>{activeRole.helperTitle}</strong>
                <p>{activeRole.helperText}</p>
              </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="login-email">
                  {activeRole.fieldLabel} <span>*</span>
                </label>

                <div className="login-input-wrap">
                  <span aria-hidden="true" className="login-input-icon">
                    @
                  </span>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    placeholder={activeRole.placeholder}
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
              </div>

              <div className="login-field">
                <div className="login-password-label">
                  <label htmlFor="login-password">
                    Password <span>*</span>
                  </label>
                </div>

                <div className="login-input-wrap">
                  <span aria-hidden="true" className="login-input-icon">
                    ◆
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
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

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
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
                <span>
                  {loading
                    ? "Signing in..."
                    : `Sign in as ${roleNames[selectedRole]}`}
                </span>
                <span aria-hidden="true">{loading ? "…" : "→"}</span>
              </button>
            </form>

            <div className="login-register-footer">
              <p>
                New to CPRMP? <Link to="/register">Create an account</Link>
              </p>
              <p className="login-registration-note">
                Student and recruiter registration available.
              </p>
            </div>

            <div className="login-panel-footer">
              <span>CPRMP · Academic Project</span>
              <Link to="/">Return to website ↑</Link>
            </div>
          </div>

          <aside className="login-info-panel">
            <div className="login-info-decoration" aria-hidden="true">
              C
            </div>

            <div className="login-info-content">
              <span className="login-info-badge">
                <span className="login-status-dot" />
                ONE CONNECTED WORKSPACE
              </span>

              <p className="login-info-kicker">
                CAMPUS PLACEMENT &amp; RECRUITMENT
              </p>

              <h2>Your next opportunity starts with a clearer process.</h2>

              <p className="login-info-description">
                Bring student profiles, placement drives, applications, and
                recruitment activities into one organized portal.
              </p>

              <div className="login-info-metrics">
                <div className="login-info-metric">
                  <span className="login-metric-icon">01</span>
                  <div>
                    <strong>Student profiles</strong>
                    <span>Organized candidate information</span>
                  </div>
                </div>

                <div className="login-info-metric">
                  <span className="login-metric-icon">02</span>
                  <div>
                    <strong>Placement drives</strong>
                    <span>Structured recruitment activities</span>
                  </div>
                </div>

                <div className="login-info-metric">
                  <span className="login-metric-icon">03</span>
                  <div>
                    <strong>Application tracking</strong>
                    <span>A clearer recruitment journey</span>
                  </div>
                </div>
              </div>

              <div className="login-info-preview">
                <div className="login-preview-top">
                  <span className="login-preview-indicator">
                    WORKSPACE PREVIEW
                  </span>
                  <span className="login-preview-label">DEMO</span>
                </div>

                <h3>Placement overview</h3>
                <p>
                  A preview of the information CPRMP is designed to organize.
                </p>

                <div className="login-preview-row">
                  <span>Placement drives</span>
                  <strong>—</strong>
                </div>
                <div className="login-preview-row">
                  <span>Applications</span>
                  <strong>—</strong>
                </div>

                <small>
                  Illustrative interface. Live data is not connected here.
                </small>
              </div>
            </div>

            <div className="login-info-footer">
              <span>Designed for connected placements</span>
              <span>CPRMP</span>
            </div>
          </aside>
        </section>

        <p className="login-help-note">
          Having trouble signing in? Contact your institution's placement team
          for account assistance.
        </p>
      </div>
    </main>
  );
}

export default Login;
