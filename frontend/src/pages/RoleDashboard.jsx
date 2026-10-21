import { useAuth } from '../context/useAuth.js'
import AdminPortal from './AdminPortal.jsx'
import RecruiterPortal from './RecruiterPortal.jsx'

function RoleDashboard({ title, description }) {
  const { user } = useAuth()

  if (user?.role === 'admin') {
    return <AdminPortal />
  }

  if (user?.role === 'recruiter') {
    return <RecruiterPortal />
  }

  return <AdminPortal />
}

export default RoleDashboard
