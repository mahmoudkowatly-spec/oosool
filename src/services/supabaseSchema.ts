/**
 * Supabase & PostgreSQL Architecture for "أصول للهندسة والتشطيبات"
 * Multi-tenant isolation by organization_id, Role-based security (RLS), and audit logging.
 */

export const SUPABASE_SQL_MIGRATION = `-- ========================================================
-- أصول للهندسة والتشطيبات - مخطط قاعدة البيانات المستقلة (Supabase / PostgreSQL)
-- هيكل الجداول وسياسات حماية البيانات (Row Level Security - RLS)
-- ========================================================

-- 1. جدول بيانات المكتب والمنظمة
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slogan TEXT,
  currency TEXT DEFAULT 'ج.م',
  default_fee_rate NUMERIC(5,2) DEFAULT 12.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. جدول ملفات المستخدمين والأدوار
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('مدير المكتب', 'مدير مشروع', 'محاسب', 'مهندس/مشرف', 'قارئ')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. جدول العملاء
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'نشط',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. جدول المشروعات
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  client_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'تشطيب للغير',
  stage TEXT NOT NULL DEFAULT 'المعاينة',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  current_fee NUMERIC(5,2) NOT NULL DEFAULT 12.00,
  status TEXT DEFAULT 'جاري',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_end_date DATE,
  location TEXT,
  area NUMERIC(10,2),
  budget NUMERIC(14,2),
  notes TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. جدول سجل نسب رسوم المكتب وتاريخ سريانها (قاعدة عمل #1 و #6)
CREATE TABLE IF NOT EXISTS public.project_fee_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  rate NUMERIC(5,2) NOT NULL,
  effective_from DATE NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. جدول بنود التشطيب والمقايسة (BOQ)
CREATE TABLE IF NOT EXISTS public.project_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  client_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  estimated_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. جدول تحديثات الموقع والمراحل
CREATE TABLE IF NOT EXISTS public.project_stage_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  progress INTEGER NOT NULL,
  notes TEXT,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. جدول الحركات المالية (تحصيلات ومصروفات)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('تحصيل', 'مصروف')),
  category TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  ref_number TEXT,
  attachment_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. جدول سجل التدقيق (Audit Logs)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- تفعيل سياسات الأمان (Row Level Security)
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_fee_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stage_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- سياسة عزل بيانات المكتب: المستخدم يرى ويعدل فقط بيانات المنظمة التابع لها
CREATE POLICY org_isolation_projects ON public.projects
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY org_isolation_transactions ON public.transactions
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );
`;
