
import { useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  })

  function signIn({ token, user }) {
    setAuth({ token, user })
  }

  function signOut() {
    setAuth({
      token: null,
      user: null,
    })
  }

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token && auth.user),
      signIn,
      signOut,
    }),
    [auth],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
