/**
 * Core data layer — localStorage-backed store matching the ERD.
 * Entities: USERS, COMPANIES, DISCOUNTS, CARDS, INSTALLMENTS, ADMIN
 * Relationships:
 *   USERS   ──→ DISCOUNTS   (scans / usage tracking)
 *   USERS   ──→ CARDS       (has one)
 *   USERS   ──→ INSTALLMENTS (has many)
 *   COMPANIES ──→ DISCOUNTS  (submits)
 */

const STORAGE_KEY = 'mustakleen_db'

// ── helpers ────────────────────────────────────────────────
function rand(from, to) { return Math.floor(Math.random() * (to - from + 1)) + from }

function newUserId() {
  const year = new Date().getFullYear()
  const seq = String(rand(1, 9999)).padStart(4, '0')
  return `FL-${year}-${seq}`
}

function newCompanyId() {
  return `CO-${Date.now()}-${rand(100, 999)}`
}

function newInstallmentId() {
  return `IN-${Date.now()}-${rand(1000, 9999)}`
}

function today() {
  return new Date().toISOString()
}

function futureDate(monthsAhead) {
  const d = new Date()
  d.setMonth(d.getMonth() + monthsAhead)
  return d.toISOString()
}

// ── default seed data ──────────────────────────────────────
function seedData() {
  return {
     users: [
      {
        id: 'FL-2026-0001',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '01012345678',
        nationalId: '29801151234567',
        job: 'تطوير الويب',
        password: '123456',
        plan: 'elite',
        governorate: 'القاهرة',
        scans: 24,
        saved: 1850.50,
        join_date: '2025-06-15T08:00:00.000Z',
        points: 320,
      },
      {
        id: 'FL-2026-0002',
        name: 'سارة علي',
        email: 'sara@example.com',
        phone: '01123456789',
        nationalId: '30002201234568',
        job: 'التصميم الجرافيكي',
        password: '123456',
        plan: 'premium',
        governorate: 'الإسكندرية',
        scans: 12,
        saved: 720.00,
        join_date: '2025-09-01T10:30:00.000Z',
        points: 180,
      },
      {
        id: 'FL-2026-0003',
        name: 'خالد عمر',
        email: 'khalid@example.com',
        phone: '01234567890',
        nationalId: '30205101234569',
        job: 'التسويق الرقمي',
        password: '123456',
        plan: 'free',
        governorate: 'الجيزة',
        scans: 3,
        saved: 120.00,
        join_date: '2026-01-10T14:00:00.000Z',
        points: 45,
      },
    ],
    companies: [
      {
        id: 'CO-1715000000-101',
        name: 'صيدلية الشفاء',
        email: 'info@shifa.com',
        password: '123456',
        category: 'medical',
        city: 'القاهرة',
        emoji: '💊',
        status: 'approved',
        join_date: '2025-01-15T09:00:00.000Z',
        views: 1540,
        uses: 320,
        commission: 15.5,
      },
      {
        id: 'CO-1715100000-202',
        name: 'جيم البطل',
        email: 'info@albatal.com',
        password: '123456',
        category: 'gym',
        city: 'الإسكندرية',
        emoji: '💪',
        status: 'approved',
        join_date: '2025-03-20T11:00:00.000Z',
        views: 2800,
        uses: 650,
        commission: 10.0,
      },
      {
        id: 'CO-1715200000-303',
        name: 'مطعم الذواق',
        email: 'info@alzawaq.com',
        password: '123456',
        category: 'food',
        city: 'الجيزة',
        emoji: '🍽️',
        status: 'approved',
        join_date: '2025-05-10T13:00:00.000Z',
        views: 4200,
        uses: 1100,
        commission: 8.0,
      },
      {
        id: 'CO-1715300000-404',
        name: 'نادي السعادة',
        email: 'info@alsaada.com',
        password: '123456',
        category: 'fun',
        city: 'القاهرة',
        emoji: '🎪',
        status: 'pending',
        join_date: '2026-04-01T08:00:00.000Z',
        views: 0,
        uses: 0,
        commission: 12.0,
      },
      {
        id: 'CO-1715400000-505',
        name: 'مستشفى النيل',
        email: 'info@alnile.com',
        password: '123456',
        category: 'medical',
        city: 'أسوان',
        emoji: '🏥',
        status: 'approved',
        join_date: '2025-02-01T10:00:00.000Z',
        views: 890,
        uses: 210,
        commission: 18.0,
      },
    ],
    discounts: [
      {
        id: 1,
        name: 'خصم 30% على جميع الأدوية',
        category: 'medical',
        discount_percent: '30%',
        description: 'خصم خاص على جميع الأدوية والمستلزمات الطبية في صيدلية الشفاء',
        city: 'القاهرة',
        tier: 'premium',
        company_id: 'CO-1715000000-101',
        uses: 120,
        views: 540,
        status: 'approved',
        created_at: '2025-06-01T09:00:00.000Z',
        company_name: 'صيدلية الشفاء',
      },
      {
        id: 2,
        name: 'كشف مجاني + خصم 40% تحاليل',
        category: 'medical',
        discount_percent: '40%',
        description: 'كشف طبي مجاني وخصم 40% على التحاليل والأشعة',
        city: 'أسوان',
        tier: 'free',
        company_id: 'CO-1715400000-505',
        uses: 80,
        views: 320,
        status: 'approved',
        created_at: '2025-06-15T10:00:00.000Z',
        company_name: 'مستشفى النيل',
      },
      {
        id: 3,
        name: 'عضوية شهرية بخصم 40%',
        category: 'gym',
        discount_percent: '40%',
        description: 'اشتراك شهري في جيم البطل بخصم 40% لأعضاء مستقلين',
        city: 'الإسكندرية',
        tier: 'elite',
        company_id: 'CO-1715100000-202',
        uses: 250,
        views: 980,
        status: 'approved',
        created_at: '2025-07-01T11:00:00.000Z',
        company_name: 'جيم البطل',
      },
      {
        id: 4,
        name: 'وجبة كاملة بسعر مخفض',
        category: 'food',
        discount_percent: '25%',
        description: 'خصم 25% على الوجبات الكاملة في مطعم الذواق',
        city: 'الجيزة',
        tier: 'premium',
        company_id: 'CO-1715200000-303',
        uses: 450,
        views: 1800,
        status: 'approved',
        created_at: '2025-08-10T13:00:00.000Z',
        company_name: 'مطعم الذواق',
      },
      {
        id: 5,
        name: 'جلسة تدريب شخصي مجانية',
        category: 'gym',
        discount_percent: '100%',
        description: 'جلسة تدريب شخصي مجانية مع مدرب معتمد عند الاشتراك الشهري',
        city: 'الإسكندرية',
        tier: 'elite',
        company_id: 'CO-1715100000-202',
        uses: 180,
        views: 760,
        status: 'approved',
        created_at: '2025-09-01T12:00:00.000Z',
        company_name: 'جيم البطل',
      },
      {
        id: 6,
        name: 'عرض العشاء الرومانسي',
        category: 'food',
        discount_percent: '20%',
        description: 'خصم 20% على وجبات العشاء الرومانسية في مطعم الذواق',
        city: 'الجيزة',
        tier: 'free',
        company_id: 'CO-1715200000-303',
        uses: 320,
        views: 1400,
        status: 'approved',
        created_at: '2025-10-05T14:00:00.000Z',
        company_name: 'مطعم الذواق',
      },
      {
        id: 7,
        name: 'تذكرة سينما نصف السعر',
        category: 'fun',
        discount_percent: '50%',
        description: 'خصم 50% على تذاكر السينما في نادي السعادة الترفيهي',
        city: 'القاهرة',
        tier: 'premium',
        company_id: 'CO-1715300000-404',
        uses: 0,
        views: 0,
        status: 'pending',
        created_at: '2026-04-01T08:00:00.000Z',
        company_name: 'نادي السعادة',
      },
    ],
    cards: [
      {
        user_id: 'FL-2026-0001',
        card_holder_name: 'أحمد محمد',
        card_number: '4532 **** **** 8821',
        expiry: '12/28',
      },
    ],
    installments: [
      {
        id: 'IN-1700000000-1001',
        user_id: 'FL-2026-0001',
        name: 'قسط التأمين الطبي الشامل',
        total: 5990.00,
        paid: 2995.00,
        monthly_amount: 499.17,
        next_due: '2026-06-15T00:00:00.000Z',
      },
      {
        id: 'IN-1700000000-1002',
        user_id: 'FL-2026-0001',
        name: 'قسط الكورسات التعليمية',
        total: 2990.00,
        paid: 1495.00,
        monthly_amount: 249.17,
        next_due: '2026-06-01T00:00:00.000Z',
      },
      {
        id: 'IN-1700000000-2001',
        user_id: 'FL-2026-0002',
        name: 'قسط التأمين المالي',
        total: 4490.00,
        paid: 1490.00,
        monthly_amount: 374.17,
        next_due: '2026-05-20T00:00:00.000Z',
      },
    ],
    admins: [
      { email: 'admin@mustakleen.com', password: 'admin123' },
    ],
    // Track which discounts each user has scanned (many-to-many via USERS scans)
    user_scans: [
      { user_id: 'FL-2026-0001', discount_id: 1, scanned_at: '2026-03-10T14:30:00.000Z' },
      { user_id: 'FL-2026-0001', discount_id: 3, scanned_at: '2026-03-15T10:00:00.000Z' },
      { user_id: 'FL-2026-0001', discount_id: 4, scanned_at: '2026-04-01T19:45:00.000Z' },
      { user_id: 'FL-2026-0002', discount_id: 2, scanned_at: '2026-02-20T11:00:00.000Z' },
      { user_id: 'FL-2026-0002', discount_id: 6, scanned_at: '2026-03-05T20:15:00.000Z' },
    ],

    // ── governorates ──────────────────────────────────────
    governorates: [
      'القاهرة', 'الجيزة', 'الإسكندرية', 'أسوان', 'الأقصر',
      'المنصورة', 'طنطا', 'المنيا', 'بورسعيد', 'السويس',
      'الإسماعيلية', 'دمنهور', 'بني سويف', 'الفيوم', 'سوهاج',
    ],

    // ── medical_centers ────────────────────────────────────
    medical_centers: [
      {
        id: 'MC-001',
        name: 'مستشفى النيل التخصصي',
        governorate: 'القاهرة',
        address: 'شارع النيل، وسط البلد، القاهرة',
        phone: '0223456789',
        rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop',
        description: 'مركز طبي متكامل يضم أحدث الأجهزة التشخيصية وأكبر فريق من الاستشاريين في جميع التخصصات.',
        services_offered: ['كشف عام', 'تحاليل', 'أشعة', 'عمليات جراحية', 'أسنان', 'جلدية'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 100 },
          { service: 'تحاليل شاملة', memberPrice: 80, nonMemberPrice: 250 },
          { service: 'أشعة عادية', memberPrice: 60, nonMemberPrice: 180 },
          { service: 'أشعة مقطعية', memberPrice: 200, nonMemberPrice: 600 },
          { service: 'جلسة أسنان', memberPrice: 40, nonMemberPrice: 150 },
          { service: 'كشف جلدية', memberPrice: 0, nonMemberPrice: 120 },
        ],
        reviews: [
          { id: 1, userName: 'سارة أحمد', rating: 5, comment: 'تعامل راقي جداً وفريق طبي ممتاز. أنصح بالتعامل معهم.', date: '2026-03-15' },
          { id: 2, userName: 'خالد محمود', rating: 4, comment: 'خدمة ممتازة وسرعة في الكشف. الأجهزة حديثة.', date: '2026-02-20' },
          { id: 3, userName: 'نورا حسن', rating: 5, comment: 'الاشتراك مع مستقلين وفر عليا كتير في جلسات الأسنان.', date: '2026-01-10' },
        ],
      },
      {
        id: 'MC-002',
        name: 'مركز القاهرة الطبي',
        governorate: 'القاهرة',
        address: 'شارع الهرم، المعادي، القاهرة',
        phone: '0223567890',
        rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1587351021759-3772687fe598?w=400&auto=format&fit=crop',
        description: 'مركز طبي شامل مع عيادات تخصصية وخدمات علاج طبيعي متطورة.',
        services_offered: ['كشف عام', 'علاج طبيعي', 'أشعة', 'تحاليل', 'قلب'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 90 },
          { service: 'جلسة علاج طبيعي', memberPrice: 35, nonMemberPrice: 120 },
          { service: 'رسم قلب', memberPrice: 50, nonMemberPrice: 200 },
          { service: 'تحاليل قلب', memberPrice: 120, nonMemberPrice: 350 },
          { service: 'أشعة تلفزيونية', memberPrice: 70, nonMemberPrice: 220 },
        ],
        reviews: [
          { id: 4, userName: 'أسماء علي', rating: 5, comment: 'قسم العلاج الطبيعي ممتاز جداً. خففت الآلام بسرعة.', date: '2026-03-01' },
          { id: 5, userName: 'محمد عبدالله', rating: 4, comment: 'مرتب ونظيف ودكاترة شاطرين. بس المواعيد تحتاج تنظيم.', date: '2026-02-15' },
        ],
      },
      {
        id: 'MC-003',
        name: 'مستشفى السلام الدولي',
        governorate: 'الإسكندرية',
        address: 'طريق الكورنيش، سيدي بشر، الإسكندرية',
        phone: '0345678901',
        rating: 4.7,
        img_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&auto=format&fit=crop',
        description: 'أحد أكبر المستشفيات في الإسكندرية يضم ٢٠٠ سرير وأحدث غرف العمليات المجهزة.',
        services_offered: ['كشف عام', 'عمليات جراحية', 'أطفال', 'نساء وتوليد', 'عظام', 'أشعة'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 110 },
          { service: 'كشف أطفال', memberPrice: 0, nonMemberPrice: 100 },
          { service: 'كشف نساء وتوليد', memberPrice: 0, nonMemberPrice: 130 },
          { service: 'أشعة عادية', memberPrice: 50, nonMemberPrice: 170 },
          { service: 'جبس عظام', memberPrice: 80, nonMemberPrice: 250 },
        ],
        reviews: [
          { id: 6, userName: 'إيمان رضا', rating: 5, comment: 'أكبر مستشفى في الإسكندرية بجد. قسم الولادة على أعلى مستوى.', date: '2026-04-01' },
          { id: 7, userName: 'أحمد كريم', rating: 5, comment: 'تمت عمليتي في المستشفى والحمد لله كانت ناجحة. فريق متميز.', date: '2026-03-10' },
          { id: 8, userName: 'دينا شريف', rating: 4, comment: 'خدمة جيدة وأسعار مناسبة مع الاشتراك. أنصح بالعيادات الخارجية.', date: '2026-02-25' },
        ],
      },
      {
        id: 'MC-004',
        name: 'مركز الإسكندرية التشخيصي',
        governorate: 'الإسكندرية',
        address: 'شارع ٤٥، محطة الرمل، الإسكندرية',
        phone: '0345689012',
        rating: 4.1,
        img_url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&auto=format&fit=crop',
        description: 'مركز تشخيصي متطور يقدم خدمات الفحص الشامل والتحاليل المتقدمة.',
        services_offered: ['تحاليل شاملة', 'أشعة مقطعية', 'رنين مغناطيسي', 'كشف عام'],
        pricing: [
          { service: 'تحاليل شاملة', memberPrice: 150, nonMemberPrice: 400 },
          { service: 'أشعة مقطعية', memberPrice: 250, nonMemberPrice: 700 },
          { service: 'رنين مغناطيسي', memberPrice: 400, nonMemberPrice: 1200 },
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 80 },
        ],
        reviews: [
          { id: 9, userName: 'مصطفى إبراهيم', rating: 4, comment: 'مركز تشخيص متطور جداً. النتائج دقيقة وسريعة.', date: '2026-03-20' },
          { id: 10, userName: 'هند سامي', rating: 5, comment: 'جهاز الرنين المغناطيسي جديد جداً. التجربة كانت مريحة.', date: '2026-02-05' },
        ],
      },
      {
        id: 'MC-005',
        name: 'مستشفى الجيزة التخصصي',
        governorate: 'الجيزة',
        address: 'شارع فيصل، الجيزة',
        phone: '0234567890',
        rating: 4.4,
        img_url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&auto=format&fit=crop',
        description: 'مستشفى حكومي متطور يخدم محافظة الجيزة بكوادر طبية متميزة.',
        services_offered: ['كشف عام', 'طوارئ 24 ساعة', 'عظام', 'أطفال', 'نساء وتوليد'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 70 },
          { service: 'طوارئ', memberPrice: 0, nonMemberPrice: 150 },
          { service: 'كشف عظام', memberPrice: 0, nonMemberPrice: 90 },
          { service: 'جبس عظام', memberPrice: 60, nonMemberPrice: 200 },
          { service: 'كشف أطفال', memberPrice: 0, nonMemberPrice: 80 },
        ],
        reviews: [
          { id: 11, userName: 'وليد فتحي', rating: 4, comment: 'مستشفى حكومي متطور. الطوارئ ممتازة وسريعة.', date: '2026-04-05' },
          { id: 12, userName: 'منى جمال', rating: 5, comment: 'الخدمة أفضل من أي مستشفى حكومي تاني. أنصح بالعيادات.', date: '2026-03-12' },
          { id: 13, userName: 'سامح عادل', rating: 4, comment: 'أسعار مناسبة جداً مع الاشتراك في مستقلين.', date: '2026-01-30' },
        ],
      },
      {
        id: 'MC-006',
        name: 'مركز أسوان الطبي',
        governorate: 'أسوان',
        address: 'شارع المطار، أسوان',
        phone: '0973456789',
        rating: 4.2,
        img_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop',
        description: 'المركز الطبي الرائد في صعيد مصر يقدم خدمات علاجية متكاملة.',
        services_offered: ['كشف عام', 'تحاليل', 'أشعة', 'عمليات', 'أسنان'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 60 },
          { service: 'تحاليل', memberPrice: 40, nonMemberPrice: 120 },
          { service: 'أشعة عادية', memberPrice: 45, nonMemberPrice: 140 },
          { service: 'خلع أسنان', memberPrice: 30, nonMemberPrice: 100 },
          { service: 'عمليات صغرى', memberPrice: 150, nonMemberPrice: 400 },
        ],
        reviews: [
          { id: 14, userName: 'رحمة صبري', rating: 5, comment: 'أفضل مركز طبي في أسوان. الدكاترة محترمين جدا.', date: '2026-03-25' },
          { id: 15, userName: 'عمر هاني', rating: 4, comment: 'خدمة ممتازة للمشتركين في مستقلين. أسعار رمزية.', date: '2026-02-18' },
        ],
      },
      {
        id: 'MC-007',
        name: 'مستشفى المنصورة الجامعي',
        governorate: 'المنصورة',
        address: 'شارع الجمهورية، المنصورة',
        phone: '0503456789',
        rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop',
        description: 'مستشفى جامعي مجهز بأحدث التقنيات الطبية وأساتذة من كلية الطب.',
        services_offered: ['كشف عام', 'عمليات متقدمة', 'أورام', 'قلب', 'أطفال', 'تحاليل'],
        pricing: [
          { service: 'كشف عام', memberPrice: 0, nonMemberPrice: 90 },
          { service: 'كشف أورام', memberPrice: 100, nonMemberPrice: 300 },
          { service: 'كشف قلب', memberPrice: 80, nonMemberPrice: 250 },
          { service: 'تحاليل شاملة', memberPrice: 100, nonMemberPrice: 300 },
          { service: 'متابعة أطفال', memberPrice: 0, nonMemberPrice: 80 },
        ],
        reviews: [
          { id: 16, userName: 'د. ياسر عبدالرحمن', rating: 5, comment: 'مستشفى جامعي بمستوى عالمي. الكوادر التدريسية على أعلى مستوى.', date: '2026-04-10' },
          { id: 17, userName: 'منى الشريف', rating: 5, comment: 'قسم الأورام ممتاز. المتابعة مستمرة والدعم النفسي رائع.', date: '2026-03-05' },
          { id: 18, userName: 'هشام بركات', rating: 4, comment: 'خدمة متميزة مقارنة بالمستشفيات الجامعية التانية.', date: '2026-02-10' },
        ],
      },
    ],

    // ── banks ──────────────────────────────────────────────
    banks: [
      {
        id: 'BNK-001',
        name: 'البنك الأهلي المصري',
        governorate: 'القاهرة',
        address: 'شارع قصر النيل، وسط البلد، القاهرة',
        phone: '19623',
        rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop',
        description: 'أكبر بنك حكومي في مصر يقدم خدمات تأمين مالي وحماية دخل متكاملة.',
        services_offered: ['تأمين على الدخل', 'حساب توفير', 'بطاقات ائتمان', 'قروض شخصية'],
        pricing: [
          { service: 'تأمين على الدخل', memberPrice: 25, nonMemberPrice: 75 },
          { service: 'حساب توفير', memberPrice: 0, nonMemberPrice: 10 },
          { service: 'بطاقة ائتمان كلاسيك', memberPrice: 0, nonMemberPrice: 50 },
          { service: 'قرض شخصي (رسوم إدارية)', memberPrice: 100, nonMemberPrice: 400 },
        ],
        reviews: [
          { id: 19, userName: 'محمود سامي', rating: 5, comment: 'أفضل بنك حكومي. خدمة العملاء ممتازة وفروع في كل مكان.', date: '2026-04-05' },
          { id: 20, userName: 'ليلى عبدالرحمن', rating: 4, comment: 'التأمين على الدخل مع مستقلين خيار ممتاز للفريلانسر.', date: '2026-03-15' },
          { id: 21, userName: 'كريم ناصر', rating: 4, comment: 'بطاقات الائتمان بفوائد مناسبة. خدمة رقمية جيدة.', date: '2026-02-20' },
        ],
      },
      {
        id: 'BNK-002',
        name: 'بنك مصر',
        governorate: 'القاهرة',
        address: 'شارع محمد فريد، وسط البلد، القاهرة',
        phone: '19888',
        rating: 4.4,
        img_url: 'https://images.unsplash.com/photo-1567449394863-577a21bdc9fc?w=400&auto=format&fit=crop',
        description: 'بنك عريق يقدم حلول تأمين مالي مبتكرة للفريلانسر وأصحاب الأعمال الحرة.',
        services_offered: ['تأمين مالي', 'استثمار', 'بطاقات', 'تمويل شخصي'],
        pricing: [
          { service: 'تأمين مالي شامل', memberPrice: 30, nonMemberPrice: 90 },
          { service: 'صندوق استثمار', memberPrice: 0, nonMemberPrice: 200 },
          { service: 'بطاقة ائتمان ذهبية', memberPrice: 0, nonMemberPrice: 100 },
          { service: 'تمويل شخصي (رسوم)', memberPrice: 80, nonMemberPrice: 350 },
        ],
        reviews: [
          { id: 22, userName: 'هاني الشافعي', rating: 5, comment: 'بنك عريق وله تاريخ. الخدمات التأمينية مناسبة جداً.', date: '2026-04-01' },
          { id: 23, userName: 'دعاء عاطف', rating: 4, comment: 'حساب التوفير ممتاز والفائدة منافسة. الخدمة الرقمية جيدة.', date: '2026-03-10' },
        ],
      },
      {
        id: 'BNK-003',
        name: 'البنك التجاري الدولي CIB',
        governorate: 'الإسكندرية',
        address: 'شارع سعد زغلول، محطة الرمل، الإسكندرية',
        phone: '19666',
        rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&auto=format&fit=crop',
        description: 'أفضل بنك خاص في مصر يقدم خدمات مصرفية وتأمينية متطورة بمعايير عالمية.',
        services_offered: ['تأمين على الحياة', 'حماية دخل', 'بطاقات ذهبية', 'خدمات رقمية'],
        pricing: [
          { service: 'تأمين على الحياة', memberPrice: 40, nonMemberPrice: 120 },
          { service: 'حماية دخل', memberPrice: 35, nonMemberPrice: 100 },
          { service: 'بطاقة ذهبية', memberPrice: 0, nonMemberPrice: 200 },
          { service: 'خدمات رقمية', memberPrice: 0, nonMemberPrice: 25 },
        ],
        reviews: [
          { id: 24, userName: 'شادي نبيل', rating: 5, comment: 'أفضل بنك خاص في مصر. التطبيق ممتاز والخدمة راقية.', date: '2026-04-08' },
          { id: 25, userName: 'يارا محسن', rating: 5, comment: 'البطاقة الذهبية مع مستقلين فتحت لي عالم من المزايا.', date: '2026-03-20' },
          { id: 26, userName: 'أيمن جلال', rating: 4, comment: 'خدمة حماية الدخل ممتازة للفريلانسر - أنصح بها بشدة.', date: '2026-02-15' },
        ],
      },
      {
        id: 'BNK-004',
        name: 'بنك الإسكندرية',
        governorate: 'الإسكندرية',
        address: 'شارع ١٤ مايو، محطة الرمل، الإسكندرية',
        phone: '19033',
        rating: 4.1,
        img_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&auto=format&fit=crop',
        description: 'بنك رائد في تقديم خدمات التأمين المالي للأفراد والشركات الصغيرة.',
        services_offered: ['تأمين مالي', 'حسابات جارية', 'تمويل مشروعات'],
        pricing: [
          { service: 'تأمين مالي', memberPrice: 20, nonMemberPrice: 65 },
          { service: 'حساب جاري', memberPrice: 0, nonMemberPrice: 15 },
          { service: 'تمويل مشروعات صغيرة (رسوم)', memberPrice: 150, nonMemberPrice: 500 },
        ],
        reviews: [
          { id: 27, userName: 'نادية حسين', rating: 4, comment: 'بنك ممتاز لتمويل المشروعات الصغيرة. أسعار مناسبة.', date: '2026-03-25' },
          { id: 28, userName: 'عمرو عبدالمجيد', rating: 4, comment: 'خدمة التأمين المالي معقولة وفروع في كل مكان.', date: '2026-02-28' },
        ],
      },
      {
        id: 'BNK-005',
        name: 'بنك القاهرة',
        governorate: 'الجيزة',
        address: 'شارع الهرم، المهندسين، الجيزة',
        phone: '19199',
        rating: 4.0,
        img_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&auto=format&fit=crop',
        description: 'بنك حكومي يقدم خدمات مصرفية شاملة وتأمين مالي بأسعار تنافسية.',
        services_offered: ['تأمين دخل', 'حساب توفير', 'قروض شخصية'],
        pricing: [
          { service: 'تأمين دخل', memberPrice: 25, nonMemberPrice: 70 },
          { service: 'حساب توفير', memberPrice: 0, nonMemberPrice: 5 },
          { service: 'قرض شخصي (رسوم)', memberPrice: 80, nonMemberPrice: 300 },
        ],
        reviews: [
          { id: 29, userName: 'إيهاب منصور', rating: 4, comment: 'بنك حكومي جيد والأسعار تنافسية. خدمة العملاء محترمة.', date: '2026-04-02' },
          { id: 30, userName: 'سلمى عادل', rating: 3, comment: 'خدمة مقبولة. التطبيق الإلكتروني يحتاج تطوير.', date: '2026-03-15' },
        ],
      },
      {
        id: 'BNK-006',
        name: 'بنك التعمير والإسكان',
        governorate: 'أسوان',
        address: 'شارع السادات، أسوان',
        phone: '19634',
        rating: 4.2,
        img_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&auto=format&fit=crop',
        description: 'بنك حكومي يخدم محافظات الصعيد بحلول تمويلية وتأمينية متكاملة.',
        services_offered: ['تأمين مالي', 'تمويل عقاري', 'حسابات توفير'],
        pricing: [
          { service: 'تأمين مالي', memberPrice: 20, nonMemberPrice: 60 },
          { service: 'تمويل عقاري (رسوم)', memberPrice: 200, nonMemberPrice: 700 },
          { service: 'حساب توفير', memberPrice: 0, nonMemberPrice: 5 },
        ],
        reviews: [
          { id: 31, userName: 'محمد صبري', rating: 5, comment: 'أفضل بنك حكومي في الصعيد. خدمة متميزة وأسعار مناسبة.', date: '2026-03-30' },
          { id: 32, userName: 'حسناء علي', rating: 4, comment: 'التمويل العقاري بأسعار مغرية. الاشتراك مع مستقلين وفر كتير.', date: '2026-02-10' },
        ],
      },
    ],

    // ── restaurants ──────────────────────────────────
    restaurants: [
      {
        id: 'RST-001',
        name: 'مطعم الذواق',
        governorate: 'الجيزة',
        cuisine: 'مأكولات شرقية',
        discount_percent: '25%',
        rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop',
        description: 'مطعم شرقي يقدم أشهى المأكولات العربية والمصرية مع خصم خاص لأعضاء مستقلين.',
      },
      {
        id: 'RST-002',
        name: 'كافيه الروضة',
        governorate: 'القاهرة',
        cuisine: 'مشروبات وحلويات',
        discount_percent: '20%',
        rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&auto=format&fit=crop',
        description: 'كافيه هادئ بأجواء راقية في وسط القاهرة، مثالي للقاءات العمل والاسترخاء.',
      },
      {
        id: 'RST-003',
        name: 'بيتزا نابولي',
        governorate: 'الإسكندرية',
        cuisine: 'بيتزا ومكرونة',
        discount_percent: '30%',
        rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop',
        description: 'أفضل بيتزا على الطريقة الإيطالية في الإسكندرية، عجينة طازجة ومكونات عالية الجودة.',
      },
      {
        id: 'RST-004',
        name: 'مطعم كشري أبو طارق',
        governorate: 'القاهرة',
        cuisine: 'مأكولات مصرية',
        discount_percent: '15%',
        rating: 4.7,
        img_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop',
        description: 'أشهر مطعم كشري في مصر بطعم أصلي ووصفة سرية منذ أكثر من ٥٠ عاماً.',
      },
      {
        id: 'RST-005',
        name: 'سوشي يامي',
        governorate: 'القاهرة',
        cuisine: 'سوشي وياباني',
        discount_percent: '20%',
        rating: 4.4,
        img_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop',
        description: 'مطعم ياباني متخصص بالسوشي والمأكولات البحرية الطازجة بأجواء عصرية.',
      },
      {
        id: 'RST-006',
        name: 'كافيه بون',
        governorate: 'المنصورة',
        cuisine: 'مشروبات ساخنة',
        discount_percent: '25%',
        rating: 4.2,
        img_url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&auto=format&fit=crop',
        description: 'كافيه عصري يقدم تشكيلة واسعة من المشروبات الساخنة والباردة والحلويات اللذيذة.',
      },
      {
        id: 'RST-007',
        name: 'مطعم السمكة',
        governorate: 'الإسكندرية',
        cuisine: 'مأكولات بحرية',
        discount_percent: '20%',
        rating: 4.8,
        img_url: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&auto=format&fit=crop',
        description: 'أفضل مطعم مأكولات بحرية في الإسكندرية، أطباق طازجة يومياً من البحر مباشرة.',
      },
      {
        id: 'RST-008',
        name: 'مطعم الشاورما الملكي',
        governorate: 'الجيزة',
        cuisine: 'سندويتشات ووجبات سريعة',
        discount_percent: '20%',
        rating: 4.1,
        img_url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&auto=format&fit=crop',
        description: 'أشهى شاورما لحم وفراخ في الجيزة بوصفات خاصة وخلطات توابل مميزة.',
      },
      {
        id: 'RST-009',
        name: 'كافيه لافاندير',
        governorate: 'القاهرة',
        cuisine: 'حلويات ومشروبات',
        discount_percent: '15%',
        rating: 4.0,
        img_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop',
        description: 'كافيه أنيق بتصميم عصري وديكور لافندر مميز، مناسب للتصوير وجلسات العمل.',
      },
      {
        id: 'RST-010',
        name: 'مطعم ميدوزا',
        governorate: 'القاهرة',
        cuisine: 'مأكولات عالمية',
        discount_percent: '30%',
        rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop',
        description: 'مطعم عالمي يقدم بوفيه مفتوح يومي مع أطباق من مختلف المطابخ العالمية.',
      },
    ],

    // ── entertainment_venues ────────────────────────────────
    entertainmentVenues: [
      {
        id: 'ENT-001', name: 'جيم جولدز الميراج', category: 'gym', governorate: 'القاهرة',
        discount_percent: '40%', rating: 4.7,
        img_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop',
        description: 'أكبر صالة جيم في القاهرة تضم أحدث الأجهزة الرياضية ومدربين معتمدين.',
      },
      {
        id: 'ENT-002', name: 'فيزيكال سبورت', category: 'gym', governorate: 'الجيزة',
        discount_percent: '35%', rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&auto=format&fit=crop',
        description: 'مركز لياقة بدنية متكامل مع حمام سباحة وساونا وجاكوزي.',
      },
      {
        id: 'ENT-003', name: 'نادي وادي دجلة', category: 'club', governorate: 'القاهرة',
        discount_percent: '30%', rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1574629810360-3ef0c64a6f38?w=400&auto=format&fit=crop',
        description: 'نادي اجتماعي ورياضي راقي يضم ملاعب ومطاعم ومنطقة أطفال.',
      },
      {
        id: 'ENT-004', name: 'نادي الجزيرة الرياضي', category: 'club', governorate: 'الجيزة',
        discount_percent: '25%', rating: 4.4,
        img_url: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=400&auto=format&fit=crop',
        description: 'نادي تاريخي على ضفاف النيل بأنشطة رياضية واجتماعية متنوعة.',
      },
      {
        id: 'ENT-005', name: 'سينما فوكس مصر', category: 'cinema', governorate: 'القاهرة',
        discount_percent: '30%', rating: 4.6,
        img_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop',
        description: 'أحدث دور السينما بتقنية 4DX وIMAX مع خصم خاص للأعضاء.',
      },
      {
        id: 'ENT-006', name: 'سينما سيتي سنتر', category: 'cinema', governorate: 'الإسكندرية',
        discount_percent: '25%', rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop',
        description: 'مجمع سينمائي متكامل بأحدث الأفلام العربية والعالمية.',
      },
      {
        id: 'ENT-007', name: 'مول كايرو فيستيفال', category: 'mall', governorate: 'القاهرة',
        discount_percent: '20%', rating: 4.8,
        img_url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=400&auto=format&fit=crop',
        description: 'أكبر مول في مصر يضم أشهر الماركات العالمية والمطاعم الفاخرة.',
      },
      {
        id: 'ENT-008', name: 'مول سان ستيفانو', category: 'mall', governorate: 'الإسكندرية',
        discount_percent: '25%', rating: 4.5,
        img_url: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&auto=format&fit=crop',
        description: 'مول سياحي على شاطئ البحر يضم محلات تجارية وترفيهية.',
      },
      {
        id: 'ENT-009', name: 'رحلة الأقصر وأسوان', category: 'trip', governorate: 'الأقصر',
        discount_percent: '25%', rating: 4.9,
        img_url: 'https://images.unsplash.com/photo-1590767728695-7c29c0b3eaa5?w=400&auto=format&fit=crop',
        description: 'رحلة سياحية متكاملة لزيارة معابد الأقصر وأسوان مع مرشد سياحي.',
      },
      {
        id: 'ENT-010', name: 'رحلة الغردقة', category: 'trip', governorate: 'الغردقة',
        discount_percent: '30%', rating: 4.7,
        img_url: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=400&auto=format&fit=crop',
        description: 'رحلة استجمام على البحر الأحمر تشمل الغطس والأنشطة المائية.',
      },
      {
        id: 'ENT-011', name: 'دريم بارك', category: 'park', governorate: 'القاهرة',
        discount_percent: '35%', rating: 4.3,
        img_url: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=400&auto=format&fit=crop',
        description: 'مدينة ملاهي ترفيهية كبرى تضم ألعاب مثيرة ومناطق مائية.',
      },
      {
        id: 'ENT-012', name: 'فاميلي لاند', category: 'park', governorate: 'الإسكندرية',
        discount_percent: '40%', rating: 4.1,
        img_url: 'https://images.unsplash.com/photo-1567580168208-34a2a623beaf?w=400&auto=format&fit=crop',
        description: 'منتزه عائلي كبير بالعين السخنة مناسب للأطفال والكبار.',
      },
    ],

    // ── user_enrollments ────────────────────────────────────
    user_enrollments: [],
  }
}

