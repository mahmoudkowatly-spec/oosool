import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Percent,
  History,
  Shield,
  Database,
  Copy,
  Check,
  RotateCcw,
  Download,
  AlertTriangle,
  FileCode,
  Lock,
} from 'lucide-react';
import { Project, OfficeSettings, AuditLog } from '../../types';
import { SUPABASE_SQL_MIGRATION } from '../../services/supabaseSchema';
import { formatMoney, formatDate } from '../../services/storage';

interface SettingsViewProps {
  settings: OfficeSettings;
  projects: Project[];
  auditLogs: AuditLog[];
  onUpdateSettings: (newSettings: Partial<OfficeSettings>) => void;
  onEditFee: (project: Project) => void;
  onToggleDemoData: () => void;
  onResetData: () => void;
  onExportJSON: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  projects,
  auditLogs,
  onUpdateSettings,
  onEditFee,
  onToggleDemoData,
  onResetData,
  onExportJSON,
}) => {
  const [activeTab, setActiveTab] = useState<'fees' | 'identity' | 'supabase' | 'audit' | 'data'>(
    'fees'
  );
  const [copiedSql, setCopiedSql] = useState(false);

  // Form states for office identity
  const [officeName, setOfficeName] = useState(settings.officeName);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [defaultFeeRate, setDefaultFeeRate] = useState(settings.defaultFeeRate);
  const [currency, setCurrency] = useState(settings.currency);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      officeName,
      slogan,
      defaultFeeRate: Number(defaultFeeRate),
      currency,
      phone,
      email,
      address,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_MIGRATION);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-[#174638]">إعدادات النظام والمكتب</h1>
        <p className="text-xs text-[#7d8982] mt-0.5">
          إدارة نسب الرسوم، هوية المكتب، سجل التدقيق، وتهيئة قاعدة بيانات Supabase المستقلة
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e6ebe7] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'fees'
              ? 'bg-[#174638] text-white shadow-xs'
              : 'text-[#536158] hover:bg-[#f6f8f6]'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>رسوم المشروعات وتاريخ السريان</span>
        </button>

        <button
          onClick={() => setActiveTab('identity')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'identity'
              ? 'bg-[#174638] text-white shadow-xs'
              : 'text-[#536158] hover:bg-[#f6f8f6]'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>هوية المكتب والبيانات العامة</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'audit'
              ? 'bg-[#174638] text-white shadow-xs'
              : 'text-[#536158] hover:bg-[#f6f8f6]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>سجل التدقيق والصلاحيات ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'supabase'
              ? 'bg-[#174638] text-white shadow-xs'
              : 'text-[#536158] hover:bg-[#f6f8f6]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>ربط Supabase PostgreSQL</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-colors ${
            activeTab === 'data'
              ? 'bg-[#174638] text-white shadow-xs'
              : 'text-[#536158] hover:bg-[#f6f8f6]'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إدارة البيانات والعزل</span>
        </button>
      </div>

      {/* TAB 1: FEES MANAGEMENT */}
      {activeTab === 'fees' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e6ebe7] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#174638]">
                جدول نسب رسوم المكتب حسب المشروعات
              </h2>
              <p className="text-xs text-[#7d8982] mt-0.5">
                تعديل النسبة وتحديد تاريخ سريانها دون المساس بالحسابات السابقة
              </p>
            </div>
            <div className="text-xs text-[#7d8982]">
              النسبة الافتراضية للتعاقدات الجديدة:{' '}
              <strong className="text-[#174638]">{settings.defaultFeeRate}%</strong>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#e6ebe7] rounded-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#fafbf9] text-[#7d8982] border-b border-[#e6ebe7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">المشروع</th>
                  <th className="py-3 px-4 font-semibold">العميل</th>
                  <th className="py-3 px-4 font-semibold">النسبة السارية</th>
                  <th className="py-3 px-4 font-semibold">تاريخ سريان النسبة الحالية</th>
                  <th className="py-3 px-4 font-semibold">عدد مرات التعديل</th>
                  <th className="py-3 px-4 font-semibold text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f2]">
                {projects.map((p) => {
                  const lastHistory =
                    p.rateHistory && p.rateHistory.length > 0
                      ? p.rateHistory[p.rateHistory.length - 1]
                      : null;

                  return (
                    <tr key={p.id} className="hover:bg-[#f6f8f6]">
                      <td className="py-3.5 px-4 font-bold text-[#174638]">
                        {p.name}
                        <span className="block text-[10px] text-[#7d8982] font-normal">{p.code}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#536158]">{p.client}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-[#e7f0e9] text-[#174638] font-bold rounded-lg text-xs">
                          {p.fee}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#7d8982]">
                        {lastHistory ? lastHistory.effectiveFrom || 'بداية العقد' : 'بداية العقد'}
                      </td>
                      <td className="py-3.5 px-4 text-[#7d8982]">
                        {(p.rateHistory?.length || 1) - 1} تعديلات
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onEditFee(p)}
                          className="px-3 py-1.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          تعديل النسبة
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: IDENTITY */}
      {activeTab === 'identity' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e6ebe7] shadow-xs max-w-3xl">
          <h2 className="text-base font-bold text-[#174638] mb-1">هوية المكتب وبيانات التواصل</h2>
          <p className="text-xs text-[#7d8982] mb-5">
            تظهر هذه البيانات في ترويسات التقارير وفواتير ومقايسات المشروعات
          </p>

          {savedSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>تم حفظ وتحديث بيانات المكتب بنجاح</span>
            </div>
          )}

          <form onSubmit={handleSaveIdentity} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#536158] mb-1">اسم المكتب أو الشركة</label>
                <input
                  type="text"
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#536158] mb-1">الشعار اللفظي (Slogan)</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#174638] mb-1">
                  نسبة الرسوم الافتراضية للتعاقدات الجديدة (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={defaultFeeRate}
                  onChange={(e) => setDefaultFeeRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#174638] focus:border-[#174638] rounded-xl font-bold text-[#174638] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#536158] mb-1">العملة الافتراضية</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#536158] mb-1">رقم الهاتف الرسمي</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl font-medium focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#536158] mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl font-medium focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-[#536158] mb-1">عنوان المكتب</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl font-medium focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl font-bold shadow-xs transition-colors"
              >
                حفظ التغييرات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e6ebe7] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#174638]">سجل التدقيق والتتبع (Audit Log)</h2>
              <p className="text-xs text-[#7d8982] mt-0.5">
                توثيق غير قابل للتعديل لكافة العمليات الحساسة (إنشاء مشروع، تسجيل حركات، تعديل نسب
                الرسوم)
              </p>
            </div>
            <span className="text-xs font-semibold text-[#174638] bg-[#e7f0e9] px-2.5 py-1 rounded-lg">
              {auditLogs.length} سجل مسجل
            </span>
          </div>

          <div className="overflow-x-auto border border-[#e6ebe7] rounded-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#fafbf9] text-[#7d8982] border-b border-[#e6ebe7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">التوقيت والتاريخ</th>
                  <th className="py-3 px-4 font-semibold">نوع العملية</th>
                  <th className="py-3 px-4 font-semibold">السجل المتأثر</th>
                  <th className="py-3 px-4 font-semibold">التفاصيل</th>
                  <th className="py-3 px-4 font-semibold">المستخدم المنفذ</th>
                  <th className="py-3 px-4 font-semibold">الدور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f2]">
                {[...auditLogs].reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-[#f6f8f6]">
                    <td className="py-3 px-4 text-[#7d8982] whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#e7f0e9] text-[#174638] font-bold rounded text-[11px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#174638] whitespace-nowrap">
                      {log.entity} ({log.entityId})
                    </td>
                    <td className="py-3 px-4 text-[#536158]">{log.details}</td>
                    <td className="py-3 px-4 font-medium text-[#25352e] whitespace-nowrap">
                      {log.performedBy}
                    </td>
                    <td className="py-3 px-4 text-[#7d8982] whitespace-nowrap">{log.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SUPABASE INTEGRATION */}
      {activeTab === 'supabase' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e6ebe7] shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6ebe7] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#174638]">
                  إعداد قاعدة بيانات Supabase المستقلة للمكتب
                </h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  PostgreSQL + RLS
                </span>
              </div>
              <p className="text-xs text-[#7d8982] mt-0.5">
                مخطط جاهز يملكه المكتب بنسبة 100% مع عزل كامل للبيانات وتأمين الصلاحيات
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              {copiedSql ? <Check className="w-4 h-4 text-[#86efac]" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'تم نسخ سكربت SQL!' : 'نسخ سكربت إنشاء الجداول'}</span>
            </button>
          </div>

          {/* Security Notice regarding secrets */}
          <div className="p-4 bg-[#fdfbee] border border-[#f5e6a8] rounded-xl text-xs text-[#7d5e16] flex items-start gap-3">
            <Lock className="w-5 h-5 shrink-0 text-[#925f17] mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block mb-0.5 text-[#925f17]">
                حماية الأسرار ومفاتيح الاتصال:
              </strong>
              وفق المعايير الأمنية، لا يتم تضمين أي مفتاح سري (Service Role Key) في كود المتصفح. عند
              الربط المباشر مع Supabase، يتم تخزين المفاتيح في متغيرات بيئة الخادم (Server
              Environment Variables مثل <code className="font-mono bg-white px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code>)، بينما يتصل المتصفح عبر المفتاح العام <code className="font-mono bg-white px-1 rounded">anon_key</code> وتحت حماية سياسات Row Level Security.
            </div>
          </div>

          {/* Setup Steps Guide */}
          <div className="space-y-3 text-xs text-[#536158]">
            <h3 className="font-bold text-[#174638] text-sm">خطوات التفعيل في حساب مكتب أصول:</h3>
            <ol className="list-decimal list-inside space-y-2 pr-2 leading-relaxed">
              <li>
                قم بإنشاء مشروع جديد في حسابك على <strong>Supabase</strong> واختر المنطقة الأقرب
                (مثلاً Frankfurt أو London).
              </li>
              <li>
                افتح تبويب <strong>SQL Editor</strong> داخل لوحة تحكم Supabase والصق كود التهيئة
                أدناه واضغط <strong>Run</strong>.
              </li>
              <li>
                سيتم تلقائياً إنشاء كافة الجداول (المشروعات، العملاء، الحركات، نسب الرسوم، وسجل
                التدقيق) وتفعيل سياسات الأمان والعزل (RLS).
              </li>
              <li>
                انسخ رابط المشروع ومفتاح الوصول وضعها في متغيرات البيئة لبدء المزامنة الفورية.
              </li>
            </ol>
          </div>

          {/* SQL Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-bold text-[#174638] flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-[#174638]" />
                <span>سكربت الترحيل وقواعد البيانات (DDL Migration):</span>
              </span>
              <button
                onClick={handleCopySql}
                className="text-xs font-bold text-[#174638] hover:underline"
              >
                نسخ بالكامل
              </button>
            </div>

            <pre
              dir="ltr"
              className="p-4 bg-[#1e2924] text-[#d1e5db] rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed text-left border border-[#2d4239]"
            >
              {SUPABASE_SQL_MIGRATION}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: DATA ISOLATION & RESET */}
      {activeTab === 'data' && (
        <div className="bg-white rounded-2xl p-6 border border-[#e6ebe7] shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#174638]">إدارة البيانات والعزل</h2>
            <p className="text-xs text-[#7d8982] mt-0.5">
              فصل البيانات التجريبية عن البيانات الحقيقية وتصدير نسخ احتياطية
            </p>
          </div>

          {/* Toggle Demo Data */}
          <div className="p-4 rounded-xl border border-[#e6ebe7] bg-[#fafbf9] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#174638] block">وضع البيانات التجريبية</span>
              <span className="text-[11px] text-[#7d8982]">
                {settings.isDemoData
                  ? 'النظام يعمل حالياً ببيانات تجريبية معزولة لأغراض التجربة والعرض'
                  : 'النظام في وضع البيانات الحقيقية لمكتب أصول'}
              </span>
            </div>
            <button
              onClick={onToggleDemoData}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                settings.isDemoData
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-[#174638] text-white hover:bg-[#1e5948]'
              }`}
            >
              {settings.isDemoData ? 'بيانات تجريبية (مفعل)' : 'بيانات حقيقية'}
            </button>
          </div>

          {/* Export JSON Backup */}
          <div className="p-4 rounded-xl border border-[#e6ebe7] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#174638] block">
                تصدير نسخة احتياطية (JSON)
              </span>
              <span className="text-[11px] text-[#7d8982]">
                تحميل ملف يحتوي على المشروعات والعملاء والحركات وسجل التدقيق
              </span>
            </div>
            <button
              onClick={onExportJSON}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#dde6df] hover:border-[#174638] text-[#174638] rounded-xl text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تصدير JSON</span>
            </button>
          </div>

          {/* Reset to Factory / Clean Seed */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-800 block">
                إعادة ضبط البيانات الأولية
              </span>
              <span className="text-[11px] text-rose-700">
                استعادة البيانات النموذجية الأولية ومسح أي إدخالات اختبارية محلية
              </span>
            </div>
            <button
              onClick={onResetData}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              استعادة النموذج الأصلي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
