
import { useState } from 'react'

function Login({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loggedInUser, setLoggedInUser] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const normalizedEmail = email.trim()

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Unable to sign in. Please try again.')
      }

      if (!result.data?.token || !result.data?.user) {
        throw new Error('The server returned an unexpected response.')
      }

      // Keep the token in memory only for now.
      // Authentication state and secure persistence are handled in a later task.
      setLoggedInUser(result.data.user)
      setPassword('')
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? 'Cannot connect to the server. Check that the backend is running.'
          : requestError.message,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-heading">
        <button
          className="login-back-link"
          type="button"
          onClick={onBack}
        >
          ← Back to home
        </button>

        <a
          className="login-brand"
          href="#home"
          onClick={(event) => {
            event.preventDefault()
            onBack()
          }}
          aria-label="CPRMP home"
        >
          <span className="brand-mark">C</span>
          <span>
            <strong>CPRMP</strong>
            <small>Campus Placement Portal</small>
          </span>
        </a>

        {!loggedInUser ? (
          <>
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
                    setEmail(event.target.value)
                    setError('')
                  }}
                  required
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
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
                    setPassword(event.target.value)
                    setError('')
                  }}
                  required
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
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

              <button
                className="login-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="login-note">
              Use the email address associated with your CPRMP account.
            </p>
          </>
        ) : (
          <div className="login-success" role="status">
            <span className="success-icon" aria-hidden="true">✓</span>
            <p className="eyebrow login-eyebrow">SIGN-IN SUCCESSFUL</p>
            <h1 id="login-heading">Welcome, {loggedInUser.name}!</h1>
            <p>
              You signed in successfully as{' '}
              <strong>{loggedInUser.role}</strong>.
            </p>
            <p className="login-note">
              Your role-specific dashboard and persistent authentication
              will be connected in a later task.
            </p>
            <button
              className="login-submit"
              type="button"
              onClick={onBack}
            >
              Return to home
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Login