// ── store ───────────────────────────────────────────────────
let cache = null

function load() {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      cache = JSON.parse(raw)
      // ── Migrations: add any missing seed-data keys ──
      const fresh = seedData()
      for (const key of Object.keys(fresh)) {
        if (!(key in cache)) cache[key] = fresh[key]
      }
      return cache
    }
  } catch (_) { /* ignore */ }
  cache = seedData()
  save()
  return cache
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch (_) { /* storage full or unavailable */ }
}

export function resetDB() {
  cache = null
  localStorage.removeItem(STORAGE_KEY)
  load()
  return get()
}

// ── public API ──────────────────────────────────────────────

/** Return entire store snapshot */
export function get() {
  return load()
}

// ── USERS ───────────────────────────────────────────────────
export function createUser({ name, email, phone = '', nationalId = '', job, password, plan = 'free', governorate = '' }) {
  const db = load()
  const exists = db.users.find(u => u.email === email)
  if (exists) return { error: 'البريد الإلكتروني موجود بالفعل' }
  const user = {
    id: newUserId(),
    name,
    email,
    phone,
    nationalId,
    job,
    password,
    plan,
    governorate,
    scans: 0,
    saved: 0,
    join_date: today(),
    points: 0,
  }
  db.users.push(user)
  save()
  return { user }
}

