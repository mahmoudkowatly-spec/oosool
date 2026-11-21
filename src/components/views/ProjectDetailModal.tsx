import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  Project,
  Transaction,
  ProjectStage,
  ProjectItem,
  ProjectStageUpdate,
} from '../../types';
import {
  calculateProjectFinancials,
  calculateTransactionFee,
  getFeeRateAtDate,
  formatMoney,
  formatDate,
} from '../../services/storage';
import {
  FolderKanban,
  Building,
  Calendar,
  MapPin,
  Scale,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  History,
  Percent,
  Plus,
  Layers,
  FileText,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  transactions: Transaction[];
  onEditFee: (project: Project) => void;
  onAddTransaction: (projectId: string) => void;
  onAddStageUpdate: (project: Project) => void;
  onAddProjectItem: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  transactions,
  onEditFee,
  onAddTransaction,
  onAddStageUpdate,
  onAddProjectItem,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'stages' | 'finance' | 'fee'>(
    'overview'
  );

  if (!project) return null;

  const projectTx = transactions
    .filter((t) => t.projectId === project.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const financials = calculateProjectFinancials(project, transactions);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${project.name} (${project.code})`}
      subtitle={`العميل: ${project.client} · نوع المشروع: ${project.type}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-[#e6ebe7] pb-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#174638] text-white shadow-xs'
                : 'text-[#536158] hover:bg-[#f6f8f6]'
            }`}
          >
            ملخص المشروع
          </button>

          <button
            onClick={() => setActiveTab('finance')}
            className={`px-3 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'finance'
                ? 'bg-[#174638] text-white shadow-xs'
                : 'text-[#536158] hover:bg-[#f6f8f6]'
            }`}
          >
            الحركات المالية ({projectTx.length})
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`px-3 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'items'
                ? 'bg-[#174638] text-white shadow-xs'
                : 'text-[#536158] hover:bg-[#f6f8f6]'
            }`}
          >
            بنود المقايسة ({project.items?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('stages')}
            className={`px-3 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'stages'
                ? 'bg-[#174638] text-white shadow-xs'
                : 'text-[#536158] hover:bg-[#f6f8f6]'
            }`}
          >
            مراحل وتحديثات الموقع ({project.updates?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('fee')}
            className={`px-3 py-2 rounded-lg font-bold transition-colors ${
              activeTab === 'fee'
                ? 'bg-[#174638] text-white shadow-xs'
                : 'text-[#536158] hover:bg-[#f6f8f6]'
            }`}
          >
            نسبة الرسوم وسجل التغييرات
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* 4 Financial Metric Cards for this Project */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#fafbf9] border border-[#e6ebe7] rounded-xl">
                <span className="text-[11px] text-[#7d8982] block">التحصيلات المستلمة</span>
                <span className="text-base font-extrabold text-emerald-700 block mt-1">
                  +{formatMoney(financials.totalCollections)}
                </span>
                <span className="text-[10px] text-[#7d8982]">حركات موجبة</span>
              </div>

              <div className="p-3.5 bg-[#fafbf9] border border-[#e6ebe7] rounded-xl">
                <span className="text-[11px] text-[#7d8982] block">المصروفات النقدية</span>
                <span className="text-base font-extrabold text-rose-700 block mt-1">
                  −{formatMoney(financials.totalExpenses)}
                </span>
                <span className="text-[10px] text-[#7d8982]">مدفوعات الموقع</span>
              </div>

              <div className="p-3.5 bg-[#fafbf9] border border-[#e6ebe7] rounded-xl">
                <span className="text-[11px] text-[#7d8982] block">صافي حركة النقد</span>
                <span
                  className={`text-base font-extrabold block mt-1 ${
                    financials.netCashFlow >= 0 ? 'text-[#174638]' : 'text-rose-700'
                  }`}
                >
                  {financials.netCashFlow >= 0 ? '+' : '−'}
                  {formatMoney(Math.abs(financials.netCashFlow))}
                </span>
                <span className="text-[10px] text-[#7d8982]">التحصيل ناقص الصرف</span>
              </div>

              <div className="p-3.5 bg-[#e7f0e9] border border-[#c4dcce] rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#174638] font-bold">رسوم المكتب</span>
                  <span className="text-[10px] bg-[#174638] text-white px-1.5 py-0.2 rounded font-bold">
                    {project.fee}%
                  </span>
                </div>
                <span className="text-base font-extrabold text-[#174638] block mt-1">
                  {formatMoney(financials.officeFeeTotal)}
                </span>
                <span className="text-[10px] text-[#536158]">إيراد منفصل للمكتب</span>
              </div>
            </div>

            {/* Project Progress Bar */}
            <div className="p-4 bg-white border border-[#e6ebe7] rounded-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#174638]">
                  المرحلة الحالية: {project.stage} (نسبة الإنجاز الكلية)
                </span>
                <span className="font-extrabold text-[#174638]">{project.progress}%</span>
              </div>
              <div className="w-full bg-[#e6ebe7] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#174638] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Specifications & Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white border border-[#e6ebe7] rounded-xl space-y-2.5">
                <h4 className="font-bold text-[#174638] border-b border-[#f1f4f2] pb-1.5">
                  بيانات العقد والموقع
                </h4>
                <div className="flex justify-between">
                  <span className="text-[#7d8982]">اسم العميل:</span>
                  <span className="font-semibold">{project.client}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8982]">الموقع:</span>
                  <span className="font-semibold">{project.location || 'غير محدد'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8982]">المساحة:</span>
                  <span className="font-semibold">{project.area ? `${project.area} م²` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8982]">الميزانية التقديرية:</span>
                  <span className="font-semibold">
                    {project.budget ? formatMoney(project.budget) : '—'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white border border-[#e6ebe7] rounded-xl space-y-2.5">
                <h4 className="font-bold text-[#174638] border-b border-[#f1f4f2] pb-1.5">
                  المسؤولية والجدول الزمني
                </h4>
                <div className="flex justify-between">
                  <span className="text-[#7d8982]">المهندس المسؤول:</span>
                  <span className="font-semibold">{project.manager || 'مكتب أصول'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8982]">تاريخ بداية التعاقد:</span>
                  <span className="font-semibold">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8982]">تاريخ التسليم المتوقع:</span>
                  <span className="font-semibold">
                    {project.expectedEndDate ? formatDate(project.expectedEndDate) : 'قيد التحديد'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7d8982]">حالة المشروع:</span>
                  <span className="font-bold text-[#174638]">{project.status}</span>
                </div>
              </div>
            </div>

            {project.notes && (
              <div className="p-3.5 bg-[#f6f8f6] border border-[#e6ebe7] rounded-xl text-xs">
                <span className="font-bold text-[#174638] block mb-1">ملاحظات العقد:</span>
                <p className="text-[#536158] leading-relaxed">{project.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FINANCIAL TRANSACTIONS */}
        {activeTab === 'finance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#174638]">
                سجل حركات المشروع ({projectTx.length} حركة)
              </span>
              <button
                onClick={() => onAddTransaction(project.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>تسجيل حركة جديدة</span>
              </button>
            </div>

            {projectTx.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#7d8982] bg-[#fafbf9] rounded-xl border border-dashed border-[#dde6df]">
                لم يتم تسجيل حركات مالية بعد لهذا المشروع.
              </div>
            ) : (
              <div className="border border-[#e6ebe7] rounded-xl overflow-hidden bg-white text-xs">
                <table className="w-full text-right">
                  <thead className="bg-[#f6f8f6] text-[#7d8982] border-b border-[#e6ebe7]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">التاريخ</th>
                      <th className="py-2.5 px-3 font-semibold">النوع والتصنيف</th>
                      <th className="py-2.5 px-3 font-semibold">البيان</th>
                      <th className="py-2.5 px-3 font-semibold">طريقة الدفع</th>
                      <th className="py-2.5 px-3 font-semibold">المبلغ النقدي</th>
                      <th className="py-2.5 px-3 font-semibold">رسوم المكتب المطبقة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f4f2]">
                    {projectTx.map((t) => {
                      const isCol = t.type === 'تحصيل';
                      const txFee = calculateTransactionFee(project, t);
                      const appliedRate = getFeeRateAtDate(project, t.date);

                      return (
                        <tr key={t.id} className="hover:bg-[#fafbf9]">
                          <td className="py-2.5 px-3 text-[#7d8982] whitespace-nowrap">
                            {t.date}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isCol
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}
                            >
                              {isCol ? '＋ تحصيل' : '− مصروف'} · {t.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#536158]">{t.desc}</td>
                          <td className="py-2.5 px-3 text-[#7d8982]">{t.paymentMethod}</td>
                          <td className="py-2.5 px-3 font-black whitespace-nowrap">
                            <span className={isCol ? 'text-emerald-700' : 'text-rose-700'}>
                              {isCol ? '+' : '−'}
                              {formatMoney(t.amount)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {!isCol ? (
                              <span className="font-bold text-[#174638]">
                                {formatMoney(txFee)}{' '}
                                <span className="text-[10px] text-[#7d8982]">({appliedRate}%)</span>
                              </span>
                            ) : (
                              <span className="text-[#c3cec6]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOQ ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#174638]">
                مقايسة وبنود التشطيب المعتمدة ({project.items?.length || 0} بند)
              </span>
              <button
                onClick={() => onAddProjectItem(project)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة بند للمقايسة</span>
              </button>
            </div>

            {(!project.items || project.items.length === 0) ? (
              <div className="p-8 text-center text-xs text-[#7d8982] bg-[#fafbf9] rounded-xl border border-dashed border-[#dde6df]">
                لم يتم إدراج بنود مقايسة بعد لهذا المشروع.
              </div>
            ) : (
              <div className="border border-[#e6ebe7] rounded-xl overflow-hidden bg-white text-xs">
                <table className="w-full text-right">
                  <thead className="bg-[#f6f8f6] text-[#7d8982] border-b border-[#e6ebe7]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">البند</th>
                      <th className="py-2.5 px-3 font-semibold">التصنيف</th>
                      <th className="py-2.5 px-3 font-semibold">الكمية</th>
                      <th className="py-2.5 px-3 font-semibold">سعر العميل</th>
                      <th className="py-2.5 px-3 font-semibold">التكلفة التقديرية</th>
                      <th className="py-2.5 px-3 font-semibold">إجمالي القيمة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f4f2]">
                    {project.items.map((item) => (
                      <tr key={item.id} className="hover:bg-[#fafbf9]">
                        <td className="py-2.5 px-3 font-bold text-[#174638]">{item.name}</td>
                        <td className="py-2.5 px-3 text-[#7d8982]">{item.category}</td>
                        <td className="py-2.5 px-3">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 font-semibold">{formatMoney(item.clientPrice)}</td>
                        <td className="py-2.5 px-3 text-[#7d8982]">
                          {formatMoney(item.estimatedCost)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#174638]">
                          {formatMoney(item.quantity * item.clientPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STAGES & SITE UPDATES */}
        {activeTab === 'stages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#174638]">
                سجل تحديثات الموقع والمراحل
              </span>
              <button
                onClick={() => onAddStageUpdate(project)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-lg text-xs font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>تحديث مرحلة جديدة</span>
              </button>
            </div>

            {(!project.updates || project.updates.length === 0) ? (
              <div className="p-8 text-center text-xs text-[#7d8982] bg-[#fafbf9] rounded-xl border border-dashed border-[#dde6df]">
                لا توجد تقارير موقعية بعد لهذا المشروع.
              </div>
            ) : (
              <div className="space-y-3">
                {project.updates.map((up) => (
                  <div
                    key={up.id}
                    className="p-4 bg-[#fafbf9] border border-[#e6ebe7] rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#174638] bg-[#e7f0e9] px-2 py-0.5 rounded">
                          المرحلة: {up.stage}
                        </span>
                        <span className="font-bold text-[#174638]">{up.progress}% إنجاز</span>
                      </div>
                      <span className="text-[11px] text-[#7d8982]">{formatDate(up.createdAt)}</span>
                    </div>
                    <p className="text-[#536158] leading-relaxed pt-1">{up.notes}</p>
                    <div className="flex items-center gap-1 text-[10px] text-[#7d8982] pt-1">
                      <UserCheck className="w-3 h-3 text-[#174638]" />
                      <span>المسؤول: {up.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FEE RATE & HISTORY */}
        {activeTab === 'fee' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#e7f0e9] border border-[#c4dcce] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#174638] block">
                  النسبة الحالية السارية: {project.fee}%
                </span>
                <span className="text-[11px] text-[#536158]">
                  تُحسب على كافة المصروفات المسجلة من تاريخ سريانها كإيراد للمكتب.
                </span>
              </div>
              <button
                onClick={() => onEditFee(project)}
                className="px-4 py-2 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl text-xs font-bold transition-colors"
              >
                تعديل النسبة
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#174638] mb-2 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>سجل نسب الرسوم وتاريخ سريانها (Audit Trail)</span>
              </h4>

              <div className="border border-[#e6ebe7] rounded-xl overflow-hidden bg-white text-xs">
                <table className="w-full text-right">
                  <thead className="bg-[#f6f8f6] text-[#7d8982] border-b border-[#e6ebe7]">
                    <tr>
                      <th className="py-2 px-3 font-semibold">نسبة الرسوم</th>
                      <th className="py-2 px-3 font-semibold">تاريخ السريان</th>
                      <th className="py-2 px-3 font-semibold">سبب التعديل</th>
                      <th className="py-2 px-3 font-semibold">المستخدم المسؤول</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f4f2]">
                    {(project.rateHistory || []).map((h) => (
                      <tr key={h.id}>
                        <td className="py-2.5 px-3 font-bold text-[#174638]">{h.rate}%</td>
                        <td className="py-2.5 px-3">{h.effectiveFrom || 'بداية العقد'}</td>
                        <td className="py-2.5 px-3 text-[#536158]">{h.reason || 'التعاقد الأصلي'}</td>
                        <td className="py-2.5 px-3 text-[#7d8982]">{h.createdBy || 'النظام'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#e6ebe7]">
          <span className="text-[11px] text-[#7d8982]">
            تاريخ التسجيل: {formatDate(project.createdAt)}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#f6f8f6] hover:bg-[#eef2ee] text-xs font-bold text-[#536158] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </Modal>
  );
};
