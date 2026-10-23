
import { useEffect, useState } from 'react'

const stages = [
  { progress: 18, message: 'Initializing placement portal environment...' },
  { progress: 26, message: 'Preparing the portal experience...' },
  { progress: 48, message: 'Loading recruitment drives and schedules...' },
  { progress: 74, message: 'Preparing student and recruiter workspaces...' },
  { progress: 92, message: 'Finalizing portal resources...' },
  { progress: 100, message: 'Environment ready. Welcome to CPRMP!' },
]

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(stages[0].progress)
  const [message, setMessage] = useState(stages[0].message)

  useEffect(() => {
    const timers = []

    stages.slice(1).forEach((stage, index) => {
      const delay = stages
        .slice(1, index + 1)
        .reduce((total, _, i) => total + (i === 0 ? 750 : 800), 0)

      const timer = setTimeout(() => {
        setProgress(stage.progress)
        setMessage(stage.message)

        if (stage.progress === 100) {
          const completionTimer = setTimeout(onComplete, 900)
          timers.push(completionTimer)
        }
      }, delay)

      timers.push(timer)
    })

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <main className="splash-screen" aria-label="Loading CPRMP">
      <div className="splash-glow splash-glow-left" aria-hidden="true" />
      <div className="splash-glow splash-glow-right" aria-hidden="true" />

      <section className="splash-card">
        <div className="splash-status-row">
          <span className="splash-status">
            <span className="splash-status-dot" />
            Portal initialization
          </span>

          <span className="splash-security">
            <span aria-hidden="true">✓</span> Secure portal access
          </span>
        </div>

        <div className="splash-brand">
          <img
            className="splash-logo-image"
            src="/cprmp-logo.png"
            alt="CPRMP Campus Placement Portal"
          />

          <h1>Campus Placement and Recruitment Management Portal</h1>

          <p className="splash-tagline">
            Connecting Students, Colleges, and Recruiters — One Placement Cycle,
            One Platform.
          </p>
        </div>

        <div
          className="splash-loading"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="splash-progress-heading">
            <span className="splash-message">
              <span className="splash-message-dot" />
              {message}
            </span>

            <span className="splash-percentage">{progress}%</span>
          </div>

          <div
            className="splash-progress-track"
            role="progressbar"
            aria-label="Portal loading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="splash-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="splash-telemetry">
            <span>◈ Student placement portal</span>
            <button
              type="button"
              onClick={onComplete}
              style={{
                background: "transparent",
                border: "none",
                color: "#4f46e5",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "4px",
                textDecoration: "underline",
                textUnderlineOffset: "3px"
              }}
            >
              Skip to portal →
            </button>
          </div>
        </div>

        <div className="splash-trust-ribbon">
          <span>Student profiles</span>
          <span className="splash-separator" />
          <span>Placement opportunities</span>
        </div>

        <footer className="splash-footer">
          Academic Session 2026–2027 · CPRMP · Version 1.0.0
        </footer>
      </section>
    </main>
  );
}