export function findUser(email, password) {
  const db = load()
  return db.users.find(u => u.email === email && u.password === password) || null
}

export function findUserByEmail(email) {
  const db = load()
  return db.users.find(u => u.email === email) || null
}

export function findUserById(id) {
  const db = load()
  return db.users.find(u => u.id === id) || null
}

export function updateUser(id, updates) {
  const db = load()
  const idx = db.users.findIndex(u => u.id === id)
  if (idx === -1) return null
  db.users[idx] = { ...db.users[idx], ...updates }
  save()
  return db.users[idx]
}

export function deleteUser(id) {
  const db = load()
  db.users = db.users.filter(u => u.id !== id)
  db.user_scans = db.user_scans.filter(s => s.user_id !== id)
  db.cards = db.cards.filter(c => c.user_id !== id)
  db.installments = db.installments.filter(i => i.user_id !== id)
  db.user_enrollments = db.user_enrollments.filter(e => e.user_id !== id)
  save()
}

export function getAllUsers() {
  return load().users
}

// ── COMPANIES ──────────────────────────────────────────────
export function createCompany({ name, email, password, category, city, emoji }) {
  const db = load()
  const exists = db.companies.find(c => c.email === email)
  if (exists) return { error: 'البريد الإلكتروني موجود بالفعل' }
  const company = {
    id: newCompanyId(),
    name,
    email,
    password,
    category,
    city,
    emoji,
    status: 'pending',
    join_date: today(),
    views: 0,
    uses: 0,
    commission: 12.0,
  }
  db.companies.push(company)
  save()
  return { company }
}

