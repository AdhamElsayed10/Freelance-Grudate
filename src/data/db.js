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
export function createUser({ name, email, job, password, plan = 'free', governorate = '' }) {
  const db = load()
  const exists = db.users.find(u => u.email === email)
  if (exists) return { error: 'البريد الإلكتروني موجود بالفعل' }
  const user = {
    id: newUserId(),
    name,
    email,
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
