import React from 'react';
import {
  FolderKanban,
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Eye,
  Plus,
  Coins,
} from 'lucide-react';
import { Project, Transaction } from '../../types';
import {
  calculateGlobalFinancials,
  calculateProjectFinancials,
  formatMoney,
  formatDate,
} from '../../services/storage';

interface DashboardViewProps {
  projects: Project[];
  transactions: Transaction[];
  onOpenNewProject: () => void;
  onOpenNewTransaction: () => void;
  onSelectProject: (project: Project) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  transactions,
  onOpenNewProject,
  onOpenNewTransaction,
  onSelectProject,
  onNavigateToTab,
}) => {
  const financials = calculateGlobalFinancials(projects, transactions);

  // Active projects
  const activeProjects = projects.filter((p) => p.status === 'جاري' || p.status === 'مراجعة');

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6ebe7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#174638]">أهلاً بك في منصة أصول</h1>
            <span className="text-xs bg-[#e7f0e9] text-[#174638] px-2.5 py-0.5 rounded-full font-bold">
              لوحة التحكم التشغيلية
            </span>
          </div>
          <p className="text-xs text-[#7d8982] mt-1">
            متابعة المشروعات الهندسية، سيولة الموقع، والرسوم التعاقدية وفق قواعد العمل المعتمدة
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#e7f0e9] hover:bg-[#d4e6d8] text-[#174638] rounded-xl text-xs font-bold border border-[#c4dcce] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل حركة نقدية</span>
          </button>
          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>مشروع جديد</span>
          </button>
        </div>
      </div>

      {/* Metric Cards - 4 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Projects */}
        <div
          onClick={() => onNavigateToTab('projects')}
          className="bg-white rounded-2xl p-5 border border-[#e6ebe7] shadow-xs hover:border-[#174638] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#7d8982]">
            <span className="text-xs font-semibold">المشروعات النشطة</span>
            <div className="w-8 h-8 rounded-lg bg-[#f6f8f6] text-[#174638] flex items-center justify-center group-hover:bg-[#e7f0e9] transition-colors">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-[#174638]">{projects.length}</span>
            <span className="text-xs text-[#7d8982] mr-2">
              ({activeProjects.length} قيد التنفيذ والمراجعة)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#7d8982] flex items-center gap-1">
            <span>عرض كل المشروعات والمراحل ←</span>
          </div>
        </div>

        {/* Card 2: Total Collections */}
        <div
          onClick={() => onNavigateToTab('finance')}
          className="bg-white rounded-2xl p-5 border border-[#e6ebe7] shadow-xs hover:border-[#174638] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#7d8982]">
            <span className="text-xs font-semibold">إجمالي التحصيلات (دفعات)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-emerald-700">
              +{formatMoney(financials.totalCollections)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#7d8982]">
            حركات موجبة مستلمة من العملاء
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div
          onClick={() => onNavigateToTab('finance')}
          className="bg-white rounded-2xl p-5 border border-[#e6ebe7] shadow-xs hover:border-[#174638] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#7d8982]">
            <span className="text-xs font-semibold">المصروفات النقدية المدفوعة</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-700">
              −{formatMoney(financials.totalExpenses)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#7d8982]">
            خامات، مصنعيات، ونقل وتشوين
          </div>
        </div>

        {/* Card 4: Net Cash Flow */}
        <div
          onClick={() => onNavigateToTab('finance')}
          className="bg-white rounded-2xl p-5 border border-[#e6ebe7] shadow-xs hover:border-[#174638] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-[#7d8982]">
            <span className="text-xs font-semibold">صافي حركة السيولة</span>
            <div className="w-8 h-8 rounded-lg bg-[#f6f8f6] text-[#174638] flex items-center justify-center group-hover:bg-[#e7f0e9] transition-colors">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl font-black ${
                financials.netCashFlow >= 0 ? 'text-[#174638]' : 'text-rose-700'
              }`}
            >
              {financials.netCashFlow >= 0 ? '+' : '−'}
              {formatMoney(Math.abs(financials.netCashFlow))}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#7d8982]">
            التحصيلات ناقص المصروفات النقدية
          </div>
        </div>
      </div>

      {/* Distinct Office Fee Revenue Banner (Rule #5) */}
      <div className="bg-linear-to-r from-[#174638] to-[#205c4a] rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6 text-[#86efac]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">رسوم أصول المعتمدة (إيراد المكتب)</h3>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                بند مستقل تماماً
              </span>
            </div>
            <p className="text-xs text-[#d1e5db] mt-0.5 leading-relaxed">
              تُحسب تلقائياً كنسبة من كل مصروف مسجل وفق تاريخ سريانه، ولا تُخصم من حركة النقد
              الفعلية للمشروع.
            </p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl px-4 py-2.5 backdrop-blur-xs text-left shrink-0">
          <span className="block text-[11px] text-[#d1e5db] text-right">إجمالي إيراد الرسوم المقدرة</span>
          <span className="text-xl font-extrabold text-[#86efac]">
            {formatMoney(financials.totalOfficeFees)}
          </span>
        </div>
      </div>

      {/* Main Grid: Projects Table (Left) & Financial Insights (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Projects (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e6ebe7] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#e6ebe7] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#174638]">المشروعات الجارية</h2>
              <p className="text-xs text-[#7d8982] mt-0.5">متابعة مراحل التنفيذ ونسب رسوم كل تعاقد</p>
            </div>
            <button
              onClick={() => onNavigateToTab('projects')}
              className="text-xs font-bold text-[#174638] hover:underline"
            >
              عرض الكل ({projects.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#fafbf9] text-[#7d8982] border-b border-[#e6ebe7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">المشروع / العميل</th>
                  <th className="py-3 px-4 font-semibold">المرحلة</th>
                  <th className="py-3 px-4 font-semibold">نسبة الإنجاز</th>
                  <th className="py-3 px-4 font-semibold">رسوم المكتب</th>
                  <th className="py-3 px-4 font-semibold">صافي السيولة</th>
                  <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f2]">
                {projects.slice(0, 4).map((p) => {
                  const pf = calculateProjectFinancials(p, transactions);
                  return (
                    <tr key={p.id} className="hover:bg-[#f6f8f6] transition-colors">
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectProject(p)}
                          className="font-bold text-[#174638] hover:underline text-right block"
                        >
                          {p.name}
                        </button>
                        <span className="text-[11px] text-[#7d8982]">
                          {p.code} · {p.client}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e7f0e9] text-[#174638]">
                          {p.stage}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="w-24">
                          <div className="flex justify-between text-[10px] text-[#7d8982] mb-1">
                            <span>{p.progress}%</span>
                          </div>
                          <div className="w-full bg-[#e6ebe7] rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-[#174638] h-1.5 rounded-full transition-all"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#174638]">
                        <span>{p.fee}%</span>
                        <span className="block text-[10px] font-normal text-[#7d8982]">
                          {formatMoney(pf.officeFeeTotal)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold ${
                            pf.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {pf.netCashFlow >= 0 ? '+' : '−'}
                          {formatMoney(Math.abs(pf.netCashFlow))}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onSelectProject(p)}
                          className="p-1.5 rounded-lg text-[#536158] hover:bg-[#e7f0e9] hover:text-[#174638] transition-colors"
                          title="عرض تفاصيل المشروع"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Financial Split & Summary (1/3 width) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#e6ebe7] shadow-xs">
            <h3 className="text-sm font-bold text-[#174638] mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#174638]" />
              <span>توزيع السيولة والرسوم</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#fafbf9] rounded-xl border border-[#eef2ee] flex items-center justify-between">
                <div>
                  <span className="text-[#7d8982] block text-[11px]">التحصيلات المستلمة (+)</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    +{formatMoney(financials.totalCollections)}
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>

              <div className="p-3 bg-[#fafbf9] rounded-xl border border-[#eef2ee] flex items-center justify-between">
                <div>
                  <span className="text-[#7d8982] block text-[11px]">المصروفات النقدية (−)</span>
                  <span className="font-bold text-rose-700 text-sm">
                    −{formatMoney(financials.totalExpenses)}
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              </div>

              <div className="p-3 bg-[#fafbf9] rounded-xl border border-[#eef2ee] flex items-center justify-between">
                <div>
                  <span className="text-[#7d8982] block text-[11px]">رسوم المكتب المستقلة</span>
                  <span className="font-bold text-[#174638] text-sm">
                    {formatMoney(financials.totalOfficeFees)}
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#174638]" />
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#f6f8f6] rounded-xl text-[11px] text-[#536158] leading-relaxed flex items-start gap-2 border border-[#e6ebe7]">
              <AlertCircle className="w-4 h-4 text-[#174638] shrink-0 mt-0.5" />
              <div>
                <strong>تذكير بقواعد الحساب:</strong>
                <p className="mt-0.5">
                  صافي حركة المشروع = التحصيلات المستلمة ناقص المصروفات المدفوعة. رسوم المكتب تُعرض
                  بشكل مستقل ولا تُخصم من رصيد الخزينة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#e6ebe7] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#e6ebe7] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#174638]">آخر المعاملات المالية</h2>
            <p className="text-xs text-[#7d8982] mt-0.5">حركات التحصيل والصرف المسجلة على المشروعات</p>
          </div>
          <button
            onClick={() => onNavigateToTab('finance')}
            className="text-xs font-bold text-[#174638] hover:underline"
          >
            سجل الحركات الكامل ←
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#fafbf9] text-[#7d8982] border-b border-[#e6ebe7]">
              <tr>
                <th className="py-3 px-4 font-semibold">التاريخ</th>
                <th className="py-3 px-4 font-semibold">المشروع</th>
                <th className="py-3 px-4 font-semibold">النوع والتصنيف</th>
                <th className="py-3 px-4 font-semibold">البيان</th>
                <th className="py-3 px-4 font-semibold">طريقة الدفع</th>
                <th className="py-3 px-4 font-semibold">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f2]">
              {recentTransactions.map((tx) => {
                const project = projects.find((p) => p.id === tx.projectId);
                const isCollection = tx.type === 'تحصيل';

                return (
                  <tr key={tx.id} className="hover:bg-[#f6f8f6] transition-colors">
                    <td className="py-3 px-4 text-[#7d8982] whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#174638]">
                      {project ? project.name : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isCollection
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {isCollection ? '＋ تحصيل' : '− مصروف'} · {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#536158] max-w-xs truncate" title={tx.desc}>
                      {tx.desc}
                    </td>
                    <td className="py-3 px-4 text-[#7d8982]">{tx.paymentMethod}</td>
                    <td className="py-3 px-4 font-extrabold whitespace-nowrap">
                      <span className={isCollection ? 'text-emerald-700' : 'text-rose-700'}>
                        {isCollection ? '+' : '−'}
                        {formatMoney(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