export function findCompany(email, password) {
  const db = load()
  return db.companies.find(c => c.email === email && c.password === password) || null
}

export function findCompanyById(id) {
  const db = load()
  return db.companies.find(c => c.id === id) || null
}

export function updateCompany(id, updates) {
  const db = load()
  const idx = db.companies.findIndex(c => c.id === id)
  if (idx === -1) return null
  db.companies[idx] = { ...db.companies[idx], ...updates }
  save()
  return db.companies[idx]
}

export function getAllCompanies() {
  return load().companies
}

// ── DISCOUNTS ──────────────────────────────────────────────
let discountIdSeq = 8

export function createDiscount({ name, category, discount_percent, description, city, tier, company_id, company_name }) {
  const db = load()
  const discount = {
    id: discountIdSeq++,
    name,
    category,
    discount_percent,
    description,
    city,
    tier,
    company_id,
    uses: 0,
    views: 0,
    status: 'pending',
    created_at: today(),
    company_name,
  }
  db.discounts.push(discount)
  save()
  return discount
}

export function getAllDiscounts() {
  return load().discounts
}

export function getApprovedDiscounts() {
  return load().discounts.filter(d => d.status === 'approved')
}

export function getDiscountsByCompany(companyId) {
  return load().discounts.filter(d => d.company_id === companyId)
}

