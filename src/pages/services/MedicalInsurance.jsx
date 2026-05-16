import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  getAllMedicalCenters, getMedicalCentersByGovernorate, getGovernorates,
  enrollUserInService, getUserEnrollments, cancelEnrollment,
} from '../../data/db'
import {
  MapPin, Phone, Star, Shield, Check, HelpCircle,
  ArrowLeft, CreditCard, Stethoscope, X, CheckCircle, Building2
} from 'lucide-react'
import Breadcrumb from '../../components/Breadcrumb'
import FAQ from '../../components/FAQ'

import LoadingSpinner from '../../components/LoadingSpinner'

const faqItems = (tf) => [
  { q: tf('medicalInsurance', 'faq', 0, 'q'), a: tf('medicalInsurance', 'faq', 0, 'a') },
  { q: tf('medicalInsurance', 'faq', 1, 'q'), a: tf('medicalInsurance', 'faq', 1, 'a') },
  { q: tf('medicalInsurance', 'faq', 2, 'q'), a: tf('medicalInsurance', 'faq', 2, 'a') },
  { q: tf('medicalInsurance', 'faq', 3, 'q'), a: tf('medicalInsurance', 'faq', 3, 'a') },
]

export default function MedicalInsurance() {
  const { user } = useAuth()
  const { t, tf, td, lang } = useLanguage()
  const [centers, setCenters] = useState([])
  const [governorates, setGovernorates] = useState([])
  const [filterGov, setFilterGov] = useState('all')
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setGovernorates(getGovernorates())
    setCenters(getAllMedicalCenters())
    if (user) setEnrollments(getUserEnrollments(user.id))
    setLoading(false)
  }, [user])

  const filtered = filterGov === 'all'
    ? centers
    : centers.filter(c => c.governorate === filterGov)

  const medicalEnrollment = enrollments.find(e => e.service_type === 'medical' && e.status === 'active')

  const handleEnroll = (center) => {
    if (!user) return
    enrollUserInService(user.id, { service_type: 'medical', center_id: center.id })
    setEnrollments(getUserEnrollments(user.id))
    setMsg(`${t('medicalInsurance', 'enrollSuccess')} ${td('medicalCenters', center.name, 'name')}`)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleCancel = () => {
    if (!medicalEnrollment) return
    cancelEnrollment(medicalEnrollment.id)
    setEnrollments(getUserEnrollments(user.id))
    setMsg(t('medicalInsurance', 'cancelSuccess'))
    setTimeout(() => setMsg(''), 3000)
  }

  const breadcrumbItems = [
    { label: t('medicalInsurance', 'breadcrumbServices'), href: '/services' },
    { label: t('medicalInsurance', 'breadcrumbMedical') },
  ]

  if (loading) return <LoadingSpinner />

  return (
    <>
      <Helmet>
        <title>{t('medicalInsurance', 'title')}</title>
        <meta name="description" content={t('medicalInsurance', 'description')} />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[50vh] hero-gradient flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gold/5 rounded-full top-20 -left-48 animate-float" />
        <div className="absolute w-72 h-72 bg-gold/5 rounded-full bottom-10 right-10 animate-float" style={{animationDelay: '-5s'}} />
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumb items={breadcrumbItems} />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="mt-8 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2 rounded-full mb-6">
                <Star className="text-gold" size={14} />
                <span className="text-gold text-sm font-bold">{t('common', 'premiumService')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">{t('medicalInsurance', 'heading')}</h1>
              <p className="text-xl text-goldLight/80 mb-6">{t('medicalInsurance', 'subtitle')}</p>
              <p className="text-goldLight/70 leading-relaxed mb-8 text-lg">
                {t('medicalInsurance', 'heroText')}
              </p>
              {!user && (
                <Link to="/join"
                  className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
                  <CreditCard size={20} />
                  {t('medicalInsurance', 'cta')}
                </Link>
              )}
            </div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
                <img src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200&auto=format&fit=crop"
                  alt={t('medicalInsurance', 'heading')} className="w-full object-cover h-[400px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Message toast */}
      {msg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2">
          <CheckCircle size={20} /> {msg}
        </div>
      )}

      {/* Current enrollment banner */}
      {medicalEnrollment && (
        <section className="py-6 bg-cream border-b border-gold/10">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-emerald-500" size={28} />
                <div>
                  <p className="font-bold text-dark">{t('medicalInsurance', 'enrolled')}</p>
                  <p className="text-dark/60 text-sm">
                    {td('medicalCenters', medicalEnrollment.center?.name, 'name') || t('medicalInsurance', 'medicalCenter')} - {new Date(medicalEnrollment.enrolled_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                  </p>
                </div>
              </div>
              <button onClick={handleCancel}
                className="bg-red-50 text-red-500 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition-all">
                <X size={16} /> {t('medicalInsurance', 'cancelEnrollment')}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Centers list */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
<div>
              <h2 className="text-3xl font-bold text-dark">{t('medicalInsurance', 'centersTitle')}</h2>
              <p className="text-dark/60 mt-2">{t('medicalInsurance', 'centersSubtitle')}</p>
            </div>
            <select value={filterGov} onChange={e => setFilterGov(e.target.value)}
              className="bg-white border border-gold/20 rounded-xl px-5 py-3 text-dark outline-none focus:border-gold/60 transition-all min-w-[200px]">
              <option value="all">{t('common', 'allGovernorates')}</option>
              {governorates.map((g, i) => <option key={i} value={g}>{td('governorates', g)}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
              <Building2 className="text-gold/30 mx-auto mb-4" size={64} />
              <p className="text-dark/50 font-semibold text-lg">{t('medicalInsurance', 'noCenters')}</p>
              <p className="text-dark/40 text-sm mt-2">{t('common', 'tryChanging')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((center, i) => (
                <motion.div key={center.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-gold/10 shadow-sm hover:shadow-md transition-all">
                  <div className="h-48 overflow-hidden">
                    <img src={center.img_url} alt={td('medicalCenters', center.name, 'name')} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-dark">{td('medicalCenters', center.name, 'name')}</h3>
                      <div className="flex items-center gap-1 text-gold" dir="ltr">
                        <Star size={16} fill="currentColor" />
                        <span className="text-dark font-bold text-sm">{center.rating}</span>
                      </div>
                    </div>
                    <p className="text-dark/60 text-sm mb-4 leading-relaxed">{td('medicalCenters', center.name, 'description')}</p>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-dark/50">
                        <MapPin size={15} className="text-gold/60" />
                        <span>{td('medicalCenters', center.name, 'address')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-dark/50">
                        <Phone size={15} className="text-gold/60" />
                        <span dir="ltr">{center.phone}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {center.services_offered.map((s, j) => (
                        <span key={j} className="bg-gold/5 text-gold text-xs px-3 py-1.5 rounded-full font-semibold">{td('services_offered', s)}</span>
                      ))}
                    </div>
                    {user ? (
                      medicalEnrollment?.center_id === center.id ? (
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                          <CheckCircle size={18} /> {t('medicalInsurance', 'enrolledCenter')}
                        </div>
                      ) : (
                        <button onClick={() => handleEnroll(center)}
                          className="w-full bg-dark text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-darkLight transition-all">
                          <Stethoscope size={18} />
                          {t('medicalInsurance', 'enrollButton')}
                        </button>
                      )
                    ) : (
                      <Link to="/join"
                        className="block w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-3 rounded-xl font-bold text-sm text-center hover:shadow-lg transition-all">
                        {t('medicalInsurance', 'registerNow')}
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t('common', 'features')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: tf('medicalInsurance', 'features', 0, 'title'), desc: tf('medicalInsurance', 'features', 0, 'desc') },
              { title: tf('medicalInsurance', 'features', 1, 'title'), desc: tf('medicalInsurance', 'features', 1, 'desc') },
              { title: tf('medicalInsurance', 'features', 2, 'title'), desc: tf('medicalInsurance', 'features', 2, 'desc') },
              { title: tf('medicalInsurance', 'features', 3, 'title'), desc: tf('medicalInsurance', 'features', 3, 'desc') },
              { title: tf('medicalInsurance', 'features', 4, 'title'), desc: tf('medicalInsurance', 'features', 4, 'desc') },
              { title: tf('medicalInsurance', 'features', 5, 'title'), desc: tf('medicalInsurance', 'features', 5, 'desc') },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-cream p-6 rounded-2xl border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-[#a67c3d] rounded-xl flex items-center justify-center text-dark mb-4 shadow-lg shadow-gold/20 group-hover:scale-110 transition-transform">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-dark/60 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Join Section */}
      <section className="py-20 bg-gradient-to-br from-dark via-darkLight to-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #c19553 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          {/* FAQ */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <HelpCircle className="text-gold" size={24} />
              <h2 className="text-3xl font-bold text-white">{t('common', 'faq')}</h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
          </div>
          <FAQ items={faqItems(tf)} />

          {/* Join CTA */}
          <div className="mt-16 pt-16 border-t border-gold/10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('medicalInsurance', 'ctaTitle')}</h2>
              <p className="text-goldLight/70 max-w-2xl mx-auto mb-8 text-lg">{t('medicalInsurance', 'ctaSubtitle')}</p>
              <Link to="/join" className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
                {t('medicalInsurance', 'ctaButton')}
                <ArrowLeft size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
