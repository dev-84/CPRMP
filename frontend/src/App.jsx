import { useState } from "react";
import "./App.css";
import Login from "./Login.jsx";
import Registration from "./Registration.jsx";

const roles = [
  {
    title: "Student",
    description:
      "Build your placement profile, review eligible drives, and track your applications.",
    label: "For students",
  },
  {
    title: "Placement Officer",
    description:
      "Manage student records, recruitment drives, eligibility rules, and placement progress.",
    label: "For administrators",
  },
  {
    title: "Recruiter",
    description:
      "Explore eligible applicants, manage recruitment activities, and update selection outcomes.",
    label: "For recruiters",
  },
];

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  if (showLogin) {
  return (
    <Login
      onBack={() => setShowLogin(false)}
      onRegister={() => {
        setShowLogin(false)
        setShowRegistration(true)
      }}
    />
  )
}

  if (showRegistration) {
    return (
      <Registration
        onBack={() => setShowRegistration(false)}
        onSignIn={() => {
          setShowRegistration(false);
          setShowLogin(true);
        }}
      />
    );
  }

  return (
    <div className="app-shell bg-page text-text">
      <header className="site-header">
        <a className="brand" href="/" aria-label="CPRMP home">
          <span className="brand-mark">C</span>
          <span>
            <strong>CPRMP</strong>
            <small>Campus Placement Portal</small>
          </span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#roles">Portal roles</a>
          <a href="#about">About</a>
          <button
            className="nav-login"
            type="button"
            onClick={() => setShowLogin(true)}
          >
            Sign in
          </button>
          <button
            className="nav-login"
            type="button"
            onClick={() => setShowRegistration(true)}
          >
            Create account
          </button>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">CAMPUS PLACEMENT & RECRUITMENT</p>
          <h1>
            Your next opportunity
            <span> starts here.</span>
          </h1>
          <p className="hero-description">
            A central place for students, placement officers, and recruiters to
            coordinate campus recruitment and placement activities.
          </p>
          <a className="primary-link" href="#roles">
            Explore the portal <span aria-hidden="true">→</span>
          </a>
        </section>

        <section className="roles-section" id="roles">
          <div className="section-heading">
            <p className="eyebrow">ONE PORTAL, THREE ROLES</p>
            <h2>Choose your workspace</h2>
            <p>
              Each role supports a different part of the campus placement
              process.
            </p>
          </div>

          <div className="role-grid">
            {roles.map((role) => (
              <article className="role-card" key={role.title}>
                <span className="role-label">{role.label}</span>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <span className="coming-soon">
                  Access will be available later
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="about">
          <h2>Placement management, made clearer.</h2>
          <p>
            CPRMP is being developed to organize student profiles, placement
            drives, eligibility checks, applications, and recruitment outcomes
            in one system.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <span>CPRMP</span>
        <span>Campus Placement and Recruitment Management Portal</span>
      </footer>
    </div>
  );
}

export default App;
