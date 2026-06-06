import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign, TrendingUp, TrendingDown, Activity,
  Tag, ArrowUpRight, ArrowLeft, ArrowRight,
  Calendar, Clock, Shield, CreditCard, Hash, Info,
  Users, CheckCircle2, AlertCircle, XCircle,
  Building2, Gift, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { generateRevenueItems } from '../../data/adminMockData'
import Modal from '../Modal'
import ServiceDetailModal from './ServiceDetailModal'

// ── Styling helpers ────────────────────────────────────────
const trendColors = {
  increase: 'text-emerald-600 bg-emerald-50',
  decrease: 'text-red-600 bg-red-50',
}
const trendArrows = { increase: TrendingUp, decrease: TrendingDown }

const statusStyle = {
  'مكتمل': 'bg-emerald-100 text-emerald-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'معلق': 'bg-yellow-100 text-yellow-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'قيد المراجعة': 'bg-blue-100 text-blue-700',
  'Under Review': 'bg-blue-100 text-blue-700',
  'مؤجل': 'bg-orange-100 text-orange-700',
  'Deferred': 'bg-orange-100 text-orange-700',
  active: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
}

function StatusBadge({ status }) {
  const cls = statusStyle[status] || 'bg-gray-100 text-gray-600'
  return <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${cls}`}>{status}</span>
}

function Pill({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gold/5 flex items-start gap-2.5">
      {Icon && <Icon size={15} className="text-gold/50 shrink-0 mt-0.5" />}
      <div className="min-w-0">
        <p className="text-dark/40 text-[10px]">{label}</p>
        <p className="text-dark font-bold text-sm break-words">{value}</p>
      </div>
    </div>
  )
}

function LoadingState({ lang }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-dark/50 text-sm">{lang === 'ar' ? 'جاري تحميل البيانات...' : 'Loading data...'}</p>
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry, lang }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
          <TrendingDown size={28} className="text-red-500" />
        </div>
        <p className="text-red-600 font-bold mb-2">{error}</p>
        <button onClick={onRetry}
          className="px-4 py-2 bg-gold text-white rounded-xl text-sm font-bold hover:bg-gold/90 transition-colors">
          {lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}
        </button>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          {Icon ? <Icon size={28} className="text-gray-400" /> : <DollarSign size={28} className="text-gray-400" />}
        </div>
        <p className="text-dark/50">{message}</p>
      </div>
    </div>
  )
}

// ── View: Revenue Items List ───────────────────────────────
function RevenueListView({ items, onItemClick, lang, t }) {
  return (
    <div className="grid gap-4">
      {/* Summary bar */}
      <div className="bg-cream rounded-xl p-4 border border-gold/10 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-dark/70">
          <DollarSign size={16} className="text-gold" />
          <span className="font-bold text-dark">
            {items.reduce((s, i) => s + i.totalRevenue, 0).toLocaleString()}
          </span>
          <span className="text-dark/40">{t('pricing', 'egp')}</span>
        </div>
        <div className="flex items-center gap-2 text-dark/70">
          <Activity size={16} className="text-dark/40" />
          <span>{lang === 'ar' ? 'إجمالي البنود' : 'Total Items'}: <strong>{items.length}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-dark/70">
          <Shield size={16} className="text-dark/40" />
          <span>{lang === 'ar' ? 'الاشتراكات' : 'Subscriptions'}: <strong>{items.reduce((s, i) => s + i.subscriptions.length, 0)}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-dark/70">
          <Calendar size={16} className="text-dark/40" />
          <span>{lang === 'ar' ? 'الأقساط' : 'Installments'}: <strong>{items.reduce((s, i) => s + i.installments.length, 0)}</strong></span>
        </div>
      </div>

      {/* Revenue cards */}
      <AnimatePresence mode="popLayout">
        {items.map((item, idx) => {
          const TrendIcon = trendArrows[item.trend]
          const statusKey = item.status[lang] || item.status.ar || item.status.en || item.status
          return (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onItemClick(item)}
              className="w-full text-right bg-white rounded-xl p-5 border border-gold/10 shadow-sm hover:shadow-md hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="font-bold text-dark text-sm">
                      {item.title[lang] || item.title.ar || item.title.en || item.title}
                    </h4>
                    <StatusBadge status={statusKey} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                    <span className="text-dark font-bold text-lg">
                      {item.totalRevenue.toLocaleString()} {t('pricing', 'egp')}
                    </span>
                    <span className="flex items-center gap-1 text-dark/50">
                      <Activity size={12} />
                      {item.transactions} {lang === 'ar' ? 'معاملة' : 'trans'}
                    </span>
                    <span className="flex items-center gap-1 text-dark/50">
                      <Shield size={12} />
                      {item.subscriptions.length} {lang === 'ar' ? 'اشتراك' : 'subs'}
                    </span>
                    <span className="flex items-center gap-1 text-dark/50">
                      <Calendar size={12} />
                      {item.installments.length} {lang === 'ar' ? 'قسط' : 'insts'}
                    </span>
                    <span className={`flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded ${trendColors[item.trend]}`}>
                      <TrendIcon size={12} />
                      {item.trendPercent}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gold/40 group-hover:text-gold/70 transition-colors shrink-0">
                  <span className="text-xs hidden md:inline">
                    {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </span>
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ── View: Single Revenue Item with Subscriptions & Installments ──
function RevenueItemView({ item, onBack, onSubClick, onInstClick, lang, t }) {
  const statusKey = item.status[lang] || item.status.ar || item.status.en || item.status

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="space-y-5"
    >
      {/* Back */}
      <button onClick={onBack}
        className="flex items-center gap-1.5 text-gold hover:text-gold/70 transition-colors text-sm font-semibold">
        <ArrowLeft size={16} />
        {lang === 'ar' ? 'العودة إلى القائمة' : 'Back to List'}
      </button>

      {/* Header */}
      <div className="bg-gradient-to-br from-gold/10 to-cream rounded-xl p-6 border border-gold/20">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-xl font-bold text-dark mb-1">
              {item.title[lang] || item.title.ar || item.title.en || item.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={statusKey} />
              <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold ${trendColors[item.trend]}`}>
                {item.trend === 'increase' ? (lang === 'ar' ? 'ارتفاع' : 'Up') : (lang === 'ar' ? 'انخفاض' : 'Down')} {item.trendPercent}%
              </span>
            </div>
          </div>
          <div className="text-left">
            <p className="text-dark/40 text-xs">{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</p>
            <p className="text-3xl font-bold text-dark">{item.totalRevenue.toLocaleString()} <span className="text-lg text-dark/50">{t('pricing', 'egp')}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Pill label={lang === 'ar' ? 'المعاملات' : 'Transactions'} value={item.transactions} icon={Activity} />
          <Pill label={lang === 'ar' ? 'الخصم المطبق' : 'Applied Discount'} value={`${item.appliedDiscount}%`} icon={Tag} />
          <Pill label={lang === 'ar' ? 'تاريخ الإنشاء' : 'Created'} value={new Date(item.createdAt).toLocaleDateString()} icon={Calendar} />
          <Pill label={lang === 'ar' ? 'آخر تحديث' : 'Updated'} value={new Date(item.updatedAt).toLocaleDateString()} icon={Clock} />
        </div>
      </div>

      {/* Subscriptions */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="flex items-center gap-2 font-bold text-dark mb-3">
          <Shield size={16} className="text-gold" />
          {lang === 'ar' ? 'الاشتراكات' : 'Subscriptions'} ({item.subscriptions.length})
        </h4>
        <div className="grid gap-2">
          {item.subscriptions.map((sub, si) => (
            <button key={sub.id} onClick={() => onSubClick(si)}
              className="text-right bg-white rounded-lg p-3.5 border border-gold/5 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer w-full group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-dark text-sm">
                      {sub.name[lang] || sub.name.ar || sub.name.en || sub.name}
                    </span>
                    <StatusBadge status={sub.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-dark/50">
                    <span className="flex items-center gap-1"><Calendar size={11} />{sub.startDate}</span>
                    <span className="flex items-center gap-1"><CreditCard size={11} />{sub.amountPaid.toFixed(0)} {t('pricing', 'egp')}</span>
                    <span className="flex items-center gap-1"><Tag size={11} />{sub.type}</span>
                    <span className="flex items-center gap-1"><Activity size={11} />{sub.services.length} {lang === 'ar' ? 'خدمة' : 'services'}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gold/30 group-hover:text-gold/60 transition-colors shrink-0" />
              </div>
            </button>
          ))}
          {item.subscriptions.length === 0 && (
            <p className="text-dark/40 text-xs text-center py-3">{lang === 'ar' ? 'لا توجد اشتراكات' : 'No subscriptions'}</p>
          )}
        </div>
      </div>

      {/* Installments */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="flex items-center gap-2 font-bold text-dark mb-3">
          <Calendar size={16} className="text-gold" />
          {lang === 'ar' ? 'الأقساط' : 'Installments'} ({item.installments.length})
        </h4>
        <div className="grid gap-2">
          {item.installments.map((inst, ii) => (
            <button key={inst.id} onClick={() => onInstClick(ii)}
              className="text-right bg-white rounded-lg p-3.5 border border-gold/5 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer w-full group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-dark text-sm">
                      {inst.name[lang] || inst.name.ar || inst.name.en || inst.name}
                    </span>
                    <StatusBadge status={inst.status === 'completed' ? 'Completed' : inst.status === 'active' ? 'معلق' : inst.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-dark/50">
                    <span className="flex items-center gap-1"><DollarSign size={11} />{inst.monthlyAmount.toFixed(0)} {t('pricing', 'egp')}/{lang === 'ar' ? 'شهر' : 'mo'}</span>
                    <span className="flex items-center gap-1 text-emerald-600">{lang === 'ar' ? 'المدفوع' : 'Paid'}: {inst.paidAmount.toFixed(0)}</span>
                    <span className="flex items-center gap-1 text-orange-600">{lang === 'ar' ? 'المتبقي' : 'Left'}: {inst.remainingAmount.toFixed(0)}</span>
                    <span className="flex items-center gap-1">{lang === 'ar' ? 'الاستحقاق' : 'Due'}: {inst.nextDueDate}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gold/30 group-hover:text-gold/60 transition-colors shrink-0" />
              </div>
            </button>
          ))}
          {item.installments.length === 0 && (
            <p className="text-dark/40 text-xs text-center py-3">{lang === 'ar' ? 'لا توجد أقساط' : 'No installments'}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="flex items-center gap-2 font-bold text-dark mb-2">
          <Info size={16} className="text-gold" />
          {lang === 'ar' ? 'ملاحظات' : 'Notes'}
        </h4>
        <div className="bg-white rounded-lg p-3 border border-gold/5">
          <p className="text-dark/70 text-sm leading-relaxed">{item.notes[lang] || item.notes.ar || item.notes.en}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ── View: Subscription Detail ──────────────────────────────
function SubscriptionDetailView({ subscription, currentIndex, totalCount, onPrev, onNext, onBack, onServiceClick, lang, t }) {
  if (!subscription) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="space-y-5"
    >
      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-gold hover:text-gold/70 transition-colors text-sm font-semibold">
          <ArrowLeft size={16} />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </button>
        {totalCount > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={onPrev} disabled={currentIndex === 0}
              className="p-1.5 rounded-lg hover:bg-gold/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
              <ChevronRight size={18} className="text-gold" />
            </button>
            <span className="text-dark/40 text-xs">{currentIndex + 1} / {totalCount}</span>
            <button onClick={onNext} disabled={currentIndex === totalCount - 1}
              className="p-1.5 rounded-lg hover:bg-gold/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
              <ChevronLeft size={18} className="text-gold" />
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 to-cream rounded-xl p-6 border border-purple-200">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-purple-600 text-xs font-semibold mb-0.5">{lang === 'ar' ? 'تفاصيل الاشتراك' : 'Subscription Details'}</p>
            <h3 className="text-xl font-bold text-dark">
              {subscription.name[lang] || subscription.name.ar || subscription.name.en || subscription.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={subscription.status} />
              <span className="text-dark/40 text-xs">#{subscription.id}</span>
            </div>
          </div>
          <div className="text-left">
            <p className="text-dark/40 text-xs">{lang === 'ar' ? 'المبلغ المدفوع' : 'Amount Paid'}</p>
            <p className="text-2xl font-bold text-dark">{subscription.amountPaid.toFixed(2)} <span className="text-sm text-dark/50">{t('pricing', 'egp')}</span></p>
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid md:grid-cols-2 gap-3">
        <Pill label={lang === 'ar' ? 'معرف الاشتراك' : 'Subscription ID'} value={subscription.id} icon={Hash} />
        <Pill label={lang === 'ar' ? 'نوع الاشتراك' : 'Type'} value={subscription.type} icon={Tag} />
        <Pill label={lang === 'ar' ? 'تاريخ البدء' : 'Start Date'} value={subscription.startDate} icon={Calendar} />
        <Pill label={lang === 'ar' ? 'تاريخ الانتهاء' : 'End Date'} value={subscription.endDate} icon={Calendar} />
        <Pill label={lang === 'ar' ? 'تاريخ التجديد' : 'Renewal Date'} value={subscription.renewalDate} icon={Clock} />
        <Pill label={lang === 'ar' ? 'المبلغ المتبقي' : 'Remaining'} value={subscription.remainingAmount > 0 ? `${subscription.remainingAmount.toFixed(2)} ${t('pricing', 'egp')}` : (lang === 'ar' ? 'مسدد بالكامل' : 'Fully Paid')} icon={DollarSign} />
        <Pill label={lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'} value={subscription.paymentMethod} icon={CreditCard} />
        <Pill label={lang === 'ar' ? 'معلومات التقسيط' : 'Installment Info'} value={subscription.installmentInfo[lang] || subscription.installmentInfo.ar || subscription.installmentInfo.en} icon={Info} />
        <Pill label={lang === 'ar' ? 'تاريخ الإنشاء' : 'Created At'} value={subscription.createdAt} icon={Calendar} />
        <Pill label={lang === 'ar' ? 'آخر تحديث' : 'Last Updated'} value={subscription.updatedAt} icon={Clock} />
      </div>

      {/* Services */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="flex items-center gap-2 font-bold text-dark mb-3">
          <Activity size={16} className="text-gold" />
          {lang === 'ar' ? 'الخدمات المرتبطة' : 'Linked Services'} ({subscription.services.length})
        </h4>
        <div className="grid gap-2">
          {subscription.services.map((svc) => (
            <button key={svc.id} onClick={() => onServiceClick(svc)}
              className="text-right bg-white rounded-lg p-3.5 border border-gold/5 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer w-full group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-dark text-sm">{svc.name[lang] || svc.name.ar || svc.name.en || svc.name}</span>
                    <StatusBadge status={svc.status === 'active' ? (lang === 'ar' ? 'نشط' : 'active') : (lang === 'ar' ? 'غير نشط' : 'inactive')} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-dark/50">
                    <span className="flex items-center gap-1"><DollarSign size={11} />{svc.price} EGP</span>
                    <span className="flex items-center gap-1"><Tag size={11} />{svc.category[lang] || svc.category.ar || svc.category.en}</span>
                    <span className="flex items-center gap-1 text-emerald-600">{svc.discountApplied}% {lang === 'ar' ? 'خصم' : 'off'}</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gold/30 group-hover:text-gold/60 transition-colors shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg p-4 border border-gold/5">
        <p className="text-dark/60 text-sm leading-relaxed">
          {subscription.notes[lang] || subscription.notes.ar || subscription.notes.en}
        </p>
      </div>
    </motion.div>
  )
}

// ── View: Installment Detail ───────────────────────────────
function InstallmentDetailView({ installment, currentIndex, totalCount, onPrev, onNext, onBack, onServiceClick, lang, t }) {
  if (!installment) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      className="space-y-5"
    >
      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack}
          className="flex items-center gap-1.5 text-gold hover:text-gold/70 transition-colors text-sm font-semibold">
          <ArrowLeft size={16} />
          {lang === 'ar' ? 'العودة' : 'Back'}
        </button>
        {totalCount > 1 && (
          <div className="flex items-center gap-2">
            <button onClick={onPrev} disabled={currentIndex === 0}
              className="p-1.5 rounded-lg hover:bg-gold/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
              <ChevronRight size={18} className="text-gold" />
            </button>
            <span className="text-dark/40 text-xs">{currentIndex + 1} / {totalCount}</span>
            <button onClick={onNext} disabled={currentIndex === totalCount - 1}
              className="p-1.5 rounded-lg hover:bg-gold/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed">
              <ChevronLeft size={18} className="text-gold" />
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 to-cream rounded-xl p-6 border border-blue-200">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-600 text-xs font-semibold mb-0.5">{lang === 'ar' ? 'تفاصيل القسط' : 'Installment Details'}</p>
            <h3 className="text-xl font-bold text-dark">
              {installment.name[lang] || installment.name.ar || installment.name.en || installment.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={installment.status === 'completed' ? 'Completed' : installment.status === 'active' ? 'معلق' : installment.status} />
              <span className="text-dark/40 text-xs">#{installment.id}</span>
            </div>
          </div>
          <div className="text-left">
            <p className="text-dark/40 text-xs">{lang === 'ar' ? 'القسط الشهري' : 'Monthly Installment'}</p>
            <p className="text-2xl font-bold text-dark">{installment.monthlyAmount.toFixed(0)} <span className="text-sm text-dark/50">{t('pricing', 'egp')}</span></p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-cream rounded-xl p-4 border border-gold/10">
        <div className="flex items-center justify-between text-xs text-dark/70 mb-2">
          <span>{lang === 'ar' ? 'تم السداد' : 'Paid'}: {installment.paidAmount.toFixed(0)} {t('pricing', 'egp')}</span>
          <span>{lang === 'ar' ? 'المتبقي' : 'Remaining'}: {installment.remainingAmount.toFixed(0)} {t('pricing', 'egp')}</span>
        </div>
        <div className="w-full bg-gold/10 rounded-full h-2.5 overflow-hidden">
          <div className="bg-gold h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (installment.paidAmount / installment.totalAmount) * 100)}%` }}
          />
        </div>
        <p className="text-dark/40 text-[10px] mt-1">
          {lang === 'ar' ? 'الإجمالي' : 'Total'}: {installment.totalAmount.toFixed(0)} {t('pricing', 'egp')}
        </p>
      </div>

      {/* Detail Grid */}
      <div className="grid md:grid-cols-2 gap-3">
        <Pill label={lang === 'ar' ? 'معرف القسط' : 'Installment ID'} value={installment.id} icon={Hash} />
        <Pill label={lang === 'ar' ? 'المبلغ الشهري' : 'Monthly Amount'} value={`${installment.monthlyAmount.toFixed(0)} ${t('pricing', 'egp')}`} icon={DollarSign} />
        <Pill label={lang === 'ar' ? 'تاريخ البداية' : 'Start Date'} value={installment.startDate} icon={Calendar} />
        <Pill label={lang === 'ar' ? 'تاريخ النهاية' : 'End Date'} value={installment.endDate} icon={Calendar} />
        <Pill label={lang === 'ar' ? 'تاريخ الاستحقاق التالي' : 'Next Due Date'} value={installment.nextDueDate} icon={Clock} />
        <Pill label={lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'} value={installment.paymentMethod} icon={CreditCard} />
        <Pill label={lang === 'ar' ? 'تاريخ الإنشاء' : 'Created At'} value={installment.createdAt} icon={Calendar} />
        <Pill label={lang === 'ar' ? 'آخر تحديث' : 'Last Updated'} value={installment.updatedAt} icon={Clock} />
      </div>

      {/* Services */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="flex items-center gap-2 font-bold text-dark mb-3">
          <Activity size={16} className="text-gold" />
          {lang === 'ar' ? 'الخدمات المرتبطة' : 'Linked Services'} ({installment.services.length})
        </h4>
        <div className="grid gap-2">
          {installment.services.map((svc) => (
            <button key={svc.id} onClick={() => onServiceClick(svc)}
              className="text-right bg-white rounded-lg p-3.5 border border-gold/5 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer w-full group"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-dark text-sm">{svc.name[lang] || svc.name.ar || svc.name.en || svc.name}</span>
                    <StatusBadge status={svc.status === 'active' ? (lang === 'ar' ? 'نشط' : 'active') : (lang === 'ar' ? 'غير نشط' : 'inactive')} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-dark/50">
                    <span className="flex items-center gap-1"><DollarSign size={11} />{svc.price} EGP</span>
                    <span className="flex items-center gap-1"><Tag size={11} />{svc.category[lang] || svc.category.ar || svc.category.en}</span>
                    <span className="flex items-center gap-1 text-emerald-600">{svc.discountApplied}% off</span>
                  </div>
                </div>
                <ArrowUpRight size={14} className="text-gold/30 group-hover:text-gold/60 transition-colors shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg p-4 border border-gold/5">
        <p className="text-dark/60 text-sm leading-relaxed">
          {installment.notes[lang] || installment.notes.ar || installment.notes.en}
        </p>
      </div>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────
export default function RevenueSection({ stats }) {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [revenueItems, setRevenueItems] = useState([])
  const [view, setView] = useState('list')
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [detailType, setDetailType] = useState('subscription') // 'subscription' | 'installment'
  const [showService, setShowService] = useState(null)

  const handleOpen = () => {
    setLoading(true)
    setError(null)
    setView('list')
    setSelectedItem(null)
    setSelectedIdx(0)
    setShowService(null)
    try {
      const items = generateRevenueItems()
      setRevenueItems(items)
      setOpen(true)
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ في تحميل بيانات الإيرادات' : 'Error loading revenue data')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setView('list')
    setSelectedItem(null)
    setShowService(null)
  }

  const viewItem = (item) => {
    setSelectedItem(item)
    setSelectedIdx(0)
    setView('item')
  }

  const viewSubscription = (subIdx) => {
    setSelectedIdx(subIdx)
    setDetailType('subscription')
    setView('subscription')
  }

  const viewInstallment = (instIdx) => {
    setSelectedIdx(instIdx)
    setDetailType('installment')
    setView('installment')
  }

  const goBack = () => {
    if (view === 'item') setView('list')
    else if (view === 'subscription' || view === 'installment') setView('item')
  }

  const prevItem = () => {
    if (selectedIdx > 0) setSelectedIdx(selectedIdx - 1)
  }
  const nextItem = () => {
    const max = detailType === 'subscription' ? selectedItem.subscriptions.length - 1 : selectedItem.installments.length - 1
    if (selectedIdx < max) setSelectedIdx(selectedIdx + 1)
  }

  // Modal title
  const modalTitle = useMemo(() => {
    if (view === 'list') return lang === 'ar' ? 'قائمة الإيرادات الشهرية' : 'Monthly Revenue List'
    if (view === 'item' && selectedItem) {
      return selectedItem.title[lang] || selectedItem.title.ar || selectedItem.title.en || selectedItem.title
    }
    if (view === 'subscription' && selectedItem) {
      const sub = selectedItem.subscriptions[selectedIdx]
      return sub ? (sub.name[lang] || sub.name.ar || sub.name.en || sub.name) : ''
    }
    if (view === 'installment' && selectedItem) {
      const inst = selectedItem.installments[selectedIdx]
      return inst ? (inst.name[lang] || inst.name.ar || inst.name.en || inst.name) : ''
    }
    return lang === 'ar' ? 'الإيرادات' : 'Revenue'
  }, [view, selectedItem, selectedIdx, lang])

  const currentCount = useMemo(() => {
    if (!selectedItem) return 0
    return detailType === 'subscription' ? selectedItem.subscriptions.length : selectedItem.installments.length
  }, [selectedItem, detailType])

  // Determine modal size based on view
  const modalSize = view === 'list' ? 'xl' : 'xl'

  return (
    <>
      {/* Card Button */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-dark mb-4">{t('adminDashboard', 'revenue')}</h2>
        <div className="w-full md:w-1/3">
          <button
            onClick={handleOpen}
            className="w-full text-right bg-white rounded-2xl p-5 border border-gold/10 shadow-sm hover:shadow-md hover:border-gold/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark/50 text-xs">{t('adminDashboard', 'revenue')}</span>
              <DollarSign className="text-gold group-hover:scale-110 transition-transform" size={22} />
            </div>
            <p className="text-2xl font-bold text-dark">{stats.totalRevenue} {t('pricing', 'egp')}</p>
          </button>
        </div>
      </div>

      {/* Main Modal */}
      <Modal open={open} onClose={handleClose} title={modalTitle} size={modalSize}>
        {loading && <LoadingState lang={lang} />}
        {error && <ErrorState error={error} onRetry={handleOpen} lang={lang} />}

        {!loading && !error && view === 'list' && revenueItems.length === 0 && (
          <EmptyState icon={DollarSign} message={lang === 'ar' ? 'لا توجد بيانات إيرادات' : 'No revenue data available'} />
        )}
        {!loading && !error && view === 'list' && revenueItems.length > 0 && (
          <RevenueListView items={revenueItems} onItemClick={viewItem} lang={lang} t={t} />
        )}

        {!loading && !error && view === 'item' && selectedItem && (
          <RevenueItemView
            item={selectedItem}
            onBack={goBack}
            onSubClick={viewSubscription}
            onInstClick={viewInstallment}
            lang={lang} t={t}
          />
        )}

        {!loading && !error && view === 'subscription' && selectedItem && selectedItem.subscriptions[selectedIdx] && (
          <SubscriptionDetailView
            subscription={selectedItem.subscriptions[selectedIdx]}
            currentIndex={selectedIdx}
            totalCount={currentCount}
            onPrev={prevItem}
            onNext={nextItem}
            onBack={goBack}
            onServiceClick={(svc) => setShowService(svc)}
            lang={lang} t={t}
          />
        )}

        {!loading && !error && view === 'installment' && selectedItem && selectedItem.installments[selectedIdx] && (
          <InstallmentDetailView
            installment={selectedItem.installments[selectedIdx]}
            currentIndex={selectedIdx}
            totalCount={currentCount}
            onPrev={prevItem}
            onNext={nextItem}
            onBack={goBack}
            onServiceClick={(svc) => setShowService(svc)}
            lang={lang} t={t}
          />
        )}
      </Modal>

      {/* Nested Service Detail Modal */}
      <Modal
        open={!!showService}
        onClose={() => setShowService(null)}
        title={showService ? (showService.name[lang] || showService.name.ar || showService.name.en || showService.name) : ''}
        size="lg"
      >
        <ServiceDetailModal service={showService} onBack={() => setShowService(null)} />
      </Modal>
    </>
  )
}
