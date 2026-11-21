import { Project, Client, Transaction, AuditLog, OfficeSettings, UserRole } from '../types';

const STORAGE_KEY = 'aousol_management_data_v2';

export const INITIAL_SETTINGS: OfficeSettings = {
  officeName: 'أصول للهندسة والتشطيبات',
  slogan: 'حلول معمارية وهندسية وتنفيذ تشطيبات راقية',
  defaultFeeRate: 12,
  currency: 'ج.م',
  phone: '01000000000',
  email: 'info@aousol.com',
  address: 'القاهرة - مصر',
  isDemoData: true,
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'C-101',
    code: 'CLI-01',
    name: 'م. أحمد الشناوي',
    phone: '01012345678',
    email: 'ahmed.elshinawy@example.com',
    address: 'التجمع الخامس - القاهرة الجديدة',
    notes: 'عميل تشطيب كامل لشقة سكنية كمبوند النخيل',
    status: 'نشط',
    createdAt: '2026-05-15',
  },
  {
    id: 'C-102',
    code: 'CLI-02',
    name: 'شركة آفاق للاستثمار والتطوير',
    phone: '01123456789',
    email: 'info@afaq-dev.com',
    address: 'القرية الذكية - مبنى B14',
    notes: 'تجديد مقرات إدارية وتشطيب مكاتب تنفيذية',
    status: 'نشط',
    createdAt: '2026-05-20',
  },
  {
    id: 'C-103',
    code: 'CLI-03',
    name: 'د. سارة المنشاوي',
    phone: '01234567890',
    email: 'dr.sara@example.com',
    address: 'مدينة الشيخ زايد - كمبوند الياسمين',
    notes: 'تشطيب فيلا خاصة، أعمال ديكور وتأسيس مسابح ولاندسكيب',
    status: 'نشط',
    createdAt: '2026-06-01',
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'P-104',
    code: 'PRJ-104',
    name: 'تشطيب شقة النخيل',
    client: 'م. أحمد الشناوي',
    clientId: 'C-101',
    type: 'تشطيب للغير',
    stage: 'التنفيذ',
    progress: 65,
    fee: 12,
    rateHistory: [
      {
        id: 'R-1',
        rate: 12,
        effectiveFrom: '2026-05-15',
        reason: 'النسبة المتفق عليها في بداية التعاقد',
        createdBy: 'مدير المكتب',
        createdAt: '2026-05-15 10:00:00',
      },
    ],
    status: 'جاري',
    startDate: '2026-05-20',
    expectedEndDate: '2026-11-30',
    location: 'كمبوند النخيل - القاهرة الجديدة',
    area: 220,
    budget: 950000,
    manager: 'م. كريم سامي',
    notes: 'تشطيب سوبر لوكس شاملاً الكهرباء الذكية والأرضيات الرخامية',
    items: [
      { id: 'I-1', projectId: 'P-104', name: 'أعمال تأسيس السباكة والشبكات', category: 'سباكة', unit: 'مقطوعية', quantity: 1, clientPrice: 65000, estimatedCost: 52000 },
      { id: 'I-2', projectId: 'P-104', name: 'تأسيس الكهرباء وتمديد الكابلات', category: 'كهرباء', unit: 'مقطوعية', quantity: 1, clientPrice: 75000, estimatedCost: 60000 },
      { id: 'I-3', projectId: 'P-104', name: 'محارة ودهانات أولية', category: 'محارة ودهانات', unit: 'م2', quantity: 450, clientPrice: 120, estimatedCost: 95 },
    ],
    updates: [
      { id: 'U-1', projectId: 'P-104', stage: 'التأسيس', progress: 30, notes: 'تم الانتهاء من تكسير ومسارات الكهرباء واعتماد أماكن الأفياش', author: 'م. كريم سامي', createdAt: '2026-06-02' },
      { id: 'U-2', projectId: 'P-104', stage: 'التنفيذ', progress: 65, notes: 'اختبار ضغط شبكة السباكة مع شركة الأنابيب، وجاري فرد عزل الحمامات', author: 'م. كريم سامي', createdAt: '2026-06-20' },
    ],
    createdAt: '2026-05-15',
  },
  {
    id: 'P-103',
    code: 'PRJ-103',
    name: 'تجديد مقرات آفاق الإدارية',
    client: 'شركة آفاق للاستثمار والتطوير',
    clientId: 'C-102',
    type: 'تشطيب للغير',
    stage: 'المراجعة والاستلام',
    progress: 90,
    fee: 10,
    rateHistory: [
      {
        id: 'R-2',
        rate: 10,
        effectiveFrom: '2026-04-10',
        reason: 'التعاقد مع خصم حجم أعمال للشركات',
        createdBy: 'مدير المكتب',
        createdAt: '2026-04-10 11:30:00',
      },
    ],
    status: 'مراجعة',
    startDate: '2026-04-15',
    expectedEndDate: '2026-07-15',
    location: 'القرية الذكية - الجيزة',
    area: 450,
    budget: 1400000,
    manager: 'م. تامر عبد العال',
    notes: 'أعمال قواطع زجاجية، أرضيات موكيت فندقي وشبكات داتا وسنترال',
    items: [
      { id: 'I-4', projectId: 'P-103', name: 'قواطع زجاج سيكوريت عازل للصوت', category: 'ألوميتال', unit: 'م2', quantity: 180, clientPrice: 1800, estimatedCost: 1500 },
      { id: 'I-5', projectId: 'P-103', name: 'أعمال أسقف معلقة وجبس بورد', category: 'جبس بورد', unit: 'م2', quantity: 450, clientPrice: 320, estimatedCost: 260 },
    ],
    updates: [
      { id: 'U-3', projectId: 'P-103', stage: 'المراجعة والاستلام', progress: 90, notes: 'جاري تسليم قائمة الملاحظات (Snag List) تمهيداً للاستلام النهائي', author: 'م. تامر عبد العال', createdAt: '2026-06-25' },
    ],
    createdAt: '2026-04-10',
  },
  {
    id: 'P-102',
    code: 'PRJ-102',
    name: 'تشطيب فيلا الياسمين',
    client: 'د. سارة المنشاوي',
    clientId: 'C-103',
    type: 'تشطيب للغير',
    stage: 'التأسيس',
    progress: 35,
    fee: 15,
    rateHistory: [
      {
        id: 'R-3',
        rate: 15,
        effectiveFrom: '2026-05-01',
        reason: 'النسبة التعاقدية للتشطيب الفاخر واللاندسكيب',
        createdBy: 'مدير المكتب',
        createdAt: '2026-05-01 09:15:00',
      },
    ],
    status: 'جاري',
    startDate: '2026-05-05',
    expectedEndDate: '2027-01-15',
    location: 'كمبوند الياسمين - الشيخ زايد',
    area: 600,
    budget: 2800000,
    manager: 'م. عمر حلمي',
    notes: 'فيلا مستقلة: أرضي وأول وروف مع حديقة ومسبح خاص',
    items: [
      { id: 'I-6', projectId: 'P-102', name: 'حفر وتأسيس غرفة طلمبات المسبح', category: 'سباكة', unit: 'مقطوعية', quantity: 1, clientPrice: 110000, estimatedCost: 90000 },
      { id: 'I-7', projectId: 'P-102', name: 'توريد حديد وأسمنت أعمال الترميم', category: 'أخرى', unit: 'طن', quantity: 8, clientPrice: 42000, estimatedCost: 39000 },
    ],
    updates: [
      { id: 'U-4', projectId: 'P-102', stage: 'التأسيس', progress: 35, notes: 'إنهاء صب شروخ الحوائط والبدء في شد شبكة الكهرباء الرئيسية', author: 'م. عمر حلمي', createdAt: '2026-06-12' },
    ],
    createdAt: '2026-05-01',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-1001',
    projectId: 'P-104',
    type: 'تحصيل',
    category: 'دفعة تعاقد',
    amount: 150000,
    date: '2026-05-20',
    desc: 'دفعة التعاقد الأولى بشيك بنكي مسحوب لصالح المكتب',
    paymentMethod: 'تحويل بنكي',
    refNumber: 'TRX-99881',
    createdBy: 'محاسب المكتب',
    createdAt: '2026-05-20 12:00:00',
  },
  {
    id: 'TX-1002',
    projectId: 'P-104',
    type: 'مصروف',
    category: 'مواد وخامات',
    amount: 45000,
    date: '2026-05-25',
    desc: 'شراء مواسير ومحابس سباكة معتمدة وكيماويات عزل مائي',
    paymentMethod: 'نقدي',
    refNumber: 'INV-4412',
    createdBy: 'مهندس الموقع',
    createdAt: '2026-05-25 15:30:00',
  },
  {
    id: 'TX-1003',
    projectId: 'P-104',
    type: 'مصروف',
    category: 'مصنعيات وعمالة',
    amount: 28000,
    date: '2026-06-03',
    desc: 'دفعة مصنعيات لسباكي الموقع وأعمال تكسير وتمديد',
    paymentMethod: 'نقدي',
    refNumber: 'REC-092',
    createdBy: 'مهندس الموقع',
    createdAt: '2026-06-03 18:00:00',
  },
  {
    id: 'TX-1004',
    projectId: 'P-104',
    type: 'تحصيل',
    category: 'دفعة مرحلية',
    amount: 100000,
    date: '2026-06-15',
    desc: 'تحصيل دفعة إنجاز مرحلة التأسيس عن طريق إنستاباي',
    paymentMethod: 'إنستاباي',
    refNumber: 'IP-2026-88',
    createdBy: 'محاسب المكتب',
    createdAt: '2026-06-15 11:20:00',
  },
  {
    id: 'TX-1005',
    projectId: 'P-104',
    type: 'مصروف',
    category: 'مواد وخامات',
    amount: 36000,
    date: '2026-06-18',
    desc: 'توريد كابلات سويدي أصلية وقواطع لوحة التوزيع',
    paymentMethod: 'تحويل بنكي',
    refNumber: 'SWD-771',
    createdBy: 'مسؤول المشتريات',
    createdAt: '2026-06-18 14:15:00',
  },
  {
    id: 'TX-1006',
    projectId: 'P-103',
    type: 'تحصيل',
    category: 'دفعة تعاقد',
    amount: 300000,
    date: '2026-04-18',
    desc: 'دفعة التوقيع وبدء الأعمال من شركة آفاق',
    paymentMethod: 'تحويل بنكي',
    refNumber: 'AFQ-CHK-10',
    createdBy: 'محاسب المكتب',
    createdAt: '2026-04-18 10:00:00',
  },
  {
    id: 'TX-1007',
    projectId: 'P-103',
    type: 'مصروف',
    category: 'مواد وخامات',
    amount: 85000,
    date: '2026-05-10',
    desc: 'دفعة أولى لتوريد قواطع الزجاج السيكوريت والإكسسوارات',
    paymentMethod: 'تحويل بنكي',
    refNumber: 'GLS-119',
    createdBy: 'مسؤول المشتريات',
    createdAt: '2026-05-10 16:00:00',
  },
  {
    id: 'TX-1008',
    projectId: 'P-103',
    type: 'مصروف',
    category: 'مصنعيات وعمالة',
    amount: 42000,
    date: '2026-05-28',
    desc: 'أجور فنيي الجبس بورد وتعديلات الدكتات والتكييف المركزي',
    paymentMethod: 'نقدي',
    refNumber: 'REC-332',
    createdBy: 'مهندس الموقع',
    createdAt: '2026-05-28 17:45:00',
  },
  {
    id: 'TX-1009',
    projectId: 'P-102',
    type: 'تحصيل',
    category: 'دفعة تعاقد',
    amount: 250000,
    date: '2026-05-08',
    desc: 'دفعة تعاقد فيلا الياسمين واعتماد الرسومات التنفيذية',
    paymentMethod: 'تحويل بنكي',
    refNumber: 'YS-CHK-01',
    createdBy: 'مدير المكتب',
    createdAt: '2026-05-08 13:00:00',
  },
  {
    id: 'TX-1010',
    projectId: 'P-102',
    type: 'مصروف',
    category: 'مواد وخامات',
    amount: 68000,
    date: '2026-05-19',
    desc: 'شراء طوب وحديد تسليح ومونة ترميم للحديقة والأسوار',
    paymentMethod: 'نقدي',
    refNumber: 'INV-8891',
    createdBy: 'مهندس الموقع',
    createdAt: '2026-05-19 11:30:00',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-1',
    timestamp: '2026-05-15 10:00:00',
    action: 'إنشاء',
    entity: 'مشروع',
    entityId: 'P-104',
    details: 'إنشاء مشروع تشطيب شقة النخيل بنسبة رسوم 12%',
    performedBy: 'م. محمود كوتلي',
    role: 'مدير المكتب',
  },
  {
    id: 'LOG-2',
    timestamp: '2026-05-20 12:00:00',
    action: 'تسجيل حركة',
    entity: 'حركة مالية',
    entityId: 'TX-1001',
    details: 'تسجيل تحصيل مبلغ 150,000 ج.م كدفعة تعاقد',
    performedBy: 'أحمد سعيد',
    role: 'محاسب',
  },
  {
    id: 'LOG-3',
    timestamp: '2026-05-25 15:30:00',
    action: 'تسجيل حركة',
    entity: 'حركة مالية',
    entityId: 'TX-1002',
    details: 'تسجيل مصروف مواد وخامات بمبلغ 45,000 ج.م',
    performedBy: 'كريم سامي',
    role: 'مهندس/مشرف',
  },
];

