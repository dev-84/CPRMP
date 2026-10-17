import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useCallback, useState } from 'react'
import LoadingScreen from './components/LoadingScreen.jsx'
import './App.css'
import Login from './Login.jsx'
import Registration from './Registration.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleDashboard from './pages/RoleDashboard.jsx'

const roles = [
  {
    title: 'Student',
    description:
      'Build your placement profile, review eligible drives, and track your applications.',
    label: 'For students',
  },
  {
    title: 'Placement Officer',
    description:
      'Manage student records, recruitment drives, eligibility rules, and placement progress.',
    label: 'For administrators',
  },
  {
    title: 'Recruiter',
    description:
      'Explore eligible applicants, manage recruitment activities, and update selection outcomes.',
    label: 'For recruiters',
  },
]

function Home() {
  return (
    <div className="app-shell bg-page text-text">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="CPRMP home">
          <span className="brand-mark">C</span>
          <span>
            <strong>CPRMP</strong>
            <small>Campus Placement Portal</small>
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#roles">Portal roles</a>
          <a href="#about">About</a>
          <Link className="nav-login" to="/login">
            Sign in
          </Link>
          <Link className="nav-login" to="/register">
            Create account
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <p className="eyebrow">CAMPUS PLACEMENT &amp; RECRUITMENT</p>
          <h1>
            Your next opportunity
            <span> starts here.</span>
          </h1>
          <p className="hero-description">
            A central place for students, placement officers, and recruiters
            to coordinate campus recruitment and placement activities.
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
                  Sign in to access your workspace
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
  )
}

function HomeWithSplash() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />
  }

  return <Home />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeWithSplash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route
          path="/student"
          element={
            <RoleDashboard
              title="Student Dashboard"
              description="Manage your placement profile and track your applications."
            />
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
        <Route
          path="/recruiter"
          element={
            <RoleDashboard
              title="Recruiter Dashboard"
              description="Manage recruitment activities and review applicants."
            />
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route
          path="/admin"
          element={
            <RoleDashboard
              title="Admin Dashboard"
              description="Manage placement operations and recruitment drives."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
