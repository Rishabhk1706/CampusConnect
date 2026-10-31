import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loginUserApi, registerUserApi } from '../utils/apis'

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
      localStorage.removeItem('peerconnect-token')
    }
  }, [])

  const setAuthSession = useCallback((apiUser, token) => {
    if (token) {
      localStorage.setItem('peerconnect-token', token)
    }

    const initials = apiUser?.name
      ? apiUser.name
          .trim()
          .split(/\s+/)
          .map((p) => p[0])
          .filter(Boolean)
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'ST'

    const loggedUser = {
      ...apiUser,
      initials,
      year: apiUser?.year ? `${apiUser.year} Year` : 'Student',
    }

    saveUser(loggedUser)
    return loggedUser
  }, [saveUser])

  const login = useCallback(async (email, password) => {
    const trimmedEmail = email?.trim().toLowerCase()
    if (!trimmedEmail || !password?.trim()) {
      return { ok: false, message: 'Email and password are required.' }
    }

    try {
      // 1. Authenticate with backend API
      const res = await loginUserApi({ email: trimmedEmail, password })
      if (res && res.token && res.user) {
        const loggedUser = setAuthSession(res.user, res.token)
        return { ok: true, user: loggedUser }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed'
      const isUnverified = err.response?.status === 403

      return {
        ok: false,
        message: errorMsg,
        needsVerification: isUnverified,
      }
    }

    return { ok: false, message: 'Invalid credentials. Please try again.' }
  }, [setAuthSession])

  const register = useCallback(async (form) => {
    try {
      const res = await registerUserApi(form)
      return { ok: true, data: res }
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.error || err.message || 'Registration failed',
        status: err.response?.status,
        data: err.response?.data,
      }
    }
  }, [])

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
