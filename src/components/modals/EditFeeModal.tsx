import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Project } from '../../types';
import { AlertCircle, History, Check } from 'lucide-react';

interface EditFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (projectId: string, newRate: number, effectiveFrom: string, reason: string) => void;
}

export const EditFeeModal: React.FC<EditFeeModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
}) => {
  const today = new Date().toISOString().slice(0, 10);

  const [rate, setRate] = useState<number>(project?.fee || 12);
  const [effectiveFrom, setEffectiveFrom] = useState<string>(today);
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rate < 0 || rate > 100) {
      setError('نسبة الرسوم يجب أن تكون بين 0% و 100%');
      return;
    }

    if (!effectiveFrom) {
      setError('يرجى تحديد تاريخ سريان النسبة الجديدة');
      return;
    }

    onSave(project.id, Number(rate), effectiveFrom, reason.trim() || 'تعديل النسبة المتفق عليها مع العميل');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تعديل نسبة رسوم المكتب — ${project.name}`}
      subtitle="تطبيق نسبة جديدة مع حفظ تاريخ السريان وحماية الحركات السابقة"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Business Rule Notice */}
        <div className="p-3.5 bg-[#f6f8f6] border border-[#e6ebe7] rounded-xl flex items-start gap-3 text-xs text-[#536158]">
          <AlertCircle className="w-5 h-5 shrink-0 text-[#174638] mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[#174638] block mb-0.5">
              قاعدة سريان النسبة المعتمدة:
            </span>
            تُطبق النسبة الجديدة فقط على المصروفات المسجلة ابتداءً من تاريخ السريان المختار. لن يتم
            إعادة احتساب المصروفات السابقة المسجلة قبل هذا التاريخ لضمان دقة الحسابات الختامية
            للمشروع.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* New Rate */}
          <div>
            <label className="block text-xs font-bold text-[#174638] mb-1">
              نسبة الرسوم الجديدة % <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#174638] focus:border-[#174638] rounded-xl text-sm font-bold text-[#174638] focus:ring-1 focus:ring-[#174638] focus:outline-hidden pl-8"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#174638]">
                %
              </span>
            </div>
            <p className="text-[10px] text-[#7d8982] mt-1">
              النسبة الحالية السارية: <strong className="text-[#174638]">{project.fee}%</strong>
            </p>
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">
              تاريخ السريان <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
            <p className="text-[10px] text-[#7d8982] mt-1">تاريخ بداية تطبيق النسبة الجديدة</p>
          </div>

          {/* Reason / Justification */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">
              سبب التعديل أو رقم ملحق العقد
            </label>
            <textarea
              rows={2}
              placeholder="مثال: ملحق تعاقد لتعديل نطاق الأعمال أو زيادة حزم التشطيب الفاخر..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Previous Rate History Table */}
        <div className="pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#174638] mb-2">
            <History className="w-3.5 h-3.5" />
            <span>سجل نسب الرسوم السابقة لهذا المشروع:</span>
          </div>

          <div className="border border-[#e6ebe7] rounded-xl overflow-hidden bg-white text-xs">
            <table className="w-full text-right">
              <thead className="bg-[#f6f8f6] text-[#7d8982] border-b border-[#e6ebe7]">
                <tr>
                  <th className="py-2 px-3 font-semibold">النسبة</th>
                  <th className="py-2 px-3 font-semibold">تاريخ السريان</th>
                  <th className="py-2 px-3 font-semibold">السبب</th>
                  <th className="py-2 px-3 font-semibold">المستخدم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f2]">
                {(project.rateHistory || []).map((h) => (
                  <tr key={h.id} className="hover:bg-[#fafbf9]">
                    <td className="py-2 px-3 font-bold text-[#174638]">{h.rate}%</td>
                    <td className="py-2 px-3">{h.effectiveFrom || 'بداية التعاقد'}</td>
                    <td className="py-2 px-3 text-[#7d8982]">{h.reason || 'التعاقد الأصلي'}</td>
                    <td className="py-2 px-3 text-[#7d8982]">{h.createdBy || 'النظام'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e6ebe7]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#dde6df] text-xs font-bold text-[#536158] hover:bg-[#f6f8f6] transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#174638] hover:bg-[#1e5948] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>اعتماد وحفظ النسبة الجديدة</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
