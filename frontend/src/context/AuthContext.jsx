import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const DEMO_USER = {
  name: 'Aditi Rao',
  email: 'aditi.rao@college.edu',
  year: '3rd Year CSE',
  initials: 'AR',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peerconnect-user')) } catch { return null }
  })

  const saveUser = useCallback((nextUser) => {
    setUser(nextUser)
    if (nextUser) localStorage.setItem('peerconnect-user', JSON.stringify(nextUser))
    else localStorage.removeItem('peerconnect-user')
  }, [])

  const login = useCallback((email, password) => {
    if (!email?.trim() || !password?.trim()) {
      return { ok: false, message: 'Email and password are required.' }
    }
    if (password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' }
    }
    saveUser({ ...DEMO_USER, email: email.trim() })
    return { ok: true }
  }, [saveUser])

  const register = useCallback((form) => {
    const { name, email, password, confirmPassword } = form
    if (!name?.trim() || !email?.trim() || !password) {
      return { ok: false, message: 'Please fill in all required fields.' }
    }
    if (password !== confirmPassword) {
      return { ok: false, message: 'Passwords do not match.' }
    }
    if (password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' }
    }
    const initials = name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    saveUser({ name: name.trim(), email: email.trim(), year: 'Student', initials })
    return { ok: true }
  }, [saveUser])

  const logout = useCallback(() => saveUser(null), [saveUser])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
