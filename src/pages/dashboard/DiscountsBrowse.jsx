import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { getApprovedDiscounts, getGovernorates, incrementDiscountUses, recordScan } from '../../data/db'
import { Search, MapPin, Tag, Building2, Percent, CheckCircle, QrCode } from 'lucide-react'

export default function DiscountsBrowse() {
  const { user, refreshUser } = useAuth()
  const { t, td, lang } = useLanguage()
  const [discounts, setDiscounts] = useState([])
  const [governorates, setGovernorates] = useState([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterTier, setFilterTier] = useState('all')
  const [filterGov, setFilterGov] = useState(user?.governorate || 'all')
  const [scannedId, setScannedId] = useState(null)

  useEffect(() => {
    setDiscounts(getApprovedDiscounts())
    setGovernorates(getGovernorates())
  }, [])

  const filtered = discounts.filter(d => {
    if (filterCat !== 'all' && d.category !== filterCat) return false
    if (filterTier !== 'all' && d.tier !== filterTier) return false
    if (filterGov !== 'all' && d.city !== filterGov) return false
    if (search && !d.name.includes(search) && !d.company_name.includes(search) && !d.city.includes(search)) return false
    return true
  })

  const handleScan = (discount) => {
    if (!user) {
      alert(t('discountsBrowse', 'loginRequired'))
      return
    }
    incrementDiscountUses(discount.id)
    recordScan(user.id, discount.id)
    refreshUser()
    setScannedId(discount.id)
    setTimeout(() => setScannedId(null), 2000)
  }

  const categoryLabels = { medical: t('adminDiscounts', 'medical'), gym: t('adminDiscounts', 'sports'), food: t('adminDiscounts', 'restaurants'), fun: t('adminDiscounts', 'entertainment') }
  const categoryColors = { medical: 'bg-blue-100 text-blue-600', gym: 'bg-orange-100 text-orange-600', food: 'bg-red-100 text-red-600', fun: 'bg-purple-100 text-purple-600' }
  const tierLabels = { free: t('discountsBrowse', 'free'), premium: t('discountsBrowse', 'premium'), elite: t('discountsBrowse', 'elite') }
  const tierColors = { free: 'bg-gray-100 text-gray-600', premium: 'bg-yellow-100 text-yellow-600', elite: 'bg-emerald-100 text-emerald-600' }

  return (
    <>
      <Helmet><title>{t('discountsBrowse', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-dark mb-2">{t('discountsBrowse', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('discountsBrowse', 'subtitle')}</p>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-8">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('discountsBrowse', 'searchPlaceholder')}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <select value={filterGov} onChange={e => setFilterGov(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('discountsBrowse', 'allGovernorates')}</option>
                  {governorates.map((g, i) => <option key={i} value={g}>{td('governorates', g)}</option>)}
                </select>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('discountsBrowse', 'allCategories')}</option>
                  <option value="medical">{t('discountsBrowse', 'medical')}</option>
                  <option value="gym">{t('discountsBrowse', 'sports')}</option>
                  <option value="food">{t('discountsBrowse', 'restaurants')}</option>
                  <option value="fun">{t('discountsBrowse', 'entertainment')}</option>
                </select>
                <select value={filterTier} onChange={e => setFilterTier(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('discountsBrowse', 'allTiers')}</option>
                  <option value="free">{t('discountsBrowse', 'free')}</option>
                  <option value="premium">{t('discountsBrowse', 'premium')}</option>
                  <option value="elite">{t('discountsBrowse', 'elite')}</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <Percent className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 font-semibold text-lg">{t('discountsBrowse', 'noDiscounts')}</p>
                <p className="text-dark/40 text-sm mt-2">{t('discountsBrowse', 'noDiscountsHint')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((discount, i) => (
                  <motion.div key={discount.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className={`bg-white rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${scannedId === discount.id ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-gold/10'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[discount.category] || ''}`}>
                        {categoryLabels[discount.category] || discount.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierColors[discount.tier] || ''}`}>
                        {tierLabels[discount.tier] || discount.tier}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2">{td('discounts', discount.name, 'name')}</h3>
                    <p className="text-dark/60 text-sm mb-4 line-clamp-2">{td('discounts', discount.name, 'description')}</p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-dark/50">
                      <span className="flex items-center gap-1"><Building2 size={14} /> {td('companies', discount.company_name)}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {td('governorates', discount.city)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-gold">{discount.discount_percent}</span>
                        <span className="text-dark/40 text-xs">{t('discountsBrowse', 'discount')}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-dark/40">
                        <span>{discount.uses} {t('discountsBrowse', 'uses')}</span>
                        {scannedId === discount.id ? (
                          <span className="text-emerald-500 flex items-center gap-1 font-bold"><CheckCircle size={16} /> {t('discountsBrowse', 'done')}</span>
                        ) : (
                          <button onClick={() => handleScan(discount)} className="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-darkLight transition-all">
                            <QrCode size={14} /> {t('discountsBrowse', 'useDiscount')}
                          </button>
                        )}
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
