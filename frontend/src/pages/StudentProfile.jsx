
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import './StudentProfile.css'

const emptyProfile = {
  studentId: '',
  phone: '',
  department: '',
  degree: '',
  graduationYear: '',
  currentSemester: '',
  cgpa: '',
  backlogCount: '0',
  skills: '',
}

const fields = [
  { name: 'studentId', label: 'Student ID', required: true },
  { name: 'phone', label: 'Phone number', type: 'tel' },
  { name: 'department', label: 'Department', required: true },
  { name: 'degree', label: 'Degree', required: true },
  {
    name: 'graduationYear',
    label: 'Graduation year',
    type: 'number',
    required: true,
  },
  {
    name: 'currentSemester',
    label: 'Current semester',
    type: 'number',
  },
  { name: 'cgpa', label: 'CGPA', type: 'number', step: '0.01' },
  {
    name: 'backlogCount',
    label: 'Backlog count',
    type: 'number',
    min: '0',
    step: '1',
  },
]

function profileToForm(profile) {
  return {
    studentId: profile.studentId ?? '',
    phone: profile.phone ?? '',
    department: profile.department ?? '',
    degree: profile.degree ?? '',
    graduationYear: String(profile.graduationYear ?? ''),
    currentSemester: String(profile.currentSemester ?? ''),
    cgpa: String(profile.cgpa ?? ''),
    backlogCount: String(profile.backlogCount ?? 0),
    skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
  }
}

function formToPayload(form) {
  const payload = {
    studentId: form.studentId.trim(),
    department: form.department.trim(),
    degree: form.degree.trim(),
    graduationYear: Number(form.graduationYear),
    backlogCount: Number(form.backlogCount || 0),
    skills: form.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean),
  }

  if (form.phone.trim()) payload.phone = form.phone.trim()
  if (form.currentSemester !== '') {
    payload.currentSemester = Number(form.currentSemester)
  }
  if (form.cgpa !== '') payload.cgpa = Number(form.cgpa)

  return payload
}

function StudentProfile() {
  const { token, user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setError('')
    setNotice('')

    try {
      const response = await fetch('/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const result = await response.json()

      if (response.status === 401) {
        signOut()
        return
      }

      if (response.status === 404) {
        setProfile(null)
        setForm(emptyProfile)
        setCreating(true)
        return
      }

      if (!response.ok) {
        throw new Error(result.message || 'Unable to load your profile.')
      }

      setProfile(result.data.profile)
      setForm(profileToForm(result.data.profile))
      setCreating(false)
      setEditing(false)
    } catch (requestError) {
      setError(requestError.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }, [token, signOut])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!form.studentId.trim() || !form.department.trim() ||
        !form.degree.trim() || !form.graduationYear) {
      setError('Please complete all required fields.')
      return
    }

    const year = Number(form.graduationYear)
    if (!Number.isInteger(year) || year < 1900 || year > 2200) {
      setError('Graduation year must be a whole number between 1900 and 2200.')
      return
    }

    if (
      form.currentSemester !== '' &&
      (!Number.isInteger(Number(form.currentSemester)) ||
        Number(form.currentSemester) < 1 ||
        Number(form.currentSemester) > 20)
    ) {
      setError('Semester must be a whole number between 1 and 20.')
      return
    }

    if (
      form.cgpa !== '' &&
      (!Number.isFinite(Number(form.cgpa)) ||
        Number(form.cgpa) < 0 ||
        Number(form.cgpa) > 10)
    ) {
      setError('CGPA must be between 0 and 10.')
      return
    }

    if (
      !Number.isInteger(Number(form.backlogCount || 0)) ||
      Number(form.backlogCount || 0) < 0
    ) {
      setError('Backlog count must be a non-negative whole number.')
      return
    }

    const payload = formToPayload(form)
    setSaving(true)

    try {
      const response = await fetch('/api/student/profile', {
        method: creating ? 'POST' : 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.status === 401) {
        signOut()
        return
      }

      if (!response.ok) {
        const details = result.errors?.map((item) => item.message).join(' ')
        throw new Error(details || result.message || 'Unable to save your profile.')
      }

      setProfile(result.data.profile)
      setForm(profileToForm(result.data.profile))
      setCreating(false)
      setEditing(false)
      setNotice(creating ? 'Your profile was created successfully.' : 'Your profile was updated successfully.')
    } catch (requestError) {
      setError(requestError.message || 'Unable to connect to the server.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="student-profile-page">
        <p role="status">Loading your student profile...</p>
      </main>
    )
  }

  const readOnly = Boolean(profile) && !editing

  return (
    <main className="student-profile-page">
      <header className="student-profile-header">
        <div>
          <Link to="/" className="student-profile-back">← CPRMP home</Link>
          <p className="student-profile-eyebrow">STUDENT WORKSPACE</p>
          <h1>My placement profile</h1>
          <p>Keep your academic information and skills up to date.</p>
        </div>
        <button type="button" className="student-profile-secondary" onClick={signOut}>
          Sign out
        </button>
      </header>

      <section className="student-profile-card">
        <div className="student-profile-card-heading">
          <div>
            <h2>{creating ? 'Create your profile' : 'Academic information'}</h2>
            <p>
              Signed in as {user?.name || user?.email || 'student'}.
              {profile ? ' Review your details or choose Edit profile.' : ' Complete the form to get started.'}
            </p>
          </div>
          {profile && !editing && (
            <button
              type="button"
              className="student-profile-primary"
              onClick={() => {
                setEditing(true)
                setNotice('')
                setError('')
              }}
            >
              Edit profile
            </button>
          )}
        </div>

        {error && <p className="student-profile-error" role="alert">{error}</p>}
        {notice && <p className="student-profile-success" role="status">{notice}</p>}

        <form onSubmit={handleSubmit}>
          <div className="student-profile-grid">
            {fields.map((field) => (
              <label className="student-profile-field" key={field.name}>
                <span>
                  {field.label}
                  {field.required && <span aria-hidden="true"> *</span>}
                </span>
                <input
                  name={field.name}
                  type={field.type || 'text'}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={Boolean(field.required)}
                  min={field.min}
                  max={field.name === 'cgpa' ? '10' : undefined}
                  step={field.step}
                  maxLength={['studentId', 'phone', 'department', 'degree'].includes(field.name)
                    ? ({ studentId: 50, phone: 20, department: 100, degree: 100 })[field.name]
                    : undefined}
                  readOnly={readOnly}
                  disabled={saving}
                />
              </label>
            ))}

            <label className="student-profile-field student-profile-field-wide">
              <span>Skills (comma-separated)</span>
              <textarea
                name="skills"
                rows="3"
                value={form.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Node.js"
                readOnly={readOnly}
                disabled={saving}
              />
              <small>Enter up to 100 skills, separated by commas.</small>
            </label>
          </div>

          {(!readOnly || creating) && (
            <div className="student-profile-actions">
              <button className="student-profile-primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : creating ? 'Create profile' : 'Save changes'}
              </button>
              {profile && editing && (
                <button
                  className="student-profile-secondary"
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setForm(profileToForm(profile))
                    setEditing(false)
                    setError('')
                    setNotice('')
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </form>
      </section>
    </main>
  )
}

export default StudentProfile
