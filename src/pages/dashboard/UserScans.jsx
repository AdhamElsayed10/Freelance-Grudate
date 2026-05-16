import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { getUserScans } from '../../data/db'
import { QrCode, Building2, Tag, Calendar } from 'lucide-react'

export default function UserScans() {
  const { user } = useAuth()
  const { t, td, lang } = useLanguage()
  const [scans, setScans] = useState([])

  useEffect(() => {
    if (user) setScans(getUserScans(user.id))
  }, [user])

  if (!user) return null

  const categoryLabels = { medical: t('adminDiscounts', 'medical'), gym: t('adminDiscounts', 'sports'), food: t('adminDiscounts', 'restaurants'), fun: t('adminDiscounts', 'entertainment') }

  return (
    <>
      <Helmet><title>{t('userScans', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-2">{t('userScans', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('userScans', 'subtitle')} ({scans.length})</p>

            {scans.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <QrCode className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 font-semibold text-lg">{t('userScans', 'noScans')}</p>
                <p className="text-dark/40 text-sm mt-2">{t('userScans', 'noScansHint')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scans.map((scan, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <QrCode className="text-gold" size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-dark truncate">{td('discounts', scan.discount?.name, 'name') || t('userScans', 'discount')}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-dark/50">
                          <span className="flex items-center gap-1"><Building2 size={14} /> {td('companies', scan.discount?.company_name) || ''}</span>
                          <span className="flex items-center gap-1"><Tag size={14} /> {scan.discount?.discount_percent || ''}</span>
                        </div>
                      </div>
                      <div className="text-left text-sm text-dark/40">
                        <Calendar size={14} className="inline ml-1" />
                        {new Date(scan.scanned_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
