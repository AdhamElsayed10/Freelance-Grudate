import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getAllCompanies, getAllUsers, updateCompany, getDiscountsByCompany, getAllUserScans } from '../../data/db'
import BackButton from '../../components/BackButton'
import { Search, CheckCircle, XCircle, Building2, BarChart3, Eye, MousePointerClick, UserCheck, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

function formatDate(iso) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function getCompanyUsage(companyId) {
  const discounts = getDiscountsByCompany(companyId)
  const allScans = getAllUserScans()
  const users = getAllUsers()
  const userMap = {}
  users.forEach(u => { userMap[u.id] = u })

  const discountIds = discounts.map(d => d.id)
  const companyScans = allScans
    .filter(s => discountIds.includes(s.discount_id))
    .map(s => {
      const discount = discounts.find(d => d.id === s.discount_id)
      const user = userMap[s.user_id] || null
      return {
        ...s,
        discountName: discount ? discount.name : '—',
        userName: user ? user.name : s.user_id,
      }
    })
    .sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at))

  const uniqueUserIds = new Set(companyScans.map(s => s.user_id))

  return { discounts, companyScans, uniqueUsers: uniqueUserIds.size, totalScans: companyScans.length }
}

export default function AdminCompanies() {
  const { t, td } = useLanguage()
  const [companies, setCompanies] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

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

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const categoryLabels = { medical: t('adminCompanies', 'medical'), gym: t('adminCompanies', 'sports'), food: t('adminCompanies', 'restaurants'), fun: t('adminCompanies', 'entertainment') }
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }
  const statusLabels = { pending: t('adminCompanies', 'pending'), approved: t('adminCompanies', 'approved'), rejected: t('adminCompanies', 'rejected') }

  const planColors = { free: 'bg-gray-100 text-gray-600', premium: 'bg-yellow-100 text-yellow-700', elite: 'bg-emerald-100 text-emerald-700' }
  const planLabels = { free: 'Free', premium: 'Premium', elite: 'Elite' }

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
              {filtered.map((c, i) => {
                const isExpanded = expandedId === c.id
                const usage = isExpanded ? getCompanyUsage(c.id) : null

                return (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
                    {/* Company card header */}
                    <div className="p-6">
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
                        <span className="flex items-center gap-1.5"><Eye size={14} /> {t('adminCompanies', 'views')}: {c.views}</span>
                        <span className="flex items-center gap-1.5"><MousePointerClick size={14} /> {t('adminCompanies', 'uses')}: {c.uses}</span>
                        <span className="flex items-center gap-1.5">{t('adminCompanies', 'commission')}: {c.commission}%</span>
                      </div>
                      {/* View Usage toggle */}
                      <button onClick={() => toggleExpand(c.id)}
                        className="mt-4 flex items-center gap-2 text-sm font-bold text-gold hover:text-gold/70 transition-colors">
                        <BarChart3 size={16} />
                        {isExpanded ? t('adminCompanies', 'hideUsage') : t('adminCompanies', 'viewUsage')}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {/* Expanded usage details */}
                    {isExpanded && usage && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gold/10 bg-cream/50">
                        <div className="p-6 space-y-6">
                          {/* Summary stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center gap-2 text-gold mb-1">
                                <Building2 size={16} />
                                <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'discountBreakdown')}</span>
                              </div>
                              <p className="text-2xl font-bold text-dark">{usage.discounts.length}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center gap-2 text-gold mb-1">
                                <UserCheck size={16} />
                                <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'uniqueUsers')}</span>
                              </div>
                              <p className="text-2xl font-bold text-dark">{usage.uniqueUsers}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center gap-2 text-gold mb-1">
                                <MousePointerClick size={16} />
                                <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'totalScans')}</span>
                              </div>
                              <p className="text-2xl font-bold text-dark">{usage.totalScans}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center gap-2 text-gold mb-1">
                                <Eye size={16} />
                                <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'views')}</span>
                              </div>
                              <p className="text-2xl font-bold text-dark">{c.views}</p>
                            </div>
                          </div>

                          {/* Discounts breakdown table */}
                          <div>
                            <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
                              <BarChart3 size={16} className="text-gold" />
                              {t('adminCompanies', 'discountBreakdown')}
                            </h4>
                            {usage.discounts.length === 0 ? (
                              <div className="bg-white rounded-xl p-6 text-center border border-gold/10">
                                <p className="text-dark/50 text-sm font-semibold">{t('adminCompanies', 'noUsageDiscounts')}</p>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl border border-gold/10 overflow-x-auto">
                                <table className="w-full text-right">
                                  <thead>
                                    <tr className="border-b border-gold/10 bg-cream">
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountName')}</th>
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'tier')}</th>
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountUses')}</th>
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountViews')}</th>
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'status')}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gold/5">
                                    {usage.discounts.map(d => (
                                      <tr key={d.id} className="hover:bg-gold/5 transition-colors">
                                        <td className="p-3 text-sm text-dark font-semibold">{td('discounts', d.name, 'name')}</td>
                                        <td className="p-3">
                                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${planColors[d.tier]}`}>
                                            {planLabels[d.tier] || d.tier}
                                          </span>
                                        </td>
                                        <td className="p-3 text-sm text-dark/70">{d.uses}</td>
                                        <td className="p-3 text-sm text-dark/70">{d.views}</td>
                                        <td className="p-3">
                                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[d.status]}`}>
                                            {statusLabels[d.status] || d.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                          {/* Scan history table */}
                          <div>
                            <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
                              <Calendar size={16} className="text-gold" />
                              {t('adminCompanies', 'scanHistory')}
                            </h4>
                            {usage.companyScans.length === 0 ? (
                              <div className="bg-white rounded-xl p-6 text-center border border-gold/10">
                                <p className="text-dark/50 text-sm font-semibold">{t('adminCompanies', 'noScans')}</p>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl border border-gold/10 overflow-x-auto">
                                <table className="w-full text-right">
                                  <thead>
                                    <tr className="border-b border-gold/10 bg-cream">
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'userName')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'invoice')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'discountName')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'product')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden lg:table-cell">{t('adminCompanies', 'originalPrice')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden lg:table-cell">{t('adminCompanies', 'discountValue')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'priceAfter')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'scanDate')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'scanTime')}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gold/5">
                                    {usage.companyScans.map((s, idx) => (
                                      <tr key={`${s.user_id}-${s.discount_id}-${idx}`} className="hover:bg-gold/5 transition-colors">
                                        <td className="p-3">
                                          <div>
                                            <p className="text-sm text-dark font-semibold">{s.userName}</p>
                                            <p className="text-xs text-dark/40" dir="ltr">{s.user_id}</p>
                                          </div>
                                        </td>
                                        <td className="p-3 text-sm hidden md:table-cell">
                                          <span className="font-mono text-xs text-dark/60" dir="ltr">{s.invoice_id || '—'}</span>
                                        </td>
                                        <td className="p-3 text-sm text-dark/70">{td('discounts', s.discountName, 'name')}</td>
                                        <td className="p-3 text-sm text-dark/70 hidden md:table-cell">{s.product || '—'}</td>
                                        <td className="p-3 text-sm text-dark/70 hidden lg:table-cell">
                                          {s.original_price != null ? `${s.original_price.toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                                        </td>
                                        <td className="p-3 text-sm hidden lg:table-cell">
                                          {s.discount_value != null ? (
                                            <span className="text-emerald-600 font-semibold">
                                              -{s.discount_value.toLocaleString()} {t('pricing', 'egp')}
                                              {s.discount_percent && <span className="text-dark/40 text-xs font-normal mr-1">({s.discount_percent})</span>}
                                            </span>
                                          ) : '—'}
                                        </td>
                                        <td className="p-3 text-sm text-dark font-semibold hidden md:table-cell">
                                          {s.final_price != null ? `${s.final_price.toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                                        </td>
                                        <td className="p-3 text-sm text-dark/70">{formatDate(s.scanned_at)}</td>
                                        <td className="p-3 text-sm text-dark/70 hidden md:table-cell" dir="ltr">{formatTime(s.scanned_at)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
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