export function findDiscountById(id) {
  return load().discounts.find(d => d.id === Number(id)) || null
}

export function updateDiscount(id, updates) {
  const db = load()
  const idx = db.discounts.findIndex(d => d.id === Number(id))
  if (idx === -1) return null
  db.discounts[idx] = { ...db.discounts[idx], ...updates }
  save()
  return db.discounts[idx]
}

export function incrementDiscountUses(id) {
  const db = load()
  const idx = db.discounts.findIndex(d => d.id === Number(id))
  if (idx === -1) return null
  db.discounts[idx].uses += 1
  save()
  return db.discounts[idx]
}

export function incrementDiscountViews(id) {
  const db = load()
  const idx = db.discounts.findIndex(d => d.id === Number(id))
  if (idx === -1) return null
  db.discounts[idx].views += 1
  save()
  return db.discounts[idx]
}

// ── CARDS ──────────────────────────────────────────────────
export function getUserCards(userId) {
  return load().cards.filter(c => c.user_id === userId)
}

export function saveCard(userId, cardData) {
  const db = load()
  const card = { user_id: userId, ...cardData }
  // Replace existing card
  const idx = db.cards.findIndex(c => c.user_id === userId)
  if (idx >= 0) {
    db.cards[idx] = card
  } else {
    db.cards.push(card)
  }
  save()
  return card
}

