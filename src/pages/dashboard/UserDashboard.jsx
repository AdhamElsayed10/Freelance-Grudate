import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { getUserEnrollments } from '../../data/db'
import { QrCode, Wallet, CreditCard, Clock, TrendingUp, Sparkles, Stethoscope, Landmark } from 'lucide-react'

export default function UserDashboard() {
  const { user } = useAuth()
  const { t, td, lang } = useLanguage()
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    if (user) setEnrollments(getUserEnrollments(user.id))
  }, [user])

  const serviceLabels = { medical: t('footer', 'medicalInsurance'), financial: t('footer', 'financialInsurance') }
  const serviceIcons = { medical: Stethoscope, financial: Landmark }

  if (!user) return null

  const quickActions = [
    { label: t('dashboard', 'browseDiscounts'), icon: QrCode, href: '/dashboard/discounts', color: 'from-gold to-[#a67c3d]' },
    { label: t('dashboard', 'myCards'), icon: CreditCard, href: '/dashboard/user/cards', color: 'from-blue-500 to-blue-600' },
    { label: t('dashboard', 'myInstallments'), icon: Clock, href: '/dashboard/user/installments', color: 'from-emerald-500 to-emerald-600' },
    { label: t('dashboard', 'scanHistory'), icon: TrendingUp, href: '/dashboard/user/scans', color: 'from-purple-500 to-purple-600' },
  ]

  const stats = [
    { label: t('dashboard', 'scansCount'), value: user.scans, icon: QrCode, color: 'text-gold' },
    { label: t('dashboard', 'totalSavings'), value: `${user.saved.toFixed(0)} ${t('pricing', 'egp')}`, icon: Wallet, color: 'text-emerald-400' },
    { label: t('dashboard', 'loyaltyPoints'), value: user.points, icon: Sparkles, color: 'text-purple-400' },
  ]

  const planColors = { free: 'bg-gray-500', premium: 'bg-gold', elite: 'bg-emerald-500' }

  return (
    <>
      <Helmet><title>{t('dashboard', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl font-bold text-dark mb-2">{t('dashboard', 'welcome')} {td('users', user.name)} 👋</h1>
            <p className="text-dark/60">{t('dashboard', 'overview')}</p>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-dark/50 text-sm">{s.label}</span>
                  <s.icon className={s.color} size={24} />
                </div>
                <p className="text-3xl font-bold text-dark">{s.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Plan info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-12">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-dark/50 text-sm">{t('dashboard', 'currentPlan')}</span>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xl font-bold text-dark capitalize">
                    {user.plan === 'elite' ? t('discountsBrowse', 'elite') : user.plan === 'premium' ? t('discountsBrowse', 'premium') : t('discountsBrowse', 'free')}
                  </p>
                  <span className={`${planColors[user.plan]} text-white text-xs px-3 py-1 rounded-full font-bold`}>{user.plan}</span>
                </div>
              </div>
              <div className="text-left">
                <span className="text-dark/50 text-sm">{t('dashboard', 'membershipDate')}</span>
                <p className="font-bold text-dark">{new Date(user.join_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <h2 className="text-2xl font-bold text-dark mb-6">{t('common', 'quickActions')}</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.href}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                    <action.icon size={26} />
                  </div>
                  <p className="font-bold text-dark">{action.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Enrolled Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
            <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
              <Sparkles className="text-gold" size={24} />
              {t('common', 'myServices')}
            </h2>
            {enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm text-center">
                <p className="text-dark/50 mb-4">{t('common', 'noServices')}</p>
                <Link to="/services" className="inline-block bg-dark text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-darkLight transition-all">
                  {t('common', 'browseServices')}
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {enrollments.map((enr) => {
                  const Icon = serviceIcons[enr.service_type]
                  const name = td('medicalCenters', enr.center?.name, 'name') || td('banks', enr.bank?.name, 'name') || ''
                  return (
                    <div key={enr.id} className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0">
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-dark">{serviceLabels[enr.service_type]}</p>
                        <p className="text-dark/60 text-sm truncate">{name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${enr.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                            {enr.status === 'active' ? t('common', 'enrollActive') : t('common', 'enrollCancelled')}
                          </span>
                          <span className="text-dark/40 text-xs">{new Date(enr.enrolled_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
