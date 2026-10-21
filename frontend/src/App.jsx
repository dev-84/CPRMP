import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useCallback, useState } from 'react'
import LoadingScreen from './components/LoadingScreen.jsx'
import './App.css'
import Login from './Login.jsx'
import Registration from './Registration.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleDashboard from './pages/RoleDashboard.jsx'
import StudentProfile from './pages/StudentProfile.jsx'
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ProfileOverview from "./pages/ProfileOverview";
import EditProfile from "./pages/EditProfile";
import ResumeManagement from "./pages/ResumeManagement";
import PlacementDrives from "./pages/PlacementDrives";
import DriveDetailsApply from "./pages/DriveDetailsApply.jsx";
import ApplicationSubmission from "./pages/ApplicationSubmission.jsx";
import ApplicationSubmitted from "./pages/ApplicationSubmitted.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import ApplicationTracking from "./pages/ApplicationTracking.jsx";
import AIResumeMatching from "./pages/AIResumeMatching.jsx";
import PlacementHistory from "./pages/PlacementHistory.jsx";


const roles = [
  {
    number: '01',
    title: 'Students',
    label: 'FOR STUDENTS',
    description:
      'Create your placement profile, explore opportunities, check eligibility, and track your applications from one place.',
    features: ['Placement profile', 'Eligible drives', 'Application tracking'],
    icon: '◉',
  },
  {
    number: '02',
    title: 'Placement Officers',
    label: 'FOR COLLEGES',
    description:
      'Organize student information, coordinate recruitment drives, manage eligibility criteria, and monitor placement activities.',
    features: ['Student records', 'Drive management', 'Placement overview'],
    icon: '▤',
  },
  {
    number: '03',
    title: 'Recruiters',
    label: 'FOR COMPANIES',
    description:
      'Coordinate campus recruitment, review eligible applicants, and manage recruitment progress through a centralized portal.',
    features: ['Applicant review', 'Recruitment workflow', 'Selection tracking'],
    icon: '⌘',
  },
]

const demoDrives = [
  {
    company: 'Technology & Software',
    type: 'SOFTWARE ROLES',
    title: 'Software Developer',
    description:
      'A sample placement opportunity for students interested in software development.',
    skills: ['Programming', 'Problem solving', 'Databases'],
    status: 'DEMO OPPORTUNITY',
    symbol: '</>',
  },
  {
    company: 'Data & Analytics',
    type: 'DATA ROLES',
    title: 'Data Analyst',
    description:
      'A sample opportunity focused on working with data, reports, and analytical insights.',
    skills: ['SQL', 'Data analysis', 'Communication'],
    status: 'DEMO OPPORTUNITY',
    symbol: '▥',
  },
  {
    company: 'Product & Design',
    type: 'DESIGN ROLES',
    title: 'UI/UX Designer',
    description:
      'A sample opportunity for students interested in user experience and interface design.',
    skills: ['UI design', 'Prototyping', 'Research'],
    status: 'DEMO OPPORTUNITY',
    symbol: '✳',
  },
]