export interface AppState {
  projects: Project[];
  clients: Client[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  settings: OfficeSettings;
  activeRole: UserRole;
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        projects: parsed.projects || INITIAL_PROJECTS,
        clients: parsed.clients || INITIAL_CLIENTS,
        transactions: parsed.transactions || INITIAL_TRANSACTIONS,
        auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
        settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
        activeRole: parsed.activeRole || 'مدير المكتب',
      };
    }
  } catch (err) {
    console.error('Failed to parse saved state:', err);
  }

  return {
    projects: INITIAL_PROJECTS,
    clients: INITIAL_CLIENTS,
    transactions: INITIAL_TRANSACTIONS,
    auditLogs: INITIAL_AUDIT_LOGS,
    settings: INITIAL_SETTINGS,
    activeRole: 'مدير المكتب',
  };
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save app state:', err);
  }
}

/**
 * Business Rule #6:
 * When fee rate changes, previous transactions are NOT recalculated.
 * Find the fee rate that was effective on the date of the given transaction.
 */
export function getFeeRateAtDate(project: Project, txDate: string): number {
  if (!project.rateHistory || project.rateHistory.length === 0) {
    return project.fee ?? 12;
  }

  // Filter rate changes that took effect on or before the transaction date
  const applicableRates = project.rateHistory
    .filter((h) => !h.effectiveFrom || h.effectiveFrom <= txDate)
    .sort((a, b) => (a.effectiveFrom || '').localeCompare(b.effectiveFrom || ''));

  if (applicableRates.length > 0) {
    return applicableRates[applicableRates.length - 1].rate;
  }

  // If transaction date is earlier than all records, use the earliest rate
  const sortedAll = [...project.rateHistory].sort((a, b) =>
    (a.effectiveFrom || '').localeCompare(b.effectiveFrom || '')
  );
  return sortedAll[0].rate;
}

