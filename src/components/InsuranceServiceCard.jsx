import { motion } from 'framer-motion'
import { Stethoscope, Landmark, CheckCircle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const serviceConfig = {
  medical: {
    Icon: Stethoscope,
    labelKey: 'medicalInsurance',
  },
  financial: {
    Icon: Landmark,
    labelKey: 'financialInsurance',
  },
}

export default function InsuranceServiceCard({
  enrollment,
  onConfirmSubscription,
  className = '',
}) {
  const { t, td, lang } = useLanguage()

  const { service_type, center, bank, status, enrolled_at, subscription_confirmed } = enrollment
  const config = serviceConfig[service_type] || serviceConfig.medical
  const Icon = config.Icon
  const providerName = td('medicalCenters', center?.name, 'name') || td('banks', bank?.name, 'name') || ''

  const isActive = status === 'active'
  const isConfirmed = subscription_confirmed

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 border border-gold/10 shadow-sm hover:shadow-md transition-all ${className}`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Card Header: Icon + Info */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0">
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-dark">{t('footer', config.labelKey)}</p>
          <p className="text-dark/60 text-sm truncate">{providerName}</p>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {/* Status Badge */}
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {isActive ? t('common', 'enrollActive') : t('common', 'enrollCancelled')}
            </span>
            {/* Enrollment Date */}
            <span className="text-dark/40 text-xs">
              {new Date(enrolled_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
            </span>
            {/* Confirmed Badge */}
            {isConfirmed && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-gold/10 text-gold flex items-center gap-1">
                <CheckCircle size={12} />
                {t('common', 'enrollmentConfirmed')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {isActive && !isConfirmed && (
        <div className="mt-4 pt-4 border-t border-gold/10">
          <button
            onClick={() => onConfirmSubscription?.(enrollment)}
            className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-white font-bold text-sm py-2.5 px-4 rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
          >
            {t('common', 'confirmSubscription')}
          </button>
        </div>
      )}
    </motion.div>
  )
}
