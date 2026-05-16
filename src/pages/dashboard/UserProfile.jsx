import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { updateUser, getGovernorates } from '../../data/db'
import { User, Mail, Briefcase, Lock, Calendar, Award, MapPin, Pencil } from 'lucide-react'

export default function UserProfile() {
  const { user, refreshUser } = useAuth()
  const { t, td, lang } = useLanguage()
  const [governorates, setGovernorates] = useState([])
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', job: user?.job || '', password: user?.password || '', governorate: user?.governorate || '' })
  const [saved, setSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => { setGovernorates(getGovernorates()) }, [])

  if (!user) return null

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = (e) => {
    e.preventDefault()
    updateUser(user.id, form)
    refreshUser()
    setSaved(true)
    setIsEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleEdit = () => {
    if (isEditing) {
      setForm({ name: user?.name || '', email: user?.email || '', job: user?.job || '', password: user?.password || '', governorate: user?.governorate || '' })
    }
    setIsEditing(!isEditing)
  }

  const planLabels = { free: t('discountsBrowse', 'free'), premium: t('discountsBrowse', 'premium'), elite: t('discountsBrowse', 'elite') }
  const planColors = { free: 'bg-gray-500', premium: 'bg-gold', elite: 'bg-emerald-500' }

  return (
    <>
      <Helmet><title>{t('userProfile', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-2">{t('userProfile', 'heading')}</h1>
            <p className="text-dark/60 mb-10">{t('userProfile', 'subtitle')}</p>

            {/* Member info */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-cream rounded-xl p-4 text-center">
                  <Calendar className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-dark/50 text-xs">{t('userProfile', 'joinDate')}</p>
                  <p className="font-bold text-dark text-sm mt-1">{new Date(user.join_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
                <div className="bg-cream rounded-xl p-4 text-center">
                  <Award className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-dark/50 text-xs">{t('userProfile', 'memberId')}</p>
                  <p className="font-bold text-dark text-sm mt-1" dir="ltr">{user.id}</p>
                </div>
                <div className="bg-cream rounded-xl p-4 text-center">
                  <span className={`inline-block ${planColors[user.plan]} text-white px-4 py-2 rounded-full font-bold text-sm`}>{planLabels[user.plan]}</span>
                  <p className="text-dark/50 text-xs mt-2">{t('dashboard', 'currentPlan')}</p>
                </div>
              </div>
            </div>

            {/* Edit form */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-dark">{t('userProfile', 'personalInfo')}</h2>
                {!isEditing ? (
                  <button type="button" onClick={toggleEdit}
                    className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gold/20 transition-all">
                    <Pencil size={16} /> {t('userProfile', 'edit')}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={toggleEdit}
                      className="px-5 py-2.5 rounded-xl font-bold text-sm border border-gold/30 text-goldLight hover:bg-gold/10 transition-all">
                      {t('userProfile', 'cancel')}
                    </button>
                    <button type="submit"
                      className="flex items-center gap-2 bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
                      {saved ? t('userProfile', 'saved') : t('userProfile', 'saveChanges')}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'fullName')}</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="text" name="name" value={!isEditing ? (td('users', form.name) || form.name) : form.name} onChange={handleChange} disabled={!isEditing} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'email')}</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!isEditing} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'specialty')}</label>
                  <div className="relative">
                    <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="text" name="job" value={!isEditing ? (td('jobs', form.job) || form.job) : form.job} onChange={handleChange} disabled={!isEditing} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'governorate')}</label>
                  <div className="relative">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <select name="governorate" value={!isEditing ? (td('governorates', form.governorate) || form.governorate) : form.governorate} onChange={handleChange} disabled={!isEditing} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                      <option value="">{t('userProfile', 'chooseGovernorate')}</option>
                      {governorates.map((g, i) => <option key={i} value={g}>{td('governorates', g)}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'password')}</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="password" name="password" value={form.password} onChange={handleChange} disabled={!isEditing} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}
