import { motion } from 'framer-motion'
import {
  Tag, DollarSign, Calendar, Clock, Info, Users,
  Shield, Building2, Gift, Hash, Mail, Phone,
  MapPin, CheckCircle2, XCircle, Activity, ArrowLeft,
  Percent, BarChart3,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

// ── Status badge ────────────────────────────────────────────
const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-500',
}
function StatusBadge({ status }) {
  const cls = statusColors[status] || 'bg-gray-100 text-gray-600'
  return <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${cls}`}>{status}</span>
}

// ── Info Pill ───────────────────────────────────────────────
function Pill({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gold/5 flex items-start gap-2.5">
      {Icon && <Icon size={15} className="text-gold/50 shrink-0 mt-0.5" />}
      <div className="min-w-0">
        <p className="text-dark/40 text-[10px]">{label}</p>
        <p className="text-dark font-bold text-sm break-words">{value || '—'}</p>
      </div>
    </div>
  )
}

// ── Section wrapper ─────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-cream rounded-xl p-5 border border-gold/10">
      <h4 className="flex items-center gap-2 font-bold text-dark mb-3">
        {Icon && <Icon size={16} className="text-gold" />}
        {title}
      </h4>
      {children}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────
export default function ServiceDetailModal({ service, onBack }) {
  const { lang } = useLanguage()

  if (!service) {
    return (
      <div className="flex items-center justify-center py-16 text-dark/50">
        {lang === 'ar' ? 'لا توجد بيانات للخدمة' : 'No service data'}
      </div>
    )
  }

  const svcName = service.name[lang] || service.name.ar || service.name.en || service.name
  const catName = service.category[lang] || service.category.ar || service.category.en || service.category
  const isActive = service.status === 'active'
  const ben = service.beneficiary
  const dp = service.discountProvider
  const cmp = service.company

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Back button */}
      {onBack && (
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-gold hover:text-gold/70 transition-colors text-sm font-semibold">
          <ArrowLeft size={16} />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </button>
      )}

      {/* ── Service Header ── */}
      <div className="bg-gradient-to-br from-gold/10 to-cream rounded-xl p-6 border border-gold/20">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-gold/60 text-xs font-semibold mb-0.5">
              {lang === 'ar' ? 'تفاصيل الخدمة' : 'Service Details'}
            </p>
            <h3 className="text-xl font-bold text-dark mb-1">{svcName}</h3>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={service.status} />
              <span className="text-dark/40 text-xs">#{service.id}</span>
            </div>
          </div>
          <div className="text-left">
            <p className="text-dark/40 text-xs">{lang === 'ar' ? 'السعر النهائي' : 'Final Price'}</p>
            <p className="text-2xl font-bold text-dark">{service.finalPrice.toLocaleString()} <span className="text-sm text-dark/50">EGP</span></p>
            {service.discountApplied > 0 && (
              <p className="text-emerald-600 text-xs font-semibold mt-0.5">
                {service.discountApplied}% {lang === 'ar' ? 'خصم' : 'discount'} (-{service.discountValue} EGP)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Service Info Grid ── */}
      <div className="grid md:grid-cols-2 gap-3">
        <Pill label={lang === 'ar' ? 'التصنيف' : 'Category'} value={catName} icon={Tag} />
        <Pill label={lang === 'ar' ? 'السعر الأصلي' : 'Original Price'} value={`${service.price} EGP`} icon={DollarSign} />
        <Pill label={lang === 'ar' ? 'نسبة الخصم' : 'Discount'} value={service.discountApplied > 0 ? `${service.discountApplied}%` : (lang === 'ar' ? 'بدون خصم' : 'No discount')} icon={Percent} />
        <Pill label={lang === 'ar' ? 'مقدم الخدمة' : 'Provider'} value={service.providerType[lang] || service.providerType.ar || service.providerType.en || service.providerType} icon={Shield} />
        <Pill label={lang === 'ar' ? 'تاريخ الإنشاء' : 'Created'} value={service.createdAt} icon={Calendar} />
        <Pill label={lang === 'ar' ? 'آخر تحديث' : 'Last Updated'} value={service.updatedAt} icon={Clock} />
      </div>

      {/* ── Description ── */}
      <Section title={lang === 'ar' ? 'الوصف' : 'Description'} icon={Info}>
        <div className="bg-white rounded-lg p-3.5 border border-gold/5">
          <p className="text-dark/70 text-sm leading-relaxed">
            {service.description[lang] || service.description.ar || service.description.en || service.description}
          </p>
        </div>
      </Section>

      {/* ── Beneficiary Section ── */}
      {ben && (
        <Section title={lang === 'ar' ? 'بيانات المستفيد' : 'Beneficiary Information'} icon={Users}>
          <div className="bg-white rounded-lg p-4 border border-gold/5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold text-dark">{ben.fullName[lang] || ben.fullName.ar || ben.fullName.en || ben.fullName}</p>
                <p className="text-dark/40 text-xs">#{ben.id}</p>
              </div>
              <StatusBadge status={ben.subscriptionStatus} />
            </div>
            <div className="grid md:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-dark/60">
                <Mail size={12} /> {ben.email}
              </div>
              <div className="flex items-center gap-1.5 text-dark/60">
                <Phone size={12} /> {ben.phone}
              </div>
              <div className="flex items-center gap-1.5 text-dark/60">
                <Calendar size={12} />
                {lang === 'ar' ? 'التسجيل' : 'Reg'}: {ben.registrationDate}
              </div>
              <div className="flex items-center gap-1.5 text-dark/60">
                <Clock size={12} />
                {lang === 'ar' ? 'التفعيل' : 'Activation'}: {ben.activationDate}
              </div>
            </div>
            {ben.associatedServices && ben.associatedServices.length > 0 && (
              <div className="pt-2 border-t border-gold/5">
                <p className="text-dark/40 text-[10px] mb-1">
                  {lang === 'ar' ? 'الخدمات المرتبطة' : 'Associated Services'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ben.associatedServices.map((s, i) => (
                    <span key={i} className="text-[11px] bg-gold/5 text-dark/70 px-2 py-0.5 rounded-full">
                      {s[lang] || s.ar || s.en || s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ── Discount Provider Section ── */}
      {dp && (
        <Section title={lang === 'ar' ? 'مزود الخصم' : 'Discount Provider'} icon={Gift}>
          <div className="bg-white rounded-lg p-4 border border-gold/5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold text-dark">{dp.name[lang] || dp.name.ar || dp.name.en || dp.name}</p>
                <p className="text-dark/40 text-xs">{lang === 'ar' ? 'الكود' : 'Code'}: {dp.code}</p>
              </div>
              <div className="text-left">
                <span className="text-lg font-bold text-emerald-600">{dp.percentage}%</span>
                <span className="text-dark/40 text-xs block">({dp.value} EGP)</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-dark/60">
                <Calendar size={12} />
                {lang === 'ar' ? 'تاريخ الانتهاء' : 'Expires'}: {dp.expirationDate}
              </div>
            </div>
            {/* Usage bar */}
            {dp.usageStats && (
              <div className="pt-2 border-t border-gold/5">
                <div className="flex items-center justify-between text-[10px] text-dark/50 mb-1">
                  <span className="flex items-center gap-1"><BarChart3 size={11} />{lang === 'ar' ? 'الإحصائيات' : 'Usage Stats'}</span>
                  <span>{dp.usageStats.totalUsed} / {dp.usageStats.totalLimit}</span>
                </div>
                <div className="w-full bg-gold/10 rounded-full h-2 overflow-hidden">
                  <div className="bg-gold h-full rounded-full"
                    style={{ width: `${Math.min(100, (dp.usageStats.totalUsed / dp.usageStats.totalLimit) * 100)}%` }}
                  />
                </div>
                <p className="text-dark/40 text-[10px] mt-1">
                  {dp.usageStats.remainingLimit} {lang === 'ar' ? 'متبقي' : 'remaining'}
                </p>
              </div>
            )}
            {dp.providerDetails && (
              <div className="pt-2 border-t border-gold/5">
                <p className="text-dark/60 text-xs leading-relaxed">
                  {dp.providerDetails[lang] || dp.providerDetails.ar || dp.providerDetails.en || dp.providerDetails}
                </p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ── Company Section ── */}
      {cmp && (
        <Section title={lang === 'ar' ? 'بيانات الشركة' : 'Company Information'} icon={Building2}>
          <div className="bg-white rounded-lg p-4 border border-gold/5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold text-dark">{cmp.name[lang] || cmp.name.ar || cmp.name.en || cmp.name}</p>
                <p className="text-dark/40 text-xs">#{cmp.id}</p>
              </div>
              <StatusBadge status={cmp.status} />
            </div>
            <div className="grid md:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-dark/60">
                <Mail size={12} /> {cmp.email}
              </div>
              <div className="flex items-center gap-1.5 text-dark/60">
                <Phone size={12} /> {cmp.phone}
              </div>
              <div className="flex items-center gap-1.5 text-dark/60">
                <MapPin size={12} />
                {cmp.address[lang] || cmp.address.ar || cmp.address.en || cmp.address}
              </div>
              <div className="flex items-center gap-1.5 text-dark/60">
                <Calendar size={12} />
                {lang === 'ar' ? 'تاريخ التسجيل' : 'Registered'}: {cmp.registrationDate}
              </div>
              <div className="flex items-center gap-1.5 text-dark/60">
                <Tag size={12} />
                {cmp.type}
              </div>
              <div className="flex items-center gap-1.5 text-dark/60">
                <Activity size={12} />
                {lang === 'ar' ? 'خصومات نشطة' : 'Active Discounts'}: {cmp.activeDiscounts ?? '—'}
              </div>
            </div>
            {cmp.associatedServices && cmp.associatedServices.length > 0 && (
              <div className="pt-2 border-t border-gold/5">
                <p className="text-dark/40 text-[10px] mb-1">
                  {lang === 'ar' ? 'الخدمات المرتبطة' : 'Associated Services'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cmp.associatedServices.map((s, i) => (
                    <span key={i} className="text-[11px] bg-gold/5 text-dark/70 px-2 py-0.5 rounded-full">
                      {s[lang] || s.ar || s.en || s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ── Empty fallback ── */}
      {!ben && !dp && !cmp && (
        <div className="bg-cream rounded-xl p-6 border border-gold/10 text-center text-dark/40 text-sm">
          {lang === 'ar' ? 'لا توجد بيانات إضافية متاحة لهذه الخدمة' : 'No additional data available for this service'}
        </div>
      )}
    </motion.div>
  )
}
