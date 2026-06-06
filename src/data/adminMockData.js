/**
 * Admin Dashboard — comprehensive enriched mock data layer.
 * Generates revenue items → subscriptions/installments → services → beneficiaries/discounts/companies
 * Caches generated data so cross-references remain consistent.
 */

// ── helpers ────────────────────────────────────────────────
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function dateStr(date) {
  return date.toISOString().split('T')[0]
}

function pick(arr) { return arr[rand(0, arr.length - 1)] }

function formatCurrency(amount) { return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

// ── Seed Data ──────────────────────────────────────────────

const revenueSources = [
  { ar: 'اشتراكات البريميوم الشهرية', en: 'Monthly Premium Subscriptions' },
  { ar: 'اشتراكات الباقة الشاملة', en: 'Elite Plan Subscriptions' },
  { ar: 'أقساط التأمين الطبي', en: 'Medical Insurance Installments' },
  { ar: 'أقساط التأمين المالي', en: 'Financial Insurance Installments' },
  { ar: 'رسوم التسجيل في الكورسات', en: 'Course Registration Fees' },
  { ar: 'عمولات الشركات الشريكة', en: 'Partner Company Commissions' },
  { ar: 'رسوم الترقية للباقة المميزة', en: 'Plan Upgrade Fees' },
  { ar: 'رسوم إعادة الاشتراك', en: 'Re-subscription Fees' },
]

const revenueStatuses = [
  { ar: 'مكتمل', en: 'Completed' },
  { ar: 'معلق', en: 'Pending' },
  { ar: 'قيد المراجعة', en: 'Under Review' },
  { ar: 'مؤجل', en: 'Deferred' },
]

const subscriptionNames = [
  { ar: 'باقة بريميوم شهرية', en: 'Monthly Premium Plan' },
  { ar: 'باقة شاملة سنوية', en: 'Annual Elite Plan' },
  { ar: 'باقة تدريب مهني', en: 'Professional Training Plan' },
  { ar: 'باقة التأمين الصحي', en: 'Health Insurance Plan' },
  { ar: 'باقة الحماية المالية', en: 'Financial Protection Plan' },
  { ar: 'باقة VIP الذهبية', en: 'Golden VIP Plan' },
  { ar: 'باقة التعليم المستمر', en: 'Continuing Education Plan' },
  { ar: 'باقة العضوية المزدوجة', en: 'Dual Membership Plan' },
  { ar: 'باقة العائلة', en: 'Family Plan' },
  { ar: 'باقة المؤسسات الصغيرة', en: 'Small Business Plan' },
]

const subscriptionTypes = ['monthly', 'quarterly', 'semi-annual', 'annual']
const paymentMethods = ['Visa', 'Mastercard', 'Vodafone Cash', 'InstaPay', 'Bank Transfer', 'Auto-debit']

const companies = [
  { id: 'CMP-001', name: { ar: 'شركة المستقبل للتأمين', en: 'Al-Mustaqbal Insurance Co.' }, type: 'insurance', email: 'info@mustaqbal-ins.com', phone: '+20 2 2598 7410', address: { ar: 'شارع النيل، القاهرة', en: 'Nile Street, Cairo' }, status: 'active', registrationDate: '2023-03-15' },
  { id: 'CMP-002', name: { ar: 'مجموعة النخبة الطبية', en: 'Elite Medical Group' }, type: 'healthcare', email: 'contact@elite-med.com', phone: '+20 2 2789 6321', address: { ar: 'شارع الهرم، الجيزة', en: 'Pyramids Street, Giza' }, status: 'active', registrationDate: '2023-06-01' },
  { id: 'CMP-003', name: { ar: 'أكاديمية المعرفة', en: 'Knowledge Academy' }, type: 'education', email: 'info@knowledge-academy.edu', phone: '+20 2 2456 8901', address: { ar: 'مدينة نصر، القاهرة', en: 'Nasr City, Cairo' }, status: 'active', registrationDate: '2024-01-10' },
  { id: 'CMP-004', name: { ar: 'بنك الثقة المصري', en: 'Trust Egyptian Bank' }, type: 'banking', email: 'support@trust-bank.com.eg', phone: '+20 2 2345 6789', address: { ar: 'وسط البلد، القاهرة', en: 'Downtown, Cairo' }, status: 'active', registrationDate: '2022-11-20' },
  { id: 'CMP-005', name: { ar: 'شركة الابتكار للخدمات', en: 'Innovation Services Co.' }, type: 'technology', email: 'hello@innovationservices.net', phone: '+20 2 2567 4321', address: { ar: 'التحلية، جدة', en: 'Al-Tahliya, Jeddah' }, status: 'active', registrationDate: '2024-05-05' },
  { id: 'CMP-006', name: { ar: 'منصة التدريب المتقدمة', en: 'Advanced Training Platform' }, type: 'education', email: 'info@advanced-training.net', phone: '+20 2 2890 1234', address: { ar: 'المعادي، القاهرة', en: 'Maadi, Cairo' }, status: 'active', registrationDate: '2024-08-12' },
  { id: 'CMP-007', name: { ar: 'مركز الاستشارات القانونية', en: 'Legal Consultations Center' }, type: 'legal', email: 'consult@legal-center.eg', phone: '+20 2 2678 5432', address: { ar: 'الزمالك، القاهرة', en: 'Zamalek, Cairo' }, status: 'active', registrationDate: '2023-09-28' },
  { id: 'CMP-008', name: { ar: 'نادي الرياضة الذهبي', en: 'Golden Sports Club' }, type: 'fitness', email: 'info@golden-sport.com', phone: '+20 2 2543 2109', address: { ar: 'التجمع الخامس، القاهرة', en: 'New Cairo, Cairo' }, status: 'active', registrationDate: '2024-02-14' },
]

const serviceCategories = [
  { ar: 'تأمين', en: 'Insurance' },
  { ar: 'رعاية صحية', en: 'Healthcare' },
  { ar: 'تعليم', en: 'Education' },
  { ar: 'خدمات مالية', en: 'Financial Services' },
  { ar: 'ترفيه', en: 'Entertainment' },
  { ar: 'استشارات', en: 'Consultations' },
  { ar: 'دعم فني', en: 'Technical Support' },
  { ar: 'لياقة بدنية', en: 'Fitness' },
]

const serviceProviders = [
  { ar: 'مقدم خدمة معتمد', en: 'Certified Service Provider' },
  { ar: 'شريك رسمي', en: 'Official Partner' },
  { ar: 'مركز خدمة معتمد', en: 'Authorized Service Center' },
  { ar: 'مزود خارجي', en: 'External Provider' },
]

const beneficiaryNames = [
  { ar: 'أحمد عبد الله', en: 'Ahmed Abdullah' },
  { ar: 'سارة محمد', en: 'Sara Mohamed' },
  { ar: 'محمد علي', en: 'Mohamed Ali' },
  { ar: 'نورة أحمد', en: 'Noura Ahmed' },
  { ar: 'خالد حسن', en: 'Khaled Hassan' },
  { ar: 'مريم إبراهيم', en: 'Mariam Ibrahim' },
  { ar: 'يوسف عمر', en: 'Youssef Omar' },
  { ar: 'فاطمة الزهراء', en: 'Fatima Al-Zahra' },
  { ar: 'عمر عبد الرحمن', en: 'Omar Abdelrahman' },
  { ar: 'لينا محمود', en: 'Lina Mahmoud' },
  { ar: 'كريم سامي', en: 'Karim Sami' },
  { ar: 'هدى رشاد', en: 'Hoda Rashad' },
  { ar: 'علياء مصطفى', en: 'Alia Mostafa' },
  { ar: 'حسن كمال', en: 'Hassan Kamal' },
  { ar: 'نادية شريف', en: 'Nadia Sherif' },
]

const discountProviders = [
  { name: { ar: 'متجر سارق للتسوق', en: 'Saraq Shopping Store' }, code: 'SARQ-25', value: 250, percentage: 25, usageLimit: 1000, usedCount: 847, details: { ar: 'خصم على جميع المنتجات', en: 'Discount on all products' } },
  { name: { ar: 'كافيهات الرواد', en: 'Al-Ruwwad Cafes' }, code: 'RWAD-15', value: 150, percentage: 15, usageLimit: 500, usedCount: 312, details: { ar: 'خصم على المشروبات والحلويات', en: 'Discount on drinks & desserts' } },
  { name: { ar: 'منصة التعليم الشامل', en: 'Comprehensive Education Platform' }, code: 'EDU-30', value: 300, percentage: 30, usageLimit: 2000, usedCount: 1189, details: { ar: 'خصم على الكورسات التعليمية', en: 'Discount on educational courses' } },
  { name: { ar: 'مركز الرشاقة البدنية', en: 'Fitness Center' }, code: 'FIT-20', value: 200, percentage: 20, usageLimit: 800, usedCount: 523, details: { ar: 'خصم على اشتراكات الجيم', en: 'Discount on gym subscriptions' } },
  { name: { ar: 'مكتبة المعرفة', en: 'Knowledge Bookstore' }, code: 'BOOK-10', value: 100, percentage: 10, usageLimit: 1500, usedCount: 892, details: { ar: 'خصم على الكتب والمطبوعات', en: 'Discount on books & publications' } },
  { name: { ar: 'متجر الإلكترونيات', en: 'Electronics Store' }, code: 'TECH-35', value: 350, percentage: 35, usageLimit: 1200, usedCount: 456, details: { ar: 'خصم على الأجهزة الإلكترونية', en: 'Discount on electronics' } },
  { name: { ar: 'وكالة السفريات', en: 'Travel Agency' }, code: 'TRIP-20', value: 200, percentage: 20, usageLimit: 600, usedCount: 234, details: { ar: 'خصم على حجوزات السفر', en: 'Discount on travel bookings' } },
  { name: { ar: 'صيدلية العافية', en: 'Wellness Pharmacy' }, code: 'MED-15', value: 150, percentage: 15, usageLimit: 3000, usedCount: 1567, details: { ar: 'خصم على المستلزمات الطبية', en: 'Discount on medical supplies' } },
]

// Generate a service catalog that gets reused across subscriptions/installments
function generateServiceCatalog() {
  const catalog = []
  const startDate = new Date('2024-06-01')
  const endDate = new Date('2025-12-01')

  const serviceTemplates = [
    { name: { ar: 'تأمين طبي شامل للأسرة', en: 'Comprehensive Family Medical Insurance' }, desc: { ar: 'تغطية طبية شاملة تشمل الكشف والعلاج والأدوية للفرد والأسرة', en: 'Comprehensive medical coverage including checkups, treatment, and medication for individuals and families' }, cat: 0 },
    { name: { ar: 'تأمين طبي للأفراد', en: 'Individual Medical Insurance' }, desc: { ar: 'باقة تأمين صحي مخصصة للأفراد تشمل الخدمات العلاجية الأساسية', en: 'Health insurance package for individuals covering basic medical services' }, cat: 0 },
    { name: { ar: 'تأمين مالي ضد البطالة', en: 'Unemployment Financial Insurance' }, desc: { ar: 'تعويض مالي في حالة فقدان الوظيفة مع خدمات استشارية للتوظيف', en: 'Financial compensation in case of job loss with employment consulting services' }, cat: 3 },
    { name: { ar: 'باقة الكورسات التعليمية', en: 'Educational Courses Bundle' }, desc: { ar: 'مجموعة من الكورسات المهنية والشهادات المعتمدة في مختلف المجالات', en: 'A collection of professional courses and accredited certificates in various fields' }, cat: 2 },
    { name: { ar: 'استشارات قانونية', en: 'Legal Consultations' }, desc: { ar: 'استشارات قانونية مع محامين متخصصين في القضايا التجارية والمدنية', en: 'Legal consultations with specialized lawyers for commercial and civil cases' }, cat: 5 },
    { name: { ar: 'بطاقة عضوية النخبة', en: 'Elite Membership Card' }, desc: { ar: 'بطاقة عضوية VIP تمنح خصومات حصرية في المطاعم والملاهي والفنادق', en: 'VIP membership card granting exclusive discounts at restaurants, entertainment venues, and hotels' }, cat: 4 },
    { name: { ar: 'خصومات الجيم والنوادي الرياضية', en: 'Gym & Sports Club Discounts' }, desc: { ar: 'خصم يصل إلى 50% على اشتراكات الجيم والنوادي الرياضية', en: 'Up to 50% discount on gym and sports club memberships' }, cat: 7 },
    { name: { ar: 'دعم فني متميز', en: 'Premium Technical Support' }, desc: { ar: 'دعم فني على مدار الساعة مع أولوية الاستجابة والاستشارات التقنية', en: '24/7 technical support with priority response and technical consultations' }, cat: 6 },
    { name: { ar: 'تأمين السفر', en: 'Travel Insurance' }, desc: { ar: 'تأمين شامل للسفر يشمل إلغاء الرحلات والأمتعة والطوارئ الطبية', en: 'Comprehensive travel insurance covering trip cancellation, baggage, and medical emergencies' }, cat: 0 },
    { name: { ar: 'منصة التدريب المهني', en: 'Professional Training Platform' }, desc: { ar: 'منصة تدريب عن بعد مع مدربين معتمدين في مجالات الإدارة والتسويق', en: 'Remote training platform with certified trainers in management and marketing' }, cat: 2 },
    { name: { ar: 'استشارات مالية وضريبية', en: 'Financial & Tax Consultations' }, desc: { ar: 'استشارات مالية متخصصة في التخطيط الضريبي وإدارة الاستثمارات', en: 'Specialized financial consulting in tax planning and investment management' }, cat: 3 },
    { name: { ar: 'خدمات التأهيل الوظيفي', en: 'Career Rehabilitation Services' }, desc: { ar: 'برامج تدريب وتأهيل للباحثين عن عمل مع شهادات معتمدة', en: 'Training and qualification programs for job seekers with accredited certificates' }, cat: 2 },
    { name: { ar: 'خصومات المطاعم والكافيهات', en: 'Restaurant & Cafe Discounts' }, desc: { ar: 'خصومات تصل إلى 40% في أشهر المطاعم والكافيهات', en: 'Up to 40% discount at popular restaurants and cafes' }, cat: 4 },
    { name: { ar: 'خدمات التوعية الصحية', en: 'Health Awareness Services' }, desc: { ar: 'برامج توعية صحية واستشارات طبية عن بعد', en: 'Health awareness programs and remote medical consultations' }, cat: 1 },
    { name: { ar: 'خطة الادخار الشهرية', en: 'Monthly Savings Plan' }, desc: { ar: 'خطة ادخار مرنة مع عوائد تنافسية وإمكانية السحب المبكر', en: 'Flexible savings plan with competitive returns and early withdrawal options' }, cat: 3 },
  ]

  serviceTemplates.forEach((tmpl, idx) => {
    const created = randomDate(startDate, endDate)
    const updated = new Date(created)
    updated.setDate(updated.getDate() + rand(15, 60))
    const price = [199, 99, 149, 299, 399, 249, 79, 149, 179, 259, 349, 129, 59, 89, 199][idx]
    const discountPercent = rand(5, 30)
    const discountValue = Math.round(price * discountPercent / 100)
    const company = companies[idx % companies.length]
    const benIdx = idx % beneficiaryNames.length
    const dpIdx = idx % discountProviders.length

    catalog.push({
      id: `SVC-${String(idx + 1).padStart(3, '0')}`,
      name: tmpl.name,
      description: tmpl.desc,
      category: serviceCategories[tmpl.cat],
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      price,
      discountApplied: discountPercent,
      discountValue,
      finalPrice: price - discountValue,
      providerType: pick(serviceProviders),
      createdAt: dateStr(created),
      updatedAt: dateStr(updated),

      // Linked entities
      beneficiary: {
        id: `BEN-${String(benIdx + 1).padStart(3, '0')}`,
        fullName: beneficiaryNames[benIdx],
        email: `user${benIdx + 1}@example.com`,
        phone: `+20 1${rand(0, 5)} ${String(rand(10000000, 99999999)).slice(0, 8)}`,
        subscriptionStatus: Math.random() > 0.15 ? 'active' : 'inactive',
        associatedServices: [tmpl.name],
        registrationDate: dateStr(randomDate(new Date('2024-01-01'), new Date('2025-06-01'))),
        activationDate: dateStr(randomDate(new Date('2024-02-01'), new Date('2025-07-01'))),
      },

      discountProvider: {
        name: discountProviders[dpIdx].name,
        code: discountProviders[dpIdx].code,
        value: discountProviders[dpIdx].value,
        percentage: discountProviders[dpIdx].percentage,
        expirationDate: dateStr(randomDate(new Date('2026-01-01'), new Date('2027-06-01'))),
        usageStats: {
          totalUsed: discountProviders[dpIdx].usedCount,
          remainingLimit: discountProviders[dpIdx].usageLimit - discountProviders[dpIdx].usedCount,
          totalLimit: discountProviders[dpIdx].usageLimit,
        },
        providerDetails: discountProviders[dpIdx].details,
      },

      company: {
        id: company.id,
        name: company.name,
        type: company.type,
        email: company.email,
        phone: company.phone,
        address: company.address,
        status: company.status,
        registrationDate: company.registrationDate,
        associatedServices: [tmpl.name],
        activeDiscounts: rand(1, 5),
      },
    })
  })

  return catalog
}

// Generate subscriptions for a revenue item
function generateSubscriptions(revIdx, catalog, startDate, endDate) {
  const count = rand(2, 4)
  const subs = []
  const usedCatIndices = new Set()

  for (let i = 0; i < count; i++) {
    let ci
    do { ci = rand(0, catalog.length - 1) } while (usedCatIndices.has(ci))
    usedCatIndices.add(ci)

    const svc = catalog[ci]
    const subStart = randomDate(startDate, endDate)
    const subEnd = new Date(subStart)
    subEnd.setMonth(subEnd.getMonth() + rand(1, 12))
    const renewal = new Date(subEnd)
    renewal.setDate(renewal.getDate() - rand(5, 20))

    const subPrice = svc.price + rand(20, 100)
    const numPayments = rand(3, 8)
    const amountPaid = subPrice * numPayments
    const remainingAmount = rand(0, 2) > 0 ? 0 : rand(50, 200)

    subs.push({
      id: `SUB-${revIdx}-${i}`,
      name: pick(subscriptionNames),
      type: pick(subscriptionTypes),
      status: Math.random() > 0.15 ? 'active' : 'expired',
      startDate: dateStr(subStart),
      endDate: dateStr(subEnd),
      renewalDate: dateStr(renewal),
      amountPaid,
      remainingAmount,
      paymentMethod: pick(paymentMethods),
      installmentInfo: { ar: `مقسم على ${numPayments} دفعات شهرية`, en: `Split into ${numPayments} monthly payments` },
      notes: {
        ar: `اشتراك في ${svc.name.ar} بقيمة ${formatCurrency(subPrice)} ج.م شهرياً. إجمالي المدفوع: ${formatCurrency(amountPaid)} ج.م.`,
        en: `Subscription to ${svc.name.en} at ${formatCurrency(subPrice)} EGP/month. Total paid: ${formatCurrency(amountPaid)} EGP.`,
      },
      createdAt: dateStr(subStart),
      updatedAt: dateStr(new Date(subEnd.getTime() + rand(1, 10) * 86400000)),
      services: [svc],
    })
  }

  return subs
}

// Generate installments for a revenue item
function generateInstallments(revIdx, catalog, startDate, endDate) {
  const count = rand(1, 3)
  const insts = []
  const usedCatIndices = new Set()

  for (let i = 0; i < count; i++) {
    let ci
    do { ci = rand(0, catalog.length - 1) } while (usedCatIndices.has(ci))
    usedCatIndices.add(ci)

    const svc = catalog[ci]
    const instStart = randomDate(startDate, endDate)
    const instEnd = new Date(instStart)
    instEnd.setMonth(instEnd.getMonth() + rand(3, 18))

    const totalAmount = svc.price * rand(6, 24)
    const monthlyAmount = svc.price
    const paidAmount = rand(1, Math.max(2, Math.floor(totalAmount / monthlyAmount) - 1)) * monthlyAmount
    const remainingAmount = totalAmount - paidAmount
    const nextDue = new Date(instStart)
    nextDue.setMonth(nextDue.getMonth() + Math.floor(paidAmount / monthlyAmount))
    if (nextDue < new Date()) nextDue.setMonth(nextDue.getMonth() + 1)

    insts.push({
      id: `INST-${revIdx}-${i}`,
      name: svc.name,
      type: 'installment',
      status: remainingAmount > 0 ? 'active' : 'completed',
      totalAmount,
      paidAmount,
      remainingAmount,
      monthlyAmount,
      nextDueDate: dateStr(nextDue),
      startDate: dateStr(instStart),
      endDate: dateStr(instEnd),
      paymentMethod: pick(paymentMethods),
      notes: {
        ar: `قسط شهري بقيمة ${formatCurrency(monthlyAmount)} ج.م. المتبقي ${formatCurrency(remainingAmount)} ج.م. من إجمالي ${formatCurrency(totalAmount)} ج.م.`,
        en: `Monthly installment of ${formatCurrency(monthlyAmount)} EGP. Remaining ${formatCurrency(remainingAmount)} EGP of ${formatCurrency(totalAmount)} EGP total.`,
      },
      createdAt: dateStr(instStart),
      updatedAt: dateStr(new Date(instStart.getTime() + rand(1, 60) * 86400000)),
      services: [svc],
    })
  }

  return insts
}

// ── Cache ──────────────────────────────────────────────────
let _cachedServices = null
let _cachedRevenueItems = null

// ── Main Generator ─────────────────────────────────────────
export function generateRevenueItems() {
  if (_cachedRevenueItems) return _cachedRevenueItems

  const catalog = _cachedServices || generateServiceCatalog()
  _cachedServices = catalog

  const items = []
  const startDate = new Date('2025-01-01')
  const endDate = new Date('2026-06-01')

  revenueSources.forEach((source, idx) => {
    const created = randomDate(startDate, endDate)
    const updated = new Date(created)
    updated.setDate(updated.getDate() + rand(1, 30))

    const totalRevenue = [4990, 12990, 24990, 8490, 3490, 15990, 6990, 4990][idx] + rand(0, 5000)
    const transactions = rand(5, 120)
    const discount = rand(0, 20)
    const status = revenueStatuses[rand(0, 3)]
    const trend = Math.random() > 0.5 ? 'increase' : 'decrease'
    const trendPercent = rand(5, 45)

    // Generate nested subscriptions and installments
    const subscriptions = generateSubscriptions(idx, catalog, created, updated)
    const installments = generateInstallments(idx, catalog, created, updated)

    // Collect all unique services referenced
    const allServices = []
    const seenIds = new Set()
    ;[...subscriptions, ...installments].forEach(entry => {
      entry.services.forEach(svc => {
        if (!seenIds.has(svc.id)) {
          seenIds.add(svc.id)
          allServices.push(svc)
        }
      })
    })

    items.push({
      id: `REV-2026-${String(idx + 1).padStart(3, '0')}`,
      title: source,
      totalRevenue,
      source,
      transactions,
      associatedServices: allServices,
      appliedDiscount: discount,
      status,
      trend,
      trendPercent,
      subscriptions,
      installments,
      createdAt: dateStr(created),
      updatedAt: dateStr(updated),
      notes: {
        ar: `هذا البند يمثل ${source.ar} للفترة المحددة. إجمالي المعاملات: ${transactions} معاملة بقيمة ${totalRevenue.toLocaleString('ar-EG')} ج.م. يشتمل على ${subscriptions.length} اشتراكات و ${installments.length} أقساط.`,
        en: `This item represents ${source.en} for the specified period. Total transactions: ${transactions} worth ${totalRevenue.toLocaleString('en-US')} EGP. Includes ${subscriptions.length} subscriptions and ${installments.length} installments.`,
      },
    })
  })

  _cachedRevenueItems = items
  return items
}

// ── Lookup Helpers ─────────────────────────────────────────

export function lookupService(serviceId) {
  if (!_cachedServices) generateRevenueItems()
  return _cachedServices.find(s => s.id === serviceId) || null
}

export function lookupRevenueItem(revenueId) {
  const items = generateRevenueItems()
  return items.find(r => r.id === revenueId) || null
}

export function lookupSubscription(subscriptionId) {
  const items = generateRevenueItems()
  for (const item of items) {
    const sub = item.subscriptions.find(s => s.id === subscriptionId)
    if (sub) return { subscription: sub, revenueItem: item }
  }
  return { subscription: null, revenueItem: null }
}

export function lookupInstallment(installmentId) {
  const items = generateRevenueItems()
  for (const item of items) {
    const inst = item.installments.find(i => i.id === installmentId)
    if (inst) return { installment: inst, revenueItem: item }
  }
  return { installment: null, revenueItem: null }
}
