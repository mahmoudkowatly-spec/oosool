import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
  Plus,
  Coins,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Receipt,
  Download,
} from 'lucide-react';
import { Project, Transaction, TransactionType } from '../../types';
import {
  calculateGlobalFinancials,
  calculateTransactionFee,
  getFeeRateAtDate,
  formatMoney,
  formatDate,
} from '../../services/storage';

interface FinanceViewProps {
  projects: Project[];
  transactions: Transaction[];
  onOpenNewTransaction: () => void;
  onSelectProject: (project: Project) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  projects,
  transactions,
  onOpenNewTransaction,
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredTransactions = transactions
    .filter((tx) => {
      const project = projects.find((p) => p.id === tx.projectId);
      const matchesSearch =
        (tx.desc + ' ' + (tx.refNumber || '') + ' ' + (project ? project.name : ''))
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesProject = projectFilter === 'ALL' || tx.projectId === projectFilter;
      const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
      const matchesCategory = categoryFilter === 'ALL' || tx.category === categoryFilter;

      return matchesSearch && matchesProject && matchesType && matchesCategory;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Compute metrics for the currently filtered view
  let filteredCollections = 0;
  let filteredExpenses = 0;
  let filteredOfficeFees = 0;

  for (const tx of filteredTransactions) {
    const project = projects.find((p) => p.id === tx.projectId);
    if (tx.type === 'تحصيل') {
      filteredCollections += tx.amount;
    } else {
      filteredExpenses += tx.amount;
      if (project) {
        filteredOfficeFees += calculateTransactionFee(project, tx);
      }
    }
  }

  const filteredNetCash = filteredCollections - filteredExpenses;

  // Categories list
  const categories = [
    'مواد وخامات',
    'مصنعيات وعمالة',
    'نقل وتشوين',
    'مقاولين باطن',
    'إداريات ورسوم تصاريح',
    'دفعة تعاقد',
    'دفعة مرحلية',
    'دفعة تشطيبات',
    'أخرى',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#174638]">دفتر الحسابات والسيولة</h1>
          <p className="text-xs text-[#7d8982] mt-0.5">
            تسجيل حركات التحصيل والمصروفات النقدية ومتابعة رسوم المكتب المستقلة
          </p>
        </div>

        <button
          onClick={onOpenNewTransaction}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل حركة مالية</span>
        </button>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Collections */}
        <div className="bg-white rounded-2xl p-5 border border-[#e6ebe7] shadow-xs">
          <div className="flex items-center justify-between text-[#7d8982]">
            <span className="text-xs font-semibold">التحصيلات المستلمة (+)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-700 block mt-3">
            +{formatMoney(filteredCollections)}
          </span>
          <span className="text-[11px] text-[#7d8982] block mt-1">حركات نقدية موجبة</span>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-2xl p-5 border border-[#e6ebe7] shadow-xs">
          <div className="flex items-center justify-between text-[#7d8982]">
            <span className="text-xs font-semibold">المصروفات النقدية (−)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-rose-700 block mt-3">
            −{formatMoney(filteredExpenses)}
          </span>
          <span className="text-[11px] text-[#7d8982] block mt-1">مدفوعات الموقع الفعلية</span>
        </div>

        {/* Net Cash Flow */}
        <div className="bg-white rounded-2xl p-5 border border-[#e6ebe7] shadow-xs">
          <div className="flex items-center justify-between text-[#7d8982]">
            <span className="text-xs font-semibold">صافي حركة السيولة</span>
            <div className="w-8 h-8 rounded-lg bg-[#f6f8f6] text-[#174638] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <span
            className={`text-2xl font-black block mt-3 ${
              filteredNetCash >= 0 ? 'text-[#174638]' : 'text-rose-700'
            }`}
          >
            {filteredNetCash >= 0 ? '+' : '−'}
            {formatMoney(Math.abs(filteredNetCash))}
          </span>
          <span className="text-[11px] text-[#7d8982] block mt-1">
            التحصيلات ناقص المصروفات
          </span>
        </div>

        {/* Office Fee Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-[#c4dcce] bg-[#fafdfa] shadow-xs">
          <div className="flex items-center justify-between text-[#174638]">
            <span className="text-xs font-bold">رسوم المكتب المقدرة</span>
            <div className="w-8 h-8 rounded-lg bg-[#e7f0e9] text-[#174638] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#174638] block mt-3">
            {formatMoney(filteredOfficeFees)}
          </span>
          <span className="text-[11px] text-[#536158] block mt-1">
            إيراد مستقل (لا يخصم من النقد)
          </span>
        </div>
      </div>

      {/* Rules Notice Callout */}
      <div className="bg-[#f6f8f6] border border-[#e6ebe7] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#536158]">
        <AlertCircle className="w-5 h-5 text-[#174638] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#174638] block mb-0.5">القواعد المحاسبية المعتمدة للسيولة:</strong>
          كل دفعة مستلمة من العميل تزيد من رصيد السيولة كحركة موجبة، وكل مصروف تشغيلي يقلل رصيد
          السيولة كحركة سالبة. رسوم المكتب تُحسب تلقائياً كنسبة من المصروف وفق النسبة السارية في
          تاريخه، وتُسجل كإيراد مستحق للمكتب ولا تدخل ضمن أساس حساب النسبة أو خصم السيولة.
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#e6ebe7] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7d8982] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث بالبيان، المرجع أو اسم المشروع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-[#fafbf9] border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#fafbf9] border border-[#dde6df] rounded-xl text-xs font-semibold text-[#536158] focus:outline-hidden focus:border-[#174638]"
          >
            <option value="ALL">كل المشروعات</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#fafbf9] border border-[#dde6df] rounded-xl text-xs font-semibold text-[#536158] focus:outline-hidden focus:border-[#174638]"
          >
            <option value="ALL">كل الأنواع</option>
            <option value="تحصيل">تحصيلات فقط (+)</option>
            <option value="مصروف">مصروفات فقط (−)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#fafbf9] border border-[#dde6df] rounded-xl text-xs font-semibold text-[#536158] focus:outline-hidden focus:border-[#174638]"
          >
            <option value="ALL">كل التصنيفات</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#e6ebe7] shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#7d8982]">
            <Receipt className="w-8 h-8 text-[#9aa89f] mx-auto mb-2" />
            <p className="font-bold text-[#174638]">لا توجد حركات مالية مطابقة للبحث أو الفلتر</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setProjectFilter('ALL');
                setTypeFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="mt-3 px-3 py-1.5 bg-[#e7f0e9] text-[#174638] rounded-lg text-xs font-bold hover:bg-[#d5e7d9]"
            >
              إلغاء الفلاتر
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#fafbf9] text-[#7d8982] border-b border-[#e6ebe7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">التاريخ</th>
                  <th className="py-3 px-4 font-semibold">المشروع</th>
                  <th className="py-3 px-4 font-semibold">النوع والتصنيف</th>
                  <th className="py-3 px-4 font-semibold">البيان والشرح</th>
                  <th className="py-3 px-4 font-semibold">طريقة الدفع والمرجع</th>
                  <th className="py-3 px-4 font-semibold">المبلغ النقدي</th>
                  <th className="py-3 px-4 font-semibold">رسوم المكتب المطبقة</th>
                  <th className="py-3 px-4 font-semibold">المستخدم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f2]">
                {filteredTransactions.map((tx) => {
                  const project = projects.find((p) => p.id === tx.projectId);
                  const isCollection = tx.type === 'تحصيل';
                  const fee = project ? calculateTransactionFee(project, tx) : 0;
                  const appliedRate = project ? getFeeRateAtDate(project, tx.date) : 12;

                  return (
                    <tr key={tx.id} className="hover:bg-[#f6f8f6] transition-colors">
                      <td className="py-3.5 px-4 text-[#7d8982] whitespace-nowrap">
                        {tx.date}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#174638] whitespace-nowrap">
                        {project ? (
                          <button
                            onClick={() => onSelectProject(project)}
                            className="hover:underline text-right"
                          >
                            {project.name}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
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

                      <td className="py-3.5 px-4 text-[#536158] max-w-sm" title={tx.desc}>
                        <div className="font-medium text-[#25352e]">{tx.desc}</div>
                        {tx.refNumber && (
                          <span className="text-[10px] text-[#7d8982] block mt-0.5">
                            مرجع: {tx.refNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#7d8982] whitespace-nowrap">
                        {tx.paymentMethod}
                      </td>

                      <td className="py-3.5 px-4 font-black whitespace-nowrap text-sm">
                        <span className={isCollection ? 'text-emerald-700' : 'text-rose-700'}>
                          {isCollection ? '+' : '−'}
                          {formatMoney(tx.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {!isCollection ? (
                          <div>
                            <span className="font-bold text-[#174638]">
                              {formatMoney(fee)}
                            </span>
                            <span className="block text-[10px] text-[#7d8982]">
                              ({appliedRate}% سارية في {tx.date})
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#c3cec6] text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[#7d8982] whitespace-nowrap text-[11px]">
                        {tx.createdBy}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
