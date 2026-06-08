import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/authService'
import { findUser, findCompany, findAdmin, createUser, createCompany, findUserById, findCompanyById, enrollUserInService } from '../data/db'

const AuthContext = createContext(null)

const TOKEN_KEY = 'token'
const USER_KEY = 'mustakleen_user'
const SESSION_KEY = 'mustakleen_session'

// ── Local/mock session helpers (for company & admin) ─────────
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
  const [user, setUser]       = useState(null)   // logged-in user object or null
  const [company, setCompany] = useState(null)    // logged-in company or null
  const [admin, setAdmin]     = useState(null)    // logged-in admin or null
  const [loading, setLoading] = useState(true)

  // ── Hydrate session on mount ──────────────────────────────
  useEffect(() => {
    const hydrate = async () => {
      // 1. Try JWT-based session (real backend user)
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        try {
          const data = await getCurrentUser()
          if (data.success && data.user) {
            setUser(data.user)
            localStorage.setItem(USER_KEY, JSON.stringify(data.user))
            setLoading(false)
            return
          }
        } catch (err) {
          // Token expired or invalid — clear it
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        }
      }

      // 2. Try mock session (company / admin)
      const session = loadSession()
      if (session) {
        if (session.type === 'company') {
          const c = findCompanyById(session.id)
          if (c) setCompany(c)
        } else if (session.type === 'admin') {
          const a = findAdmin(session.email, session.password)
          if (a) setAdmin(a)
        }
      }

      setLoading(false)
    }

    hydrate()
  }, [])

  // ── Login ────────────────────────────────────────────────────
  const login = useCallback(async (email, password, role) => {
    // User login → real backend API
    if (role === 'user') {
      try {
        const data = await loginUser(email, password)
        if (data.success && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token)
          localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          setUser(data.user)
          setCompany(null)
          setAdmin(null)
          clearSession()
          return { success: true, user: data.user }
        }
        return { error: data.message || 'invalid_credentials' }
      } catch (err) {
        // Network errors (server down, no response) vs actual API errors
        if (!err.response) {
          return { error: 'تعذر الاتصال بالخادم. تأكد من تشغيل الباك اند (Backend).' }
        }
        const msg = err.response?.data?.message || 'invalid_credentials'
        return { error: msg }
      }
    }

    // Company login → mock data (no backend model yet)
    if (role === 'company') {
      const c = findCompany(email, password)
      if (c) {
        setCompany(c)
        setUser(null)
        setAdmin(null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        saveSession({ type: 'company', id: c.id })
        return { success: true, company: c }
      }
      return { error: 'invalid_credentials' }
    }

    // Admin login → mock data (no backend model yet)
    if (role === 'admin') {
      const a = findAdmin(email, password)
      if (a) {
        setAdmin(a)
        setUser(null)
        setCompany(null)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        saveSession({ type: 'admin', email: a.email, password: a.password })
        return { success: true, admin: a }
      }
      return { error: 'invalid_login_data' }
    }

    return { error: 'unknown_role' }
  }, [])

  // ── Signup ───────────────────────────────────────────────────
  const signup = useCallback(async ({ name, email, phone, nationalId, job, password, plan, role, governorate, center_id, bank_id }) => {
    // User signup → real backend API
    if (role === 'user') {
      try {
        const data = await registerUser({
          fullName: name,
          email,
          phone,
          nationalId,
          profession: job,
          governorate,
          password,
          plan: plan || 'free',
        })

        if (data.success && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token)
          localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          setUser(data.user)
          setCompany(null)
          setAdmin(null)
          clearSession()
          return { success: true, user: data.user }
        }
        return { error: data.message || 'registration_failed' }
      } catch (err) {
        if (!err.response) {
          return { error: 'تعذر الاتصال بالخادم. تأكد من تشغيل الباك اند (Backend).' }
        }
        const msg = err.response?.data?.message || 'registration_failed'
        return { error: msg }
      }
    }

    // Company signup → mock data (no backend model yet)
    if (role === 'company') {
      const result = createCompany({ name, email, password: name + '123', category: job, city: '', emoji: '🏢' })
      if (result.error) return { error: result.error }
      setCompany(result.company)
      setUser(null)
      setAdmin(null)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      saveSession({ type: 'company', id: result.company.id })
      return { success: true, company: result.company }
    }

    return { error: 'unknown_role' }
  }, [])

  // ── Logout ───────────────────────────────────────────────────
  const logout = useCallback(async () => {
    // If we have a JWT token, call backend logout
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      try {
        await logoutUser()
      } catch (_) {
        // Ignore errors — we clear local state regardless
      }
    }

    setUser(null)
    setCompany(null)
    setAdmin(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    clearSession()
  }, [])

  // ── Refresh user data ────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token && user) {
      try {
        const data = await getCurrentUser()
        if (data.success && data.user) {
          setUser(data.user)
          localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        }
      } catch (_) {}
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
    role: user ? (user.role || 'user') : company ? 'company' : admin ? 'admin' : null,
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