export function deleteCard(userId) {
  const db = load()
  db.cards = db.cards.filter(c => c.user_id !== userId)
  save()
}

// ── INSTALLMENTS ───────────────────────────────────────────
export function getUserInstallments(userId) {
  return load().installments.filter(i => i.user_id === userId)
}

export function createInstallment({ user_id, name, total, monthly_amount }) {
  const db = load()
  const installment = {
    id: newInstallmentId(),
    user_id,
    name,
    total,
    paid: 0,
    monthly_amount,
    next_due: futureDate(1),
  }
  db.installments.push(installment)
  save()
  return installment
}

export function payInstallment(id, amount) {
  const db = load()
  const idx = db.installments.findIndex(i => i.id === id)
  if (idx === -1) return null
  db.installments[idx].paid += amount
  if (db.installments[idx].paid >= db.installments[idx].total) {
    db.installments[idx].paid = db.installments[idx].total
  }
  // Advance next_due by 1 month
  const d = new Date(db.installments[idx].next_due)
  d.setMonth(d.getMonth() + 1)
  db.installments[idx].next_due = d.toISOString()
  save()
  return db.installments[idx]
}

// ── USER SCANS (many-to-many bridge) ───────────────────────
export function recordScan(userId, discountId) {
  const db = load()
  db.user_scans.push({ user_id: userId, discount_id: Number(discountId), scanned_at: today() })
  // Update user scan count + saved
  const user = db.users.find(u => u.id === userId)
  if (user) {
    user.scans += 1
    user.points += 10
    user.saved += rand(20, 100) // simulated saving
  }
  // Update discount uses
  const discount = db.discounts.find(d => d.id === Number(discountId))
  if (discount) discount.uses += 1
  // Update company uses
  if (discount) {
    const company = db.companies.find(c => c.id === discount.company_id)
    if (company) company.uses += 1
  }
  save()
}

export function getUserScans(userId) {
  const db = load()
  return db.user_scans
    .filter(s => s.user_id === userId)
    .map(s => {
      const discount = db.discounts.find(d => d.id === s.discount_id)
      return { ...s, discount: discount || null }
    })
    .sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at))
}

export function getAllUserScans() {
  return load().user_scans
}

// ── ADMIN ──────────────────────────────────────────────────
export function findAdmin(email, password) {
  const db = load()
  return db.admins.find(a => a.email === email && a.password === password) || null
}

// ── GOVERNORATES ──────────────────────────────────────────
export function getGovernorates() {
  return load().governorates
}

// ── MEDICAL CENTERS ──────────────────────────────────────
export function getAllMedicalCenters() {
  return load().medical_centers
}

export function getMedicalCentersByGovernorate(governorate) {
  const db = load()
  if (!governorate || governorate === 'all') return db.medical_centers
  return db.medical_centers.filter(c => c.governorate === governorate)
}

export function findMedicalCenterById(id) {
  return load().medical_centers.find(c => c.id === id) || null
}

// ── BANKS ────────────────────────────────────────────────
export function getAllBanks() {
  return load().banks
}

export function getBanksByGovernorate(governorate) {
  const db = load()
  if (!governorate || governorate === 'all') return db.banks
  return db.banks.filter(b => b.governorate === governorate)
}

