import { useMemo, useState } from "react";
import { AuthContext } from "./authContext.js";

function readStoredAuth() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user) {
      return { token, user };
    }
  } catch {
    // Invalid stored session: start logged out.
  }

  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  function signIn({ token, user }) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  }

  function signOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear legacy keys used by older dashboard code.
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    setAuth({ token: null, user: null });
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
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}