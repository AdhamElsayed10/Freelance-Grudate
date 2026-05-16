import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function PricingCard({ plan, index }) {
  const { t } = useLanguage()
  return (
    <motion.div 
      className="bg-white rounded-3xl p-8 relative overflow-hidden border border-gold/15 flex flex-col h-full transition-all duration-400 hover:-translate-y-3 hover:shadow-2xl hover:shadow-dark/10 hover:border-gold/40"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="bg-gradient-to-br from-dark to-darkLight text-white p-6 -mx-8 -mt-8 mb-6 text-center rounded-t-3xl">
        <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
        <p className="text-sm opacity-80">{plan.description}</p>
      </div>
      <div className="text-center mb-8 mt-4">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-5xl font-extrabold text-dark">{plan.price}</span>
          <span className="text-dark/50 text-lg">{t('pricing', 'egp')}</span>
        </div>
        <p className="text-dark/40 text-sm mt-1">{plan.period}</p>
      </div>
      <ul className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, j) => (
          <li key={j} className="flex items-start gap-3 text-sm">
            <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="text-gold" size={12} />
            </div>
            <span className="text-dark/70">{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        to="/join"
        className="w-full bg-dark hover:bg-darkLight text-white py-4 rounded-xl font-bold transition-all text-center block mt-auto"
      >
        {plan.price === '0' ? t('pricing', 'freeCta') : t('pricing', 'paidCta')}
      </Link>
    </motion.div>
  )
}