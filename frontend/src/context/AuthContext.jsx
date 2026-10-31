import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('peerconnect-user'))
      if (stored && stored.name === 'Aditi Rao') {
        localStorage.removeItem('peerconnect-user')
        return null
      }
      return stored
    } catch {
      return null
    }
  })

  const saveUser = useCallback((nextUser) => {
    setUser(nextUser)
    if (nextUser) {
      localStorage.setItem('peerconnect-user', JSON.stringify(nextUser))
    } else {
      localStorage.removeItem('peerconnect-user')
    }
  }, [])

  const login = useCallback((email, password) => {
    const trimmedEmail = email?.trim().toLowerCase()
    if (!trimmedEmail || !password?.trim()) {
      return { ok: false, message: 'Email and password are required.' }
    }
    if (password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' }
    }
    let registeredUsers = []
    try {
      registeredUsers = JSON.parse(localStorage.getItem('peerconnect-registered-users')) || []
    } catch {
      registeredUsers = []
    }

    const matchedUser = registeredUsers.find((u) => u.email === trimmedEmail)
    if (matchedUser) {
      if (matchedUser.password && matchedUser.password !== password) {
        return { ok: false, message: 'Invalid password. Please check your credentials.' }
      }
      saveUser(matchedUser)
      return { ok: true, user: matchedUser }
    }
    const emailPrefix = trimmedEmail.split('@')[0].replace(/[._-]/g, ' ')
    const derivedName = emailPrefix
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Student'

    const initials = derivedName
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST'

    const fallbackUser = {
      id: `user-${Date.now()}`,
      name: derivedName,
      email: trimmedEmail,
      year: 'Student',
      initials,
    }

    saveUser(fallbackUser)
    return { ok: true, user: fallbackUser }
  }, [saveUser])

  const register = useCallback((form) => {
    const { name, email, password, confirmPassword, college, branch, year } = form || {}
    if (!name?.trim() || !email?.trim() || !password) {
      return { ok: false, message: 'Please fill in all required fields.' }
    }
    if (password !== confirmPassword) {
      return { ok: false, message: 'Passwords do not match.' }
    }
    if (password.length < 6) {
      return { ok: false, message: 'Password must be at least 6 characters.' }
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    let registeredUsers = []
    try {
      registeredUsers = JSON.parse(localStorage.getItem('peerconnect-registered-users')) || []
    } catch {
      registeredUsers = []
    }

    const existingUser = registeredUsers.find((u) => u.email === trimmedEmail)
    if (existingUser) {
      return { ok: false, message: 'An account with this email already exists. Please log in.' }
    }

    const initials = trimmedName
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST'

    const newUser = {
      id: `user-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      college: college?.trim() || '',
      branch: branch?.trim() || '',
      year: year || '1st Year',
      password,
      initials,
    }

    registeredUsers.push(newUser)
    localStorage.setItem('peerconnect-registered-users', JSON.stringify(registeredUsers))

    saveUser(newUser)
    return { ok: true, user: newUser }
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
