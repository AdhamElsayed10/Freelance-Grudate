import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getAllDiscounts, updateDiscount } from '../../data/db'
import BackButton from '../../components/BackButton'
import { Search, CheckCircle, XCircle, Tag, Percent } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
 
export default function AdminDiscounts() {
  const { t, td } = useLanguage()
  const [discounts, setDiscounts] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')

  useEffect(() => { setDiscounts(getAllDiscounts()) }, [])

  const filtered = discounts.filter(d => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false
    if (catFilter !== 'all' && d.category !== catFilter) return false
    if (search && !d.name.includes(search) && !d.company_name.includes(search)) return false
    return true
  })

  const handleStatus = (id, status) => {
    updateDiscount(id, { status })
    setDiscounts(getAllDiscounts())
  }

  const categoryLabels = { medical: t('adminDiscounts', 'medical'), gym: t('adminDiscounts', 'sports'), food: t('adminDiscounts', 'restaurants'), fun: t('adminDiscounts', 'entertainment') }
  const categoryColors = { medical: 'bg-blue-100 text-blue-600', gym: 'bg-orange-100 text-orange-600', food: 'bg-red-100 text-red-600', fun: 'bg-purple-100 text-purple-600' }
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }
  const statusLabels = { pending: t('adminDiscounts', 'pending'), approved: t('adminDiscounts', 'approved'), rejected: t('adminDiscounts', 'rejected') }

  return (
    <>
      <Helmet><title>{t('adminDiscounts', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminDiscounts', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{discounts.length} {t('adminDiscounts', 'subtitle')}</p>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('adminDiscounts', 'search')}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('adminDiscounts', 'allCategories')}</option>
                  <option value="medical">{t('adminDiscounts', 'medical')}</option>
                  <option value="gym">{t('adminDiscounts', 'sports')}</option>
                  <option value="food">{t('adminDiscounts', 'restaurants')}</option>
                  <option value="fun">{t('adminDiscounts', 'entertainment')}</option>
                </select>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'bg-dark text-white' : 'bg-cream text-dark/60 hover:bg-dark/10'}`}>
                      {s === 'all' ? t('adminDiscounts', 'all') : statusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Discounts list */}
            <div className="space-y-4">
              {filtered.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-dark truncate">{td('discounts', d.name, 'name')}</h3>
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${categoryColors[d.category] || ''}`}>
                          {categoryLabels[d.category] || d.category}
                        </span>
                      </div>
                      <p className="text-dark/50 text-sm">{t('adminDiscounts', 'byCompany')} {td('companies', d.company_name)}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-dark/50">
                        <span className="flex items-center gap-1"><Percent size={14} /> {d.discount_percent}</span>
                        <span>📍 {td('governorates', d.city)}</span>
                        <span>🏷️ {d.tier}</span>
                        <span>👁️ {d.views}</span>
                        <span>🔄 {d.uses}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusColors[d.status]}`}>{statusLabels[d.status]}</span>
                      {d.status === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => handleStatus(d.id, 'approved')} className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-all" title={t('adminDiscounts', 'approve')}>
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => handleStatus(d.id, 'rejected')} className="bg-red-500 text-white p-2.5 rounded-xl hover:bg-red-600 transition-all" title={t('adminDiscounts', 'reject')}>
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl p-16 text-center border border-gold/10">
                  <Tag className="text-gold/30 mx-auto mb-4" size={48} />
                  <p className="text-dark/50 font-semibold">{t('adminDiscounts', 'noDiscounts')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