export function findBankById(id) {
  return load().banks.find(b => b.id === id) || null
}

// ── RESTAURANTS ─────────────────────────────────────────
export function getAllRestaurants() {
  return load().restaurants || []
}

export function getAllEntertainmentVenues() {
  return load().entertainmentVenues || []
}

// ── USER ENROLLMENTS (medical / financial / combined) ────
export function enrollUserInService(userId, { service_type, center_id, bank_id }) {
  const db = load()
  const enrollment = {
    id: `EN-${Date.now()}-${rand(1000, 9999)}`,
    user_id: userId,
    service_type, // 'medical', 'financial', or 'combined'
    center_id: center_id || null,
    bank_id: bank_id || null,
    enrolled_at: today(),
    status: 'active',
  }
  // Remove any existing enrollment for this service type
  const idx = db.user_enrollments.findIndex(e => e.user_id === userId && e.service_type === service_type)
  if (idx >= 0) db.user_enrollments[idx] = enrollment
  else db.user_enrollments.push(enrollment)
  save()
  return enrollment
}

export function getUserEnrollments(userId) {
  const db = load()
  return db.user_enrollments
    .filter(e => e.user_id === userId)
    .map(e => {
      const center = e.center_id ? db.medical_centers.find(c => c.id === e.center_id) || null : null
      const bank = e.bank_id ? db.banks.find(b => b.id === e.bank_id) || null : null
      return { ...e, center, bank }
    })
}

export function cancelEnrollment(enrollmentId) {
  const db = load()
  const idx = db.user_enrollments.findIndex(e => e.id === enrollmentId)
  if (idx === -1) return null
  db.user_enrollments[idx].status = 'cancelled'
  save()
  return db.user_enrollments[idx]
}

// ── STATISTICS ─────────────────────────────────────────────
export function getStats() {
  const db = load()
  const approvedDiscounts = db.discounts.filter(d => d.status === 'approved')
  const pendingCompanies = db.companies.filter(c => c.status === 'pending')
  const totalRevenue = db.users.reduce((sum, u) => {
    if (u.plan === 'premium') return sum + 99
    if (u.plan === 'elite') return sum + 199
    return sum
  }, 0)
  return {
    totalUsers: db.users.length,
    totalCompanies: db.companies.length,
    totalDiscounts: db.discounts.length,
    approvedDiscounts: approvedDiscounts.length,
    pendingCompanies: pendingCompanies.length,
    pendingDiscounts: db.discounts.filter(d => d.status === 'pending').length,
    totalScans: db.user_scans.length,
    totalRevenue,
  }
}
