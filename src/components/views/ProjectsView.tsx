import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Percent,
  PlusCircle,
  Eye,
  Building,
  Calendar,
  MapPin,
  TrendingUp,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
} from 'lucide-react';
import { Project, Transaction, ProjectStage, ProjectStatus } from '../../types';
import {
  calculateProjectFinancials,
  formatMoney,
  formatDate,
} from '../../services/storage';

interface ProjectsViewProps {
  projects: Project[];
  transactions: Transaction[];
  onOpenNewProject: () => void;
  onSelectProject: (project: Project) => void;
  onEditFee: (project: Project) => void;
  onAddTransactionForProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  transactions,
  onOpenNewProject,
  onSelectProject,
  onEditFee,
  onAddTransactionForProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.name + ' ' + p.client + ' ' + p.code + ' ' + (p.location || ''))
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesStage = stageFilter === 'ALL' || p.stage === stageFilter;

    return matchesSearch && matchesStatus && matchesStage;
  });

  const stages: ProjectStage[] = [
    'المعاينة',
    'التصميم',
    'التأسيس',
    'التنفيذ',
    'التشطيبات النهائية',
    'المراجعة والاستلام',
    'مكتمل',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#174638]">مشروعات أصول</h1>
          <p className="text-xs text-[#7d8982] mt-0.5">
            إدارة المشروعات، نسب الرسوم التعاقدية، وتفاصيل التنفيذ الموقعي ({projects.length}{' '}
            مشروع مسجل)
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>مشروع جديد</span>
        </button>
      </div>

      {/* Filters & Tools Panel */}
      <div className="bg-white rounded-2xl p-4 border border-[#e6ebe7] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7d8982] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث بالاسم، كود المشروع، اسم العميل أو الموقع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-[#fafbf9] border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#fafbf9] border border-[#dde6df] rounded-xl text-xs font-semibold text-[#536158] focus:outline-hidden focus:border-[#174638]"
          >
            <option value="ALL">كل الحالات</option>
            <option value="جاري">جاري التنفيذ</option>
            <option value="مراجعة">قيد المراجعة</option>
            <option value="معلق">معلق مؤقتاً</option>
            <option value="مكتمل">مكتمل وتم التسليم</option>
          </select>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#fafbf9] border border-[#dde6df] rounded-xl text-xs font-semibold text-[#536158] focus:outline-hidden focus:border-[#174638]"
          >
            <option value="ALL">كل المراحل</option>
            {stages.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#f6f8f6] p-1 rounded-xl border border-[#dde6df]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-[#174638] shadow-xs'
                  : 'text-[#7d8982] hover:text-[#174638]'
              }`}
              title="عرض البطاقات"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-[#174638] shadow-xs'
                  : 'text-[#7d8982] hover:text-[#174638]'
              }`}
              title="عرض الجدول"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#e6ebe7] shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#f6f8f6] text-[#7d8982] flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#174638]">لا توجد مشروعات مطابقة للبحث</h3>
          <p className="text-xs text-[#7d8982] mt-1">
            جرب تغيير كلمات البحث أو إعادة ضبط فلاتر الحالة والمراحل
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setStageFilter('ALL');
            }}
            className="mt-4 px-4 py-2 bg-[#e7f0e9] text-[#174638] rounded-xl text-xs font-bold hover:bg-[#d5e7d9] transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const pf = calculateProjectFinancials(p, transactions);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#e6ebe7] shadow-xs hover:border-[#174638] transition-all flex flex-col overflow-hidden group"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-[#f1f4f2]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#7d8982] bg-[#f6f8f6] px-2 py-0.5 rounded-md border border-[#e6ebe7]">
                        {p.code}
                      </span>
                      <h3
                        onClick={() => onSelectProject(p)}
                        className="text-base font-bold text-[#174638] mt-2 group-hover:text-[#1e5948] cursor-pointer hover:underline"
                      >
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#536158] font-medium mt-0.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-[#7d8982]" />
                        <span>{p.client}</span>
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        p.status === 'جاري'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : p.status === 'مراجعة'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  {p.location && (
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-[#7d8982]">
                      <MapPin className="w-3 h-3 text-[#7d8982]" />
                      <span className="truncate">{p.location}</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar & Stage */}
                <div className="px-5 py-3 bg-[#fafbf9] border-b border-[#f1f4f2]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#174638] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#174638]" />
                      المرحلة: {p.stage}
                    </span>
                    <span className="font-bold text-[#174638]">{p.progress}%</span>
                  </div>
                  <div className="w-full bg-[#e6ebe7] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#174638] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                {/* Financial Summary Inside Card */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="bg-[#f6f8f6] p-2.5 rounded-xl border border-[#eef2ee]">
                      <span className="text-[10px] text-[#7d8982] block">صافي السيولة النقدية</span>
                      <span
                        className={`font-black text-xs ${
                          pf.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {pf.netCashFlow >= 0 ? '+' : '−'}
                        {formatMoney(Math.abs(pf.netCashFlow))}
                      </span>
                    </div>

                    <div className="bg-[#f6f8f6] p-2.5 rounded-xl border border-[#eef2ee]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#7d8982]">نسبة الرسوم</span>
                        <span className="text-[10px] font-bold text-[#174638] bg-[#e7f0e9] px-1 rounded">
                          {p.fee}%
                        </span>
                      </div>
                      <span className="font-bold text-xs text-[#174638] block mt-0.5">
                        {formatMoney(pf.officeFeeTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#f1f4f2] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectProject(p)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#e7f0e9] hover:bg-[#d5e7d9] text-[#174638] rounded-xl text-xs font-bold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>تفاصيل المشروع</span>
                    </button>

                    <button
                      onClick={() => onEditFee(p)}
                      className="p-2 border border-[#dde6df] hover:border-[#174638] text-[#536158] hover:text-[#174638] rounded-xl transition-colors"
                      title="تعديل نسبة الرسوم وتاريخ السريان"
                    >
                      <Percent className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onAddTransactionForProject(p.id)}
                      className="p-2 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl transition-colors"
                      title="تسجيل حركة مالية جديدة للمشروع"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-[#e6ebe7] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#fafbf9] text-[#7d8982] border-b border-[#e6ebe7]">
                <tr>
                  <th className="py-3 px-4 font-semibold">الكود والمشروع</th>
                  <th className="py-3 px-4 font-semibold">العميل</th>
                  <th className="py-3 px-4 font-semibold">المرحلة والتقدم</th>
                  <th className="py-3 px-4 font-semibold">الحالة</th>
                  <th className="py-3 px-4 font-semibold">نسبة الرسوم</th>
                  <th className="py-3 px-4 font-semibold">إجمالي المصروفات</th>
                  <th className="py-3 px-4 font-semibold">رسوم المكتب المقدرة</th>
                  <th className="py-3 px-4 font-semibold">صافي السيولة</th>
                  <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f2]">
                {filteredProjects.map((p) => {
                  const pf = calculateProjectFinancials(p, transactions);

                  return (
                    <tr key={p.id} className="hover:bg-[#f6f8f6] transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onSelectProject(p)}
                          className="font-bold text-[#174638] hover:underline text-right block"
                        >
                          {p.name}
                        </button>
                        <span className="text-[10px] text-[#7d8982]">{p.code}</span>
                      </td>

                      <td className="py-3 px-4 font-medium text-[#536158]">{p.client}</td>

                      <td className="py-3 px-4">
                        <span className="text-xs font-semibold text-[#174638]">{p.stage}</span>
                        <div className="w-20 bg-[#e6ebe7] rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-[#174638] h-1.5 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e7f0e9] text-[#174638]">
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-[#174638]">{p.fee}%</td>

                      <td className="py-3 px-4 text-rose-700 font-bold">
                        −{formatMoney(pf.totalExpenses)}
                      </td>

                      <td className="py-3 px-4 text-[#174638] font-bold">
                        {formatMoney(pf.officeFeeTotal)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-black ${
                            pf.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {pf.netCashFlow >= 0 ? '+' : '−'}
                          {formatMoney(Math.abs(pf.netCashFlow))}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectProject(p)}
                            className="p-1.5 rounded-lg text-[#536158] hover:bg-[#e7f0e9] hover:text-[#174638] transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditFee(p)}
                            className="p-1.5 rounded-lg text-[#536158] hover:bg-[#e7f0e9] hover:text-[#174638] transition-colors"
                            title="تعديل النسبة"
                          >
                            <Percent className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onAddTransactionForProject(p.id)}
                            className="p-1.5 rounded-lg text-[#174638] hover:bg-[#e7f0e9] transition-colors"
                            title="تسجيل حركة"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