/**
 * Calculates office fee for a specific expense transaction based on the rate in effect on its date.
 * Rule #2: Applied to recorded expenses (materials, labor, transport, etc.), not the fee itself.
 */
export function calculateTransactionFee(project: Project, tx: Transaction): number {
  if (tx.type !== 'مصروف') return 0;
  const rate = getFeeRateAtDate(project, tx.date);
  return (tx.amount * rate) / 100;
}

/**
 * Complete project financial breakdown:
 * - totalCollections: Sum of positive receipts (+).
 * - totalExpenses: Sum of cash expenses paid (-).
 * - netCashFlow: Collections - Expenses (Positive if collections exceed cash paid).
 * - officeFeeTotal: Independent office revenue, calculated per expense transaction based on its effective rate.
 * - clientRemainingBalance: Collections - Expenses - OfficeFee (Real contract balance from client standpoint).
 */
export interface ProjectFinancials {
  totalCollections: number;
  totalExpenses: number;
  netCashFlow: number;
  officeFeeTotal: number;
  clientRemainingBalance: number;
}

export function calculateProjectFinancials(
  project: Project,
  transactions: Transaction[]
): ProjectFinancials {
  const pTx = transactions.filter((t) => t.projectId === project.id);

  let totalCollections = 0;
  let totalExpenses = 0;
  let officeFeeTotal = 0;

  for (const t of pTx) {
    if (t.type === 'تحصيل') {
      totalCollections += t.amount;
    } else if (t.type === 'مصروف') {
      totalExpenses += t.amount;
      const rate = getFeeRateAtDate(project, t.date);
      officeFeeTotal += (t.amount * rate) / 100;
    }
  }

  const netCashFlow = totalCollections - totalExpenses;
  // What the client has funded minus what was spent and earned by office
  const clientRemainingBalance = totalCollections - (totalExpenses + officeFeeTotal);

  return {
    totalCollections,
    totalExpenses,
    netCashFlow,
    officeFeeTotal,
    clientRemainingBalance,
  };
}

