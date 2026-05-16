import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getAllUsers, updateUser, deleteUser } from '../../data/db'
import BackButton from '../../components/BackButton'
import { Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
 
export default function AdminUsers() {
  const { t, td } = useLanguage()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => { setUsers(getAllUsers()) }, [])

  const filtered = users.filter(u =>
    u.name.includes(search) || u.email.includes(search)
  )

  const handlePlanChange = (id, plan) => {
    updateUser(id, { plan })
    setUsers(getAllUsers())
  }

  const handleDelete = (id) => {
    if (window.confirm(t('adminUsers', 'confirmDelete'))) {
      deleteUser(id)
      setUsers(getAllUsers())
    }
  }

  const planColors = { free: 'bg-gray-100 text-gray-600', premium: 'bg-yellow-100 text-yellow-700', elite: 'bg-emerald-100 text-emerald-700' }
  const planLabels = { free: t('adminUsers', 'free'), premium: t('adminUsers', 'premium'), elite: t('adminUsers', 'elite') }

  return (
    <>
      <Helmet><title>{t('adminUsers', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminUsers', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{users.length}</p>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 border border-gold/10 shadow-sm mb-6">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('adminUsers', 'search')}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
              </div>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gold/10 bg-cream">
                    <th className="p-4 text-dark font-bold text-sm">{t('adminUsers', 'name')}</th>
                    <th className="p-4 text-dark font-bold text-sm hidden md:table-cell">{t('adminUsers', 'email')}</th>
                    <th className="p-4 text-dark font-bold text-sm hidden lg:table-cell">{t('adminUsers', 'job')}</th>
                    <th className="p-4 text-dark font-bold text-sm">{t('adminUsers', 'plan')}</th>
                    <th className="p-4 text-dark font-bold text-sm hidden lg:table-cell">{t('adminUsers', 'scans')}</th>
                    <th className="p-4 text-dark font-bold text-sm hidden lg:table-cell">{t('adminUsers', 'saved')}</th>
                    <th className="p-4 text-dark font-bold text-sm">{t('adminUsers', 'actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {filtered.map((u, i) => (
                    <tr key={u.id} className="hover:bg-gold/5 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-dark">{td('users', u.name)}</p>
                          <p className="text-dark/40 text-xs" dir="ltr">{u.id}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-dark/70 text-sm">{u.email}</td>
                      <td className="p-4 hidden lg:table-cell text-dark/70 text-sm">{td('jobs', u.job)}</td>
                      <td className="p-4">
                        <select value={u.plan} onChange={e => handlePlanChange(u.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border-0 cursor-pointer outline-none ${planColors[u.plan]}`}>
                          <option value="free">{t('adminUsers', 'free')}</option>
                          <option value="premium">{t('adminUsers', 'premium')}</option>
                          <option value="elite">{t('adminUsers', 'elite')}</option>
                        </select>
                      </td>
                      <td className="p-4 hidden lg:table-cell text-dark/70 text-sm">{u.scans}</td>
                      <td className="p-4 hidden lg:table-cell text-dark/70 text-sm">{u.saved.toFixed(0)} {t('pricing', 'egp')}</td>
                      <td className="p-4">
                        <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 transition-colors p-2" title={t('adminUsers', 'delete')}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-dark/50">{t('adminUsers', 'noUsers')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
