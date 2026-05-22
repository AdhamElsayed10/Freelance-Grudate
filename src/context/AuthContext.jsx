import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { findUser, findCompany, findAdmin, createUser, createCompany, findUserById, findCompanyById, enrollUserInService } from '../data/db'

const AuthContext = createContext(null)

// persist current session
const SESSION_KEY = 'mustakleen_session'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function saveSession(s) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
  } catch (_) {}
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY) } catch (_) {}
}

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)   // logged-in user object or null
  const [company, setCompany] = useState(null) // logged-in company or null
  const [admin, setAdmin]   = useState(null)   // logged-in admin or null
  const [loading, setLoading] = useState(true)

  // hydrate session on mount
  useEffect(() => {
    const session = loadSession()
    if (session) {
      if (session.type === 'user') {
        const u = findUserById(session.id)
        if (u) setUser(u)
      } else if (session.type === 'company') {
        const c = findCompanyById(session.id)
        if (c) setCompany(c)
      } else if (session.type === 'admin') {
        const a = findAdmin(session.email, session.password)
        if (a) setAdmin(a)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((email, password, role) => {
    if (role === 'user') {
      const u = findUser(email, password)
      if (u) {
        setUser(u)
        setCompany(null)
        setAdmin(null)
        saveSession({ type: 'user', id: u.id })
        return { success: true, user: u }
      }
      return { error: 'invalid_credentials' }
    }
    if (role === 'company') {
      const c = findCompany(email, password)
      if (c) {
        setCompany(c)
        setUser(null)
        setAdmin(null)
        saveSession({ type: 'company', id: c.id })
        return { success: true, company: c }
      }
      return { error: 'invalid_credentials' }
    }
    if (role === 'admin') {
      const a = findAdmin(email, password)
      if (a) {
        setAdmin(a)
        setUser(null)
        setCompany(null)
        saveSession({ type: 'admin', email: a.email, password: a.password })
        return { success: true, admin: a }
      }
      return { error: 'invalid_login_data' }
    }
    return { error: 'unknown_role' }
  }, [])

  const signup = useCallback(({ name, email, phone, nationalId, job, password, plan, role, governorate, center_id, bank_id }) => {
    if (role === 'user') {
      const result = createUser({ name, email, phone, nationalId, job, password, plan, governorate })
      if (result.error) return { error: result.error }
      // Enroll in selected services if elite/premium plan with chosen center/bank
      if (result.user && (center_id || bank_id)) {
        if (center_id) enrollUserInService(result.user.id, { service_type: 'medical', center_id })
        if (bank_id) enrollUserInService(result.user.id, { service_type: 'financial', bank_id })
      }
      setUser(result.user)
      setCompany(null)
      setAdmin(null)
      saveSession({ type: 'user', id: result.user.id })
      return { success: true, user: result.user }
    }
    if (role === 'company') {
      const result = createCompany({ name, email, password, category: job, city: '', emoji: '🏢' })
      if (result.error) return { error: result.error }
      setCompany(result.company)
      setUser(null)
      setAdmin(null)
      saveSession({ type: 'company', id: result.company.id })
      return { success: true, company: result.company }
    }
    return { error: 'unknown_role' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCompany(null)
    setAdmin(null)
    clearSession()
  }, [])

  // Helper to refresh user data after mutations
  const refreshUser = useCallback(() => {
    if (user) {
      const u = findUserById(user.id)
      if (u) {
        setUser(u)
        saveSession({ type: 'user', id: u.id })
      }
    }
    if (company) {
      const c = findCompanyById(company.id)
      if (c) {
        setCompany(c)
        saveSession({ type: 'company', id: c.id })
      }
    }
  }, [user, company])

  const value = {
    user,
    company,
    admin,
    loading,
    isAuthenticated: !!(user || company || admin),
    role: user ? 'user' : company ? 'company' : admin ? 'admin' : null,
    login,
    signup,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