function Brand({ footer = false }) {
  return (
    <Link
      className={footer ? 'brand brand-footer' : 'brand'}
      to="/"
      aria-label="CPRMP home"
    >
      <img
        className="brand-logo"
        src="/CPRMP/logo.png"
        alt=""
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
      <span className="brand-copy">
        <strong>CPRMP</strong>
        <small>Campus Placement &amp; Recruitment</small>
      </span>
    </Link>
  )
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-shell public-home">
      <header className="site-header">
        <Brand />

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav
          className={`main-navigation${menuOpen ? ' navigation-open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#opportunities" onClick={closeMenu}>Opportunities</a>
          <a href="#roles" onClick={closeMenu}>Who it is for</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <Link className="nav-text-link" to="/login" onClick={closeMenu}>
            Sign in
          </Link>
          <Link
            className="nav-register"
            to="/login"
            onClick={closeMenu}
          >
            Get started <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero hero-modern" id="home">
          <div className="hero-copy">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              CAMPUS PLACEMENT &amp; RECRUITMENT PORTAL
            </div>

            <h1>
              One placement cycle.
              <span> One central platform.</span>
            </h1>

            <p className="hero-description">
              Connecting students, colleges, and recruiters through a
              centralized placement management experience. Organize
              opportunities, simplify coordination, and keep the recruitment
              journey moving.
            </p>

            <div className="hero-actions">
              <Link className="primary-link" to="/login">
                Get started <span aria-hidden="true">→</span>
              </Link>
              <a className="secondary-link" href="#opportunities">
                Explore opportunities <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="hero-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>
                  <strong>Clearer workflows</strong>
                  <small>Organized placement activities</small>
                </span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">↗</span>
                <span>
                  <strong>Connected stakeholders</strong>
                  <small>One shared platform</small>
                </span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">◎</span>
                <span>
                  <strong>Structured information</strong>
                  <small>Profiles, drives, and applications</small>
                </span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Illustrative placement dashboard preview">
            <div className="dashboard-window">
              <div className="dashboard-topbar">
                <div className="window-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="dashboard-window-title">CPRMP / OVERVIEW</span>
                <span className="demo-label">DEMO</span>
              </div>

              <div className="dashboard-body">
                <div className="dashboard-welcome">
                  <div>
                    <span className="dashboard-kicker">WORKSPACE PREVIEW</span>
                    <h2>Placement overview</h2>
                    <p>A sample view of the portal experience.</p>
                  </div>
                  <div className="dashboard-avatar">C</div>
                </div>

                <div className="dashboard-metrics">
                  <article className="metric-card">
                    <span className="metric-icon metric-blue">▤</span>
                    <span className="metric-caption">Placement drives</span>
                    <strong>—</strong>
                    <small>Connected data coming soon</small>
                  </article>
                  <article className="metric-card">
                    <span className="metric-icon metric-purple">◎</span>
                    <span className="metric-caption">Applications</span>
                    <strong>—</strong>
                    <small>Connected data coming soon</small>
                  </article>
                </div>

                <div className="dashboard-list-heading">
                  <div>
                    <h3>Opportunity preview</h3>
                    <p>Illustrative examples, not live vacancies</p>
                  </div>
                  <span className="preview-tag">SAMPLE</span>
                </div>

                <div className="preview-opportunity">
                  <div className="company-symbol symbol-blue">&lt;/&gt;</div>
                  <div className="preview-opportunity-copy">
                    <strong>Software Developer</strong>
                    <span>Technology &amp; Software</span>
                  </div>
                  <span className="preview-status">Example</span>
                </div>

                <div className="preview-opportunity">
                  <div className="company-symbol symbol-purple">▥</div>
                  <div className="preview-opportunity-copy">
                    <strong>Data Analyst</strong>
                    <span>Data &amp; Analytics</span>
                  </div>
                  <span className="preview-status">Example</span>
                </div>

                <div className="dashboard-bottom-note">
                  <span className="note-check">✓</span>
                  <span>
                    <strong>One connected placement journey</strong>
                    <small>Students · Colleges · Recruiters</small>
                  </span>
                </div>
              </div>
            </div>

            <div className="floating-note floating-note-top">
              <span className="floating-note-icon">✦</span>
              <span>
                <strong>One central platform</strong>
                <small>Built for collaboration</small>
              </span>
            </div>

            <div className="floating-note floating-note-bottom">
              <span className="floating-note-icon floating-note-green">✓</span>
              <span>
                <strong>Organized workflows</strong>
                <small>From profile to outcome</small>
              </span>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Portal capabilities">
          <span>DESIGNED FOR THE CAMPUS PLACEMENT JOURNEY</span>
          <div>
            <span>Student profiles</span>
            <i />
            <span>Placement drives</span>
            <i />
            <span>Eligibility workflows</span>
            <i />
            <span>Application tracking</span>
          </div>
        </section>

        <section className="roles-section roles-modern" id="roles">
          <div className="section-heading section-heading-modern">
            <span className="section-kicker">ONE PORTAL. THREE STAKEHOLDERS.</span>
            <h2>Everyone has a role in the journey.</h2>
            <p>
              Bring the key participants in campus recruitment into one
              organized digital workspace.
            </p>
          </div>

          <div className="role-grid">
            {roles.map((role) => (
              <article className="role-card role-card-modern" key={role.title}>
                <div className="role-card-top">
                  <span className="role-card-icon">{role.icon}</span>
                  <span className="role-number">{role.number}</span>
                </div>
                <span className="role-label">{role.label}</span>
                <h3>{role.title}</h3>
                <p>{role.description}</p>
                <ul className="role-feature-list">
                  {role.features.map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  className="role-card-link"
                  to="/login"
                  aria-label={`Sign in to access the ${role.title} workspace`}
                >
                  Access workspace <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="opportunities-section" id="opportunities">
          <div className="opportunities-heading">
            <div className="section-heading section-heading-left">
              <span className="section-kicker">EXPLORE CAREER PATHS</span>
              <h2>Opportunities start with a connection.</h2>
              <p>
                Preview example role categories that a placement portal can
                help students discover and prepare for.
              </p>
            </div>
            <span className="demo-notice">Illustrative examples only</span>
          </div>

          <div className="opportunity-grid">
            {demoDrives.map((drive) => (
              <article className="opportunity-card" key={drive.title}>
                <div className="opportunity-card-top">
                  <span className="company-symbol opportunity-symbol">
                    {drive.symbol}
                  </span>
                  <span className="opportunity-type">{drive.type}</span>
                </div>
                <span className="opportunity-company">{drive.company}</span>
                <h3>{drive.title}</h3>
                <p>{drive.description}</p>
                <div className="skill-tags">
                  {drive.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <div className="opportunity-card-bottom">
                  <span>{drive.status}</span>
                  <Link to="/login" aria-label={`Get started for ${drive.title}`}>
                    Learn more <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="opportunity-disclaimer">
            These are illustrative role examples, not verified job openings.
            Live placement drives can be displayed when the relevant backend
            functionality is implemented.
          </p>
        </section>

        <section className="about-section about-modern" id="about">
          <div className="about-visual" aria-hidden="true">
            <div className="about-orbit orbit-one" />
            <div className="about-orbit orbit-two" />
            <div className="about-center-mark">
              <span>CPRMP</span>
              <small>CONNECTED PLACEMENTS</small>
            </div>
            <div className="about-node about-node-student">
              <span>◉</span>
              <strong>Students</strong>
            </div>
            <div className="about-node about-node-college">
              <span>▤</span>
              <strong>Colleges</strong>
            </div>
            <div className="about-node about-node-recruiter">
              <span>⌘</span>
              <strong>Recruiters</strong>
            </div>
          </div>

          <div className="about-copy">
            <span className="section-kicker">A MORE CONNECTED PROCESS</span>
            <h2>Less fragmentation. More clarity.</h2>
            <p>
              Campus Placement and Recruitment Management Portal (CPRMP) is
              an MCA project designed to bring student profiles, placement
              drives, eligibility checks, applications, and recruitment
              outcomes into a structured workflow.
            </p>
            <div className="about-points">
              <div>
                <span>01</span>
                <p>
                  <strong>Centralized information</strong>
                  Keep placement-related information organized in one place.
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  <strong>Role-based workspaces</strong>
                  Give students, placement officers, and recruiters distinct
                  experiences.
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  <strong>Room to grow</strong>
                  Build toward eligibility tools, application tracking, and
                  future skill-matching features.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-decoration cta-decoration-one" />
          <div className="cta-decoration cta-decoration-two" />
          <div className="cta-content">
            <span className="cta-kicker">YOUR PLACEMENT JOURNEY STARTS HERE</span>
            <h2>Bring your placement journey into focus.</h2>
            <p>
              Create an account to get started with the CPRMP project portal.
            </p>
            <div className="cta-actions">
              <Link className="cta-primary" to="/register">
                Create your account <span aria-hidden="true">→</span>
              </Link>
              <Link className="cta-secondary" to="/login">
                Already registered? Sign in
              </Link>
            </div>
          </div>
          <div className="cta-mark" aria-hidden="true">C</div>
        </section>
      </main>

      <footer className="site-footer footer-modern">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Brand footer />
            <p>
              Connecting students, colleges, and recruiters through one
              campus placement management platform.
            </p>
          </div>

          <div className="footer-link-column">
            <h3>Explore</h3>
            <a href="#home">Home</a>
            <a href="#opportunities">Opportunities</a>
            <a href="#roles">Portal roles</a>
            <a href="#about">About CPRMP</a>
          </div>

          <div className="footer-link-column">
            <h3>Portal</h3>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
          </div>

          <div className="footer-project-note">
            <span className="footer-note-icon">i</span>
            <div>
              <strong>Academic project</strong>
              <p>
                CPRMP is being developed as an MCA mini project. Features and
                sample opportunities shown here are illustrative.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} CPRMP. Campus Placement and
            Recruitment Management Portal.
          </span>
          <a href="#home">Back to top ↑</a>
        </div>
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


function StudentFeaturePlaceholder({ title, description }) {
  return (
    <main style={{ maxWidth: "900px", margin: "60px auto", padding: "24px" }}>
      <p>CPRMP / Student Workspace</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>
        This section is currently under development. No live data is displayed
        on this page yet.
      </p>
      <Link to="/student">← Back to Student Dashboard</Link>
    </main>
  );
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeWithSplash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/profile" element={<ProfileOverview />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/edit-profile" element={<EditProfile />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/resume" element={<ResumeManagement />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/placement-drives" element={<PlacementDrives />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/drive-details" element={<DriveDetailsApply />} />

        <Route
          path="/student/drive-details/:id"
          element={<DriveDetailsApply />}
        />

        <Route
          path="/student/application-submission/:id"
          element={<DriveDetailsApply />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route
          path="/student/application-submission"
          element={<ApplicationSubmission />}
        />

        <Route
          path="/student/application-submission/:id"
          element={<ApplicationSubmission />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route
          path="/student/application-submitted"
          element={<ApplicationSubmitted />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/applications" element={<MyApplications />} />

        <Route
          path="/student/application-tracking/:id"
          element={<ApplicationTracking />}
        />

        <Route
          path="/student/application-submitted"
          element={<ApplicationSubmitted />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route
          path="/student/ai-resume-matching"
          element={<AIResumeMatching />}
        />
        <Route
          path="/student/ai-matching"
          element={<Navigate to="/student/ai-resume-matching" replace />}
        />
        <Route
          path="/student/drives"
          element={<Navigate to="/student/placement-drives" replace />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route
          path="/student/placement-history"
          element={<PlacementHistory />}
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
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

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
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
  );
}

export default App