/**
 * Global financial summary across all projects
 */
export function calculateGlobalFinancials(
  projects: Project[],
  transactions: Transaction[]
) {
  let totalCollections = 0;
  let totalExpenses = 0;
  let totalOfficeFees = 0;

  for (const p of projects) {
    const pf = calculateProjectFinancials(p, transactions);
    totalCollections += pf.totalCollections;
    totalExpenses += pf.totalExpenses;
    totalOfficeFees += pf.officeFeeTotal;
  }

  const netCashFlow = totalCollections - totalExpenses;

  return {
    totalCollections,
    totalExpenses,
    netCashFlow,
    totalOfficeFees,
  };
}

/**
 * Formats a monetary number into standard Egyptian Pounds Arabic representation.
 */
export function formatMoney(amount: number, currency: string = 'ج.م'): string {
  const formatted = new Intl.NumberFormat('ar-EG', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));

  return `${formatted} ${currency}`;
}

/**
 * Formats date into readable Arabic string
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Helper to add an audit log
 */
export function createAuditLog(
  action: AuditLog['action'],
  entity: AuditLog['entity'],
  entityId: string,
  details: string,
  user: { name: string; role: UserRole }
): AuditLog {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return {
    id: `LOG-${Date.now().toString().slice(-6)}`,
    timestamp,
    action,
    entity,
    entityId,
    details,
    performedBy: user.name,
    role: user.role,
  };
}
