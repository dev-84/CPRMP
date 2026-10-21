import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialStudent = {
  name: "",
  email: "",
  personalEmail: "",
  mobile: "",
  college: "",
  department: "",
  course: "MCA",
  graduationYear: "",
  gender: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const initialRecruiter = {
  name: "",
  email: "",
  mobile: "",
  company: "",
  designation: "",
  website: "",
  industry: "",
  description: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

function Registration() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [student, setStudent] = useState(initialStudent);
  const [recruiter, setRecruiter] = useState(initialRecruiter);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = role === "student" ? student : recruiter;
  const setForm = role === "student" ? setStudent : setRecruiter;

  function changeRole(nextRole) {
    setRole(nextRole);
    setErrors({});
    setSuccess("");
    setShowPassword(false);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      confirmPassword: "",
      form: "",
    }));

    setSuccess("");
  }

  function validate() {
    const nextErrors = {};
    const email = form.email.trim();
    const password = form.password;

    if (form.name.trim().length < 2) {
      nextErrors.name = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (password.length < 8) {
      nextErrors.password = "Password must contain at least 8 characters.";
    } else if (new TextEncoder().encode(password).length > 72) {
      nextErrors.password = "Password exceeds the 72-byte limit.";
    }

    if (password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (role === "student") {
      if (!form.college.trim()) {
        nextErrors.college = "Enter your college name.";
      }

      if (!form.department.trim()) {
        nextErrors.department = "Enter your department or branch.";
      }

      if (!form.graduationYear) {
        nextErrors.graduationYear = "Select your graduation year.";
      }

      if (
        form.personalEmail &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalEmail.trim())
      ) {
        nextErrors.personalEmail = "Enter a valid personal email.";
      }
    } else {
      if (!form.company.trim()) {
        nextErrors.company = "Enter your company name.";
      }

      if (!form.designation.trim()) {
        nextErrors.designation = "Enter your job title.";
      }

      if (!form.industry) {
        nextErrors.industry = "Select your company industry.";
      }

      if (form.website && !/^https?:\/\/.+\..+/.test(form.website.trim())) {
        nextErrors.website =
          "Enter a valid URL starting with http:// or https://.";
      }
    }

    if (!form.terms) {
      nextErrors.terms = "You must accept the terms to continue.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccess("");

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role,
        ...(role === "student"
          ? {
              personalEmail: form.personalEmail.trim(),
              mobile: form.mobile,
              college: form.college.trim(),
              department: form.department.trim(),
              course: form.course,
              graduationYear: Number(form.graduationYear),
              gender: form.gender,
            }
          : {
              mobile: form.mobile,
              company: form.company.trim(),
              designation: form.designation.trim(),
              website: form.website.trim(),
              industry: form.industry,
              description: form.description.trim(),
            }),
      };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result.errors
          ?.map((item) => item.message)
          .filter(Boolean)
          .join(". ");

        throw new Error(
          message ||
            result.message ||
            "Unable to create your account. Please try again.",
        );
      }

      if (!result.data?.user) {
        throw new Error("The server returned an unexpected response.");
      }

      // Registration succeeded on the server.
      // Clear password fields before navigating to login.
      setForm((previous) => ({
        ...previous,
        password: "",
        confirmPassword: "",
      }));

      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess:
            role === "recruiter"
              ? "Registration successful. Recruiter approval may be required."
              : "Registration successful. You can now sign in.",
        },
      });
    } catch (error) {
      setErrors({
        form:
          error instanceof TypeError
            ? "Cannot connect to the server. Check your backend and API configuration."
            : error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  function field(label, name, options = {}) {
    const {
      type = "text",
      placeholder = "",
      required = true,
      autoComplete,
    } = options;

    return (
      <div className="login-field" key={name}>
        <label htmlFor={`register-${name}`}>
          {label}
          {required ? " *" : ""}
        </label>

        <input
          id={`register-${name}`}
          name={name}
          type={type}
          value={form[name] ?? ""}
          placeholder={placeholder}
          onChange={updateField}
          autoComplete={autoComplete}
          required={required}
          disabled={loading}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
        />

        {errors[name] && (
          <p className="field-error" id={`error-${name}`} role="alert">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }

  function selectField(label, name, options) {
    return (
      <div className="login-field" key={name}>
        <label htmlFor={`register-${name}`}>{label} *</label>

        <select
          id={`register-${name}`}
          name={name}
          value={form[name]}
          onChange={updateField}
          required
          disabled={loading}
          aria-invalid={Boolean(errors[name])}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {errors[name] && (
          <p className="field-error" role="alert">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }

  return (
    <main className="login-page registration-page">
      <section className="login-card registration-card">
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

        <div
          className="registration-role-tabs"
          role="group"
          aria-label="Choose registration type"
        >
          <button
            type="button"
            className={role === "student" ? "selected" : ""}
            aria-pressed={role === "student"}
            onClick={() => changeRole("student")}
            disabled={loading}
          >
            Student
          </button>

          <button
            type="button"
            className={role === "recruiter" ? "selected" : ""}
            aria-pressed={role === "recruiter"}
            onClick={() => changeRole("recruiter")}
            disabled={loading}
          >
            Recruiter
          </button>
        </div>

        <h2 className="registration-form-title">
          {role === "student" ? "Student details" : "Recruiter details"}
        </h2>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="registration-fields">
            {field("Full name", "name", {
              placeholder: "Enter your full name",
              autoComplete: "name",
            })}

            {field(
              role === "student" ? "College email" : "Official work email",
              "email",
              {
                type: "email",
                placeholder:
                  role === "student" ? "you@college.edu" : "you@company.com",
                autoComplete: "email",
              },
            )}

            {field("Mobile number", "mobile", {
              type: "tel",
              placeholder: "10-digit mobile number",
              autoComplete: "tel",
            })}

            {role === "student" ? (
              <>
                {field("Personal email", "personalEmail", {
                  type: "email",
                  placeholder: "Personal email (optional)",
                  required: false,
                })}

                {field("College name", "college", {
                  placeholder: "Enter your college name",
                })}

                {field("Department / Branch", "department", {
                  placeholder: "e.g. Computer Science",
                })}

                {selectField("Course", "course", [
                  { value: "MCA", label: "MCA" },
                  { value: "MSc IT", label: "MSc IT" },
                  { value: "CA", label: "CA" },
                  { value: "CE", label: "Computer Engineering (CE)" },
                  { value: "IT", label: "Information Technology (IT)" },
                  { value: "AI/ML", label: "AI / ML" },
                ])}

                {selectField("Graduation year", "graduationYear", [
                  { value: "", label: "Select graduation year" },
                  ...Array.from({ length: 7 }, (_, index) => {
                    const year = new Date().getFullYear() + index;
                    return { value: String(year), label: String(year) };
                  }),
                ])}

                {selectField("Gender (optional)", "gender", [
                  { value: "", label: "Prefer not to say" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ])}
              </>
            ) : (
              <>
                {field("Company name", "company", {
                  placeholder: "Enter your company name",
                })}

                {field("Job title / Designation", "designation", {
                  placeholder: "e.g. Talent Acquisition Manager",
                })}

                {field("Company website", "website", {
                  type: "url",
                  placeholder: "https://company.com (optional)",
                  required: false,
                })}

                {selectField("Company industry", "industry", [
                  { value: "", label: "Select industry" },
                  { value: "IT", label: "IT & Software" },
                  { value: "Finance", label: "Finance & Banking" },
                  { value: "Education", label: "Education" },
                  { value: "Healthcare", label: "Healthcare" },
                  { value: "Manufacturing", label: "Manufacturing" },
                  { value: "Other", label: "Other" },
                ])}

                <div className="login-field">
                  <label htmlFor="register-description">
                    Company description (optional)
                  </label>
                  <textarea
                    id="register-description"
                    name="description"
                    value={form.description}
                    onChange={updateField}
                    rows={3}
                    maxLength={1000}
                    placeholder="Briefly describe your company"
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <div className="login-field">
              <label htmlFor="register-password">Password *</label>
              <div className="password-input-wrap">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={updateField}
                  minLength={8}
                  required
                  disabled={loading}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="field-error" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {field("Confirm password", "confirmPassword", {
              type: "password",
              placeholder: "Re-enter your password",
              autoComplete: "new-password",
            })}

            {errors.confirmPassword && (
              <p className="field-error" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <label className="registration-terms">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={updateField}
              disabled={loading}
            />
            <span>I accept the terms and conditions.</span>
          </label>

          {errors.terms && (
            <p className="field-error" role="alert">
              {errors.terms}
            </p>
          )}

          {errors.form && (
            <p className="login-message login-error" role="alert">
              {errors.form}
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
