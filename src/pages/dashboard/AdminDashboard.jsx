import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getStats, getAllUserScans, findUserById } from '../../data/db'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { Users, Building2, Tags, DollarSign, ArrowLeft } from 'lucide-react'

export default function AdminDashboard() {
  const { t, lang } = useLanguage()
  const [stats, setStats] = useState(null)
  const [recentScans, setRecentScans] = useState([])

  useEffect(() => {
    setStats(getStats())
    const scans = getAllUserScans().slice(-5).reverse()
    setRecentScans(scans)
  }, [])

  if (!stats) return null

  const statCards = [
    { label: t('adminDashboard', 'totalUsers'), value: stats.totalUsers, icon: Users, href: '/dashboard/admin/users', color: 'text-blue-500' },
    { label: t('adminDashboard', 'totalCompanies'), value: stats.totalCompanies, icon: Building2, href: '/dashboard/admin/companies', color: 'text-orange-500' },
    { label: t('adminDashboard', 'revenue'), value: `${stats.totalRevenue} ${t('pricing', 'egp')}`, icon: DollarSign, color: 'text-gold' },
  ]

  return (
    <>
      <Helmet><title>{t('adminDashboard', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminDashboard', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('adminDashboard', 'subtitle')}</p>

            {/* Stats grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {statCards.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  {s.href ? (
                    <Link to={s.href} className="block bg-white rounded-2xl p-5 border border-gold/10 shadow-sm hover:shadow-md transition-all">
                      <s.icon className={s.color} size={24} />
                      <p className="text-2xl font-bold text-dark mt-2">{s.value}</p>
                      <p className="text-dark/50 text-xs">{s.label}</p>
                    </Link>
                  ) : (
                    <div className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm">
                      <s.icon className={s.color} size={24} />
                      <p className="text-2xl font-bold text-dark mt-2">{s.value}</p>
                      <p className="text-dark/50 text-xs">{s.label}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Quick links */}
            <h2 className="text-2xl font-bold text-dark mb-6">{t('adminDashboard', 'quickManage')}</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {[
                { label: t('adminDashboard', 'manageUsers'), href: '/dashboard/admin/users', icon: Users },
                { label: t('adminDashboard', 'manageCompanies'), href: '/dashboard/admin/companies', icon: Building2 },
                { label: t('adminDashboard', 'manageDiscounts'), href: '/dashboard/admin/discounts', icon: Tags },
              ].map((link, i) => (
                <Link key={i} to={link.href}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="bg-dark rounded-2xl p-6 text-white hover:bg-darkLight transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <link.icon className="text-gold" size={24} />
                      <span className="font-bold">{link.label}</span>
                    </div>
                    <ArrowLeft size={18} className="text-gold/50 group-hover:-translate-x-1 transition-transform" />
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Recent activity */}
            <h2 className="text-2xl font-bold text-dark mb-6">{t('adminDashboard', 'recentActivity')}</h2>
            <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
              {recentScans.length === 0 ? (
                <p className="p-8 text-dark/50 text-center">{t('adminDashboard', 'noRecentActivity')}</p>
              ) : (
                <div className="divide-y divide-gold/10">
                  {recentScans.map((scan, i) => {
                    const scanner = findUserById(scan.user_id)
                    return (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-gold/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-bold">
                            {scanner?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-dark text-sm">{scanner?.name || t('adminDashboard', 'user')}</p>
                            <p className="text-dark/40 text-xs">{t('adminDashboard', 'scannedDiscount')} #{scan.discount_id}</p>
                          </div>
                        </div>
                        <span className="text-dark/30 text-xs">{new Date(scan.scanned_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
