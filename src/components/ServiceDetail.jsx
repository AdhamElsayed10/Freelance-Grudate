import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowLeft, Shield, HelpCircle, CreditCard, Star, Dumbbell, Building2, Clapperboard, Store, Mountain, TreePine } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import FAQ from './FAQ'
import { useLanguage } from '../context/LanguageContext'

/* ── StarRating component ── */
function StarRating({ rating }) {
  const stars = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} className={s <= stars ? 'text-gold fill-gold' : 'text-gray-300'} />
      ))}
    </div>
  )
}

/* ── Ticker / marquee icons map ── */
const tickerIcons = {
  gyms: <Dumbbell size={22} className="text-dark" />,
  clubs: <Building2 size={22} className="text-dark" />,
  cinemas: <Clapperboard size={22} className="text-dark" />,
  malls: <Store size={22} className="text-dark" />,
  trips: <Mountain size={22} className="text-dark" />,
  parks: <TreePine size={22} className="text-dark" />,
}

export default function ServiceDetail({ service, ticker, venues }) {
  const { t, tf, td } = useLanguage()

  if (!service) return null

  const section = service.id === 'medical-insurance' ? 'medicalInsurance'
    : service.id === 'financial-insurance' ? 'financialInsurance'
    : service.id

  const breadcrumbItems = [
    { label: t('serviceDetail', 'backToServices'), href: '/#services' },
    { label: t(section, 'heading') },
  ]

  return (
    <>
      <Helmet>
        <title>{t(section, 'title')}</title>
        <meta name="description" content={t(section, 'description')} />
        <meta property="og:title" content={t(section, 'title')} />
        <meta property="og:description" content={t(section, 'description')} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] hero-gradient flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gold/5 rounded-full top-20 -left-48 animate-float"></div>
        <div className="absolute w-72 h-72 bg-gold/5 rounded-full bottom-10 right-10 animate-float" style={{animationDelay: '-5s'}}></div>
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumb items={breadcrumbItems} />
          <motion.div 
            className="mt-8 grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2 rounded-full mb-6">
                <Star className="text-gold" size={14} />
                <span className="text-gold text-sm font-bold">{t('common', 'premiumService')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                {t(section, 'heading')}
              </h1>
              <p className="text-xl text-goldLight/80 mb-6">{t(section, 'subtitle')}</p>
              <p className="text-goldLight/70 leading-relaxed mb-8 text-lg">{t(section, 'heroText')}</p>
              <Link 
                to="/join" 
                className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20"
              >
                <CreditCard size={20} />
                {t(section, 'cta')}
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
                <img 
                  src={service.image} 
                  alt={t(section, 'heading')} 
                  className="w-full object-cover h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-dark mb-6 text-center">{t('common', 'serviceDesc')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full mb-10"></div>
            <p className="text-dark/70 leading-loose text-lg text-center">{t(section, 'longDesc')}</p>
          </motion.div>
        </div>
      </section>

      {/* Ticker Section — discounts marquee (entertainment page) */}
      {(ticker && ticker.length > 0 || venues && venues.length > 0) && (
        <section className="py-16 bg-cream overflow-hidden border-t border-gold/5">
          <div className="container mx-auto px-6 mb-10">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <Star size={24} className="text-gold" />
                <h2 className="text-2xl md:text-3xl font-bold text-dark">{t('entertainmentTicker', 'heading')}</h2>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
            </motion.div>
          </div>
          <style>{`
            @keyframes ticker-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-100%); }
            }
            .ticker-track {
              display: flex;
              width: max-content;
              animation: ticker-scroll 45s linear infinite;
            }
            .ticker-track:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="relative overflow-hidden w-full">
            <div className="ticker-track">
              {venues && venues.length > 0 ? venues.map((v) => (
                <div key={v.id} className="flex-shrink-0 w-64 mx-3 bg-white rounded-2xl border border-gold/10 shadow-sm hover:shadow-md hover:border-gold/30 transition-all overflow-hidden">
                  <div className="h-36 overflow-hidden relative">
                    <img src={v.img_url} alt={td('companies', v.name)} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-gradient-to-l from-gold to-goldLight text-dark text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      خصم {v.discount_percent}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-dark text-sm mb-1 truncate">{td('companies', v.name)}</h4>
                    <p className="text-dark/40 text-xs mb-2">{td('governorates', v.governorate)}</p>
                    <div className="flex items-center justify-between">
                      <StarRating rating={v.rating} />
                      <span className="text-xs font-bold text-gold">{v.rating}</span>
                    </div>
                  </div>
                </div>
              )) : ticker.map((item, i) => (
                <div key={i} className="flex-shrink-0 w-52 mx-3 bg-white rounded-2xl border border-gold/10 shadow-sm p-5 text-center hover:shadow-md hover:border-gold/30 transition-all">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-gold to-goldLight rounded-xl flex items-center justify-center">
                    {tickerIcons[item.icon] || <Star size={22} className="text-dark" />}
                  </div>
                  <h4 className="font-bold text-dark text-sm mb-1">{item.title}</h4>
                  <p className="text-dark/50 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t('common', 'features')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {service.features.map((feature, i) => (
              <motion.div 
                key={i}
                className="bg-white p-6 rounded-2xl border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-[#a67c3d] rounded-xl flex items-center justify-center text-dark mb-4 shadow-lg shadow-gold/20 group-hover:scale-110 transition-transform">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{tf(section, 'features', i, 'title')}</h3>
                <p className="text-dark/60 text-sm leading-relaxed">{tf(section, 'features', i, 'desc')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Table */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t('common', 'coverages')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full"></div>
          </div>
          <motion.div 
            className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-gold/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-dark to-darkLight p-6">
              <div className="flex items-center gap-3 text-white">
                <Shield className="text-gold" size={24} />
                <h3 className="text-xl font-bold">{t('common', 'coverageTable')}</h3>
              </div>
            </div>
            <div className="divide-y divide-gold/10">
              {service.coverages.map((coverage, i) => (
                <div key={i} className="flex items-center justify-between p-5 hover:bg-gold/5 transition-colors">
                  <span className="text-dark font-semibold">{tf(section, 'coverages', i, 'name')}</span>
                  <span className="bg-gold/10 text-gold px-4 py-1.5 rounded-full text-sm font-bold">{tf(section, 'coverages', i, 'value')}</span>
                </div>
              ))}
            </div>
          </motion.div>
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
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full"></div>
          </div>
          <FAQ items={service.faq.map((_, i) => ({ q: tf(section, 'faq', i, 'q'), a: tf(section, 'faq', i, 'a') }))} />

          {/* Join CTA */}
          <div className="mt-16 pt-16 border-t border-gold/10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('common', 'ctaTitle')}</h2>
              <p className="text-goldLight/70 max-w-2xl mx-auto mb-8 text-lg">{t('common', 'ctaSubtitle')}</p>
              <Link to="/join" className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
                {t('common', 'ctaButton')}
                <ArrowLeft size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
