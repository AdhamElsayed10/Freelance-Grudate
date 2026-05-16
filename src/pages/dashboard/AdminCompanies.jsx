import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getAllCompanies, updateCompany } from '../../data/db'
import BackButton from '../../components/BackButton'
import { Search, CheckCircle, XCircle, Building2 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
 
export default function AdminCompanies() {
  const { t, td } = useLanguage()
  const [companies, setCompanies] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => { setCompanies(getAllCompanies()) }, [])

  const filtered = companies.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search && !c.name.includes(search) && !c.email.includes(search)) return false
    return true
  })

  const handleStatus = (id, status) => {
    updateCompany(id, { status })
    setCompanies(getAllCompanies())
  }

  const categoryLabels = { medical: t('adminCompanies', 'medical'), gym: t('adminCompanies', 'sports'), food: t('adminCompanies', 'restaurants'), fun: t('adminCompanies', 'entertainment') }
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }
  const statusLabels = { pending: t('adminCompanies', 'pending'), approved: t('adminCompanies', 'approved'), rejected: t('adminCompanies', 'rejected') }

  return (
    <>
      <Helmet><title>{t('adminCompanies', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminCompanies', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{companies.length}</p>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('adminCompanies', 'search')}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <div className="flex gap-2">
                  {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'bg-dark text-white' : 'bg-cream text-dark/60 hover:bg-dark/10'}`}>
                      {s === 'all' ? t('adminCompanies', 'all') : statusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Companies list */}
            <div className="space-y-4">
              {filtered.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center text-2xl">
                        {c.emoji || <Building2 className="text-gold/50" size={28} />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-dark">{td('companies', c.name)}</h3>
                        <p className="text-dark/50 text-sm">{c.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-dark/50">
                          <span>{categoryLabels[c.category] || c.category}</span>
                          <span>•</span>
                          <span>{td('governorates', c.city)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                      {c.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleStatus(c.id, 'approved')} className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-all" title={t('adminCompanies', 'approve')}>
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => handleStatus(c.id, 'rejected')} className="bg-red-500 text-white p-2.5 rounded-xl hover:bg-red-600 transition-all" title={t('adminCompanies', 'reject')}>
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gold/10 text-sm text-dark/50">
                    <span>{t('adminCompanies', 'views')}: {c.views}</span>
                    <span>{t('adminCompanies', 'uses')}: {c.uses}</span>
                    <span>{t('adminCompanies', 'commission')}: {c.commission}%</span>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl p-16 text-center border border-gold/10">
                  <Building2 className="text-gold/30 mx-auto mb-4" size={48} />
                  <p className="text-dark/50 font-semibold">{t('adminCompanies', 'noCompanies')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
