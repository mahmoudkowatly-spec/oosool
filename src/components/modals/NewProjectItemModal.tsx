import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Project, ProjectItem } from '../../types';

interface NewProjectItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (projectId: string, item: Omit<ProjectItem, 'id' | 'projectId'>) => void;
}

export const NewProjectItemModal: React.FC<NewProjectItemModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProjectItem['category']>('كهرباء');
  const [unit, setUnit] = useState('م2');
  const [quantity, setQuantity] = useState<number>(1);
  const [clientPrice, setClientPrice] = useState<number>(0);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال اسم البند');
      return;
    }

    onSave(project.id, {
      name: name.trim(),
      category,
      unit: unit.trim() || 'مقطوعية',
      quantity: Number(quantity) || 1,
      clientPrice: Number(clientPrice) || 0,
      estimatedCost: Number(estimatedCost) || 0,
      notes: notes.trim() || undefined,
    });

    onClose();
    setName('');
    setNotes('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`إضافة بند مقايسة جديد — ${project.name}`}
      subtitle="إدراج مواصفات البند وسعر العميل والتكلفة التقديرية"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">
              اسم وتوصيف البند <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: توريد وتركيب قواطع سيكوريت عازل للصوت سمك 10مم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">تصنيف البند</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectItem['category'])}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            >
              <option value="كهرباء">كهرباء وشبكات</option>
              <option value="سباكة">سباكة وصرف وعزل</option>
              <option value="محارة ودهانات">محارة ودهانات وديكورات</option>
              <option value="أرضيات وسيراميك">أرضيات ورخام وسيراميك</option>
              <option value="جبس بورد">جبس بورد وأسقف معلقة</option>
              <option value="نجارة وأبواب">نجارة وأبواب وتجاليد</option>
              <option value="ألوميتال">ألوميتال وزجاج سيكوريت</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">الوحدة</label>
            <input
              type="text"
              placeholder="م2 / م.ط / مقطوعية / عدد"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">الكمية</label>
            <input
              type="number"
              step="0.01"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#174638] mb-1">سعر العميل (ج.م)</label>
            <input
              type="number"
              value={clientPrice}
              onChange={(e) => setClientPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-bold text-[#174638] focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">
              التكلفة التقديرية (ج.م)
            </label>
            <input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">ملاحظات ومواصفة التنفيذ</label>
            <textarea
              rows={2}
              placeholder="شروط الاستلام أو ماركة الخامات المعتمدة..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>
        </div>

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
            className="px-6 py-2.5 rounded-xl bg-[#174638] hover:bg-[#1e5948] text-white text-xs font-bold shadow-xs transition-colors"
          >
            إضافة البند للمشروع
          </button>
        </div>
      </form>
    </Modal>
  );
};
