export type UserRole = 
  | 'مدير المكتب' 
  | 'مدير مشروع' 
  | 'محاسب' 
  | 'مهندس/مشرف' 
  | 'قارئ';

export type ProjectStage = 
  | 'المعاينة' 
  | 'التصميم' 
  | 'التأسيس' 
  | 'التنفيذ' 
  | 'التشطيبات النهائية' 
  | 'المراجعة والاستلام'
  | 'مكتمل';

export type ProjectStatus = 'جاري' | 'مراجعة' | 'معلق' | 'مكتمل';

export type ProjectType = 'تشطيب للغير' | 'شراء وتجهيز وبيع';

export interface FeeRateChange {
  id: string;
  rate: number;
  effectiveFrom: string; // YYYY-MM-DD
  reason?: string;
  createdBy: string;
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  projectId: string;
  name: string;
  category: 'كهرباء' | 'سباكة' | 'محارة ودهانات' | 'أرضيات وسيراميك' | 'جبس بورد' | 'نجارة وأبواب' | 'ألوميتال' | 'أخرى';
  unit: string;
  quantity: number;
  clientPrice: number;
  estimatedCost: number;
  notes?: string;
}

export interface ProjectStageUpdate {
  id: string;
  projectId: string;
  stage: ProjectStage;
  progress: number; // 0 - 100
  notes: string;
  author: string;
  createdAt: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  clientId?: string;
  type: ProjectType;
  stage: ProjectStage;
  progress: number; // 0 - 100
  fee: number; // Current office fee percentage
  rateHistory: FeeRateChange[];
  status: ProjectStatus;
  startDate: string;
  expectedEndDate?: string;
  location?: string;
  area?: number; // m2
  budget?: number;
  notes?: string;
  manager?: string;
  items?: ProjectItem[];
  updates?: ProjectStageUpdate[];
  createdAt: string;
}

export interface Client {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  status: 'نشط' | 'مكتمل' | 'محتمل';
  createdAt: string;
}

export type TransactionType = 'تحصيل' | 'مصروف';

export type ExpenseCategory = 
  | 'مواد وخامات' 
  | 'مصنعيات وعمالة' 
  | 'نقل وتشوين' 
  | 'مقاولين باطن' 
  | 'إداريات ورسوم تصاريح' 
  | 'أخرى';

export type CollectionCategory = 
  | 'دفعة تعاقد' 
  | 'دفعة مرحلية' 
  | 'دفعة تشطيبات' 
  | 'دفعة استلام نهائي' 
  | 'أخرى';

export type PaymentMethod = 'تحويل بنكي' | 'نقدي' | 'إنستاباي' | 'شيك';

export interface Transaction {
  id: string;
  projectId: string;
  type: TransactionType;
  category: ExpenseCategory | CollectionCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  desc: string;
  paymentMethod: PaymentMethod;
  refNumber?: string;
  attachmentName?: string;
  createdBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'إنشاء' | 'تعديل' | 'حذف' | 'تعديل نسبة الرسوم' | 'تسجيل حركة';
  entity: 'مشروع' | 'عميل' | 'حركة مالية' | 'نسبة الرسوم' | 'بند' | 'مرحلة';
  entityId: string;
  details: string;
  performedBy: string;
  role: UserRole;
}

export interface OfficeSettings {
  officeName: string;
  slogan: string;
  defaultFeeRate: number;
  currency: string;
  phone: string;
  email: string;
  address: string;
  isDemoData: boolean;
}
