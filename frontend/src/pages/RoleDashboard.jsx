
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

function RoleDashboard({ title, description }) {
  const { user, signOut } = useAuth()

  function handleSignOut() {
    signOut()
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="dashboard-heading">
        <Link className="login-back-link" to="/">
          ← Back to home
        </Link>

        <p className="eyebrow login-eyebrow">CPRMP WORKSPACE</p>
        <h1 id="dashboard-heading">{title}</h1>
        <p className="login-description">{description}</p>

        <div className="login-success">
          <p>
            Welcome, <strong>{user?.name}</strong>.
          </p>
          <p>
            Signed in as <strong>{user?.role}</strong>.
          </p>
          <p className="login-note">
            This dashboard is a protected placeholder. Role-specific features
            will be implemented in later tasks.
          </p>
        </div>

        <button
          className="login-submit"
          type="button"
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </section>
    </main>
  )
}

export default RoleDashboard
