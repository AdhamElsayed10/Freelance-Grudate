import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut, User, LogIn, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const { user, company, admin, isAuthenticated, role, logout } = useAuth()
  const { lang, toggleLang, t, td } = useLanguage()

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location])

  const dashboardLink = role === 'admin' ? '/dashboard/admin' : role === 'company' ? '/dashboard/company' : '/dashboard/user'
  const displayName = (user?.fullName || user?.name && (td('users', user.name) || user.name)) || (company?.name && (td('companies', company.name, 'name') || company.name)) || admin?.email || ''

  const navItems = [
    { label: t('navbar', 'home'), href: '/' },
    { label: t('navbar', 'services'), href: '/services' },
    { label: t('navbar', 'pricing'), href: '/pricing' },
    ...(isAuthenticated ? [] : [{ label: t('navbar', 'join'), href: '/join' }]),
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark/95 backdrop-blur-xl shadow-lg py-3">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img src="/navlogo.png" alt="Freelancers" className="h-14 w-auto" />
          <span className="text-3xl font-bold text-white font-poppins">{t('navbar', 'siteName')}</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item, i) => (
            <Link key={i} to={item.href}
              className="text-goldLight hover:text-gold font-semibold transition-colors relative group">
              {item.label}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
            </Link>
          ))}

          <button onClick={toggleLang}
            className="text-goldLight hover:text-gold transition-colors p-2 border border-gold/30 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Globe size={14} />
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2 rounded-xl text-goldLight hover:text-gold transition-all font-semibold text-sm">
                <div className="w-7 h-7 bg-gradient-to-br from-gold to-goldLight rounded-full flex items-center justify-center text-dark">
                  <User size={14} />
                </div>
                <span className="max-w-[100px] truncate">{displayName}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-dark border border-gold/20 rounded-2xl shadow-xl py-3 backdrop-blur-xl">
                  <Link to={dashboardLink} onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-goldLight hover:text-gold hover:bg-gold/10 transition-all text-sm">
                    <LayoutDashboard size={16} /> {t('navbar', 'dashboard')}
                  </Link>
                  {role === 'user' && (
                    <Link to="/dashboard/user/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-goldLight hover:text-gold hover:bg-gold/10 transition-all text-sm">
                      <User size={16} /> {t('navbar', 'profile')}
                    </Link>
                  )}
                  <hr className="border-gold/10 my-2" />
                  <button onClick={() => { logout(); setDropdownOpen(false) }}
                    className="flex items-center gap-3 px-5 py-2.5 text-red-400 hover:text-red-300 hover:bg-gold/10 transition-all text-sm w-full text-right">
                    <LogOut size={16} /> {t('navbar', 'logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"
              className="flex items-center gap-2 bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
              <LogIn size={16} /> {t('navbar', 'enter')}
            </Link>
          )}
        </div>

        <button className="md:hidden text-goldLight text-2xl" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-xl border-t border-gold/20">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navItems.map((item, i) => (
              <Link key={i} to={item.href} className="text-goldLight hover:text-gold font-semibold py-2 block">{item.label}</Link>
            ))}
            <button onClick={toggleLang}
              className="text-goldLight hover:text-gold font-semibold py-2 flex items-center gap-2">
              <Globe size={16} /> {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} className="text-gold hover:text-goldLight font-semibold py-2 block">{t('navbar', 'dashboard')}</Link>
                <button onClick={() => { logout(); setMobileOpen(false) }} className="text-red-400 font-semibold py-2 block text-right">{t('navbar', 'logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gold font-semibold py-2 block">{t('navbar', 'login')}</Link>
                <Link to="/join" className="text-goldLight hover:text-gold font-semibold py-2 block">{t('navbar', 'join')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
