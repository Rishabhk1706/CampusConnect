import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getMyProfile, loginUserApi, registerUserApi } from '../utils/apis'

const AuthContext = createContext(null)
const TOKEN_KEY = 'peerconnect-token'
const USER_KEY = 'peerconnect-user'

const clearStoredSession = () => {
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

const withUserDefaults = (apiUser) => {
  const initials = apiUser?.name
    ? apiUser.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .filter(Boolean)
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST'

  return {
    ...apiUser,
    initials,
    year: apiUser?.year ? `${apiUser.year} Year` : 'Student',
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authStatus, setAuthStatus] = useState('checking')

  const validateSession = useCallback(async () => {
    setAuthStatus('checking')
    const token = localStorage.getItem(TOKEN_KEY)
    let storedUser

    try {
      storedUser = JSON.parse(localStorage.getItem(USER_KEY))
    } catch {
      clearStoredSession()
      setUser(null)
      setAuthStatus('unauthenticated')
      return
    }

    if (!token || !storedUser) {
      clearStoredSession()
      setUser(null)
      setAuthStatus('unauthenticated')
      return
    }

    try {
      const verifiedUser = withUserDefaults(await getMyProfile())
      setUser(verifiedUser)
      localStorage.setItem(USER_KEY, JSON.stringify(verifiedUser))
      setAuthStatus('authenticated')
    } catch (error) {
      if (error.response?.status === 401) {
        clearStoredSession()
        setUser(null)
        setAuthStatus('unauthenticated')
        return
      }

      setUser(null)
      setAuthStatus('error')
    }
  }, [])

  useEffect(() => {
    validateSession()
  }, [validateSession])

  const saveUser = useCallback((nextUser) => {
    setUser(nextUser)
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      setAuthStatus('authenticated')
    } else {
      clearStoredSession()
      setAuthStatus('unauthenticated')
    }
  }, [])

  const setAuthSession = useCallback((apiUser, token) => {
    localStorage.setItem(TOKEN_KEY, token)
    const loggedUser = withUserDefaults(apiUser)
    saveUser(loggedUser)
    return loggedUser
  }, [saveUser])

  const login = useCallback(async (email, password) => {
    const trimmedEmail = email?.trim().toLowerCase()
    if (!trimmedEmail || !password?.trim()) {
      return { ok: false, message: 'Email and password are required.' }
    }

    try {
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
    () => ({
      user,
      authStatus,
      isAuthenticated: authStatus === 'authenticated',
      validateSession,
      login,
      register,
      logout,
      saveUser,
    }),
    [user, authStatus, validateSession, login, register, logout, saveUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
