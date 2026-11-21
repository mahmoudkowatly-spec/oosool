import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Project, Client, ProjectType, ProjectStage } from '../../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  defaultFeeRate: number;
  onSave: (projectData: Partial<Project>, newClientName?: string) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  clients,
  defaultFeeRate,
  onSave,
}) => {
  const today = new Date().toISOString().slice(0, 10);

  const [name, setName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('NEW');
  const [newClientName, setNewClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [type, setType] = useState<ProjectType>('تشطيب للغير');
  const [stage, setStage] = useState<ProjectStage>('التنفيذ');
  const [fee, setFee] = useState<number>(defaultFeeRate || 12);
  const [startDate, setStartDate] = useState(today);
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [manager, setManager] = useState('م. كريم سامي');
  const [error, setError] = useState('');

  const stages: ProjectStage[] = [
    'المعاينة',
    'التصميم',
    'التأسيس',
    'التنفيذ',
    'التشطيبات النهائية',
    'المراجعة والاستلام',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('يرجى إدخال اسم المشروع');
      return;
    }

    let clientName = '';
    let clientId: string | undefined = undefined;

    if (selectedClientId === 'NEW') {
      const trimmedClient = newClientName.trim();
      if (!trimmedClient) {
        setError('يرجى إدخال اسم العميل الجديد');
        return;
      }
      clientName = trimmedClient;
    } else {
      const existingClient = clients.find((c) => c.id === selectedClientId);
      if (!existingClient) {
        setError('يرجى اختيار عميل صالح');
        return;
      }
      clientName = existingClient.name;
      clientId = existingClient.id;
    }

    if (fee < 0 || fee > 100) {
      setError('نسبة رسوم المكتب يجب أن تكون بين 0% و 100%');
      return;
    }

    const newProject: Partial<Project> = {
      name: trimmedName,
      client: clientName,
      clientId,
      type,
      stage,
      progress: stage === 'المعاينة' ? 5 : stage === 'التصميم' ? 15 : stage === 'التأسيس' ? 30 : 50,
      fee: Number(fee),
      startDate: startDate || today,
      expectedEndDate: expectedEndDate || undefined,
      location: location.trim() || undefined,
      area: area ? Number(area) : undefined,
      budget: budget ? Number(budget) : undefined,
      notes: notes.trim() || undefined,
      manager: manager.trim() || undefined,
      status: 'جاري',
    };

    onSave(newProject, selectedClientId === 'NEW' ? newClientName.trim() : undefined);
    onClose();
    // Reset form
    setName('');
    setNewClientName('');
    setClientPhone('');
    setNotes('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إنشاء مشروع تشطيب جديد"
      subtitle="تحديد بيانات المشروع، العميل، ونسبة رسوم المكتب التعاقدية"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">
              اسم المشروع <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: تشطيب شقة كمبوند النخيل - نموذج A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Client Selection */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">
              العميل <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            >
              <option value="NEW">＋ إضافة عميل جديد في السجل</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* New Client Name (if chosen) */}
          {selectedClientId === 'NEW' ? (
            <div>
              <label className="block text-xs font-bold text-[#536158] mb-1">
                اسم العميل الجديد <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="اسم العميل الثلاثي"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[#536158] mb-1">نوع المشروع</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
              >
                <option value="تشطيب للغير">تشطيب للغير (حساب مصروفات + نسبة رسوم)</option>
                <option value="شراء وتجهيز وبيع">شراء وتجهيز وبيع (استثمار مباشر)</option>
              </select>
            </div>
          )}

          {/* Project Type if NEW */}
          {selectedClientId === 'NEW' && (
            <div>
              <label className="block text-xs font-bold text-[#536158] mb-1">نوع المشروع</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
              >
                <option value="تشطيب للغير">تشطيب للغير (حساب مصروفات + نسبة رسوم)</option>
                <option value="شراء وتجهيز وبيع">شراء وتجهيز وبيع (استثمار مباشر)</option>
              </select>
            </div>
          )}

          {/* Office Fee Rate % (Rule #1) */}
          <div>
            <label className="block text-xs font-bold text-[#174638] mb-1">
              نسبة رسوم المكتب المتفق عليها % <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#fcfdfc] border border-[#174638] focus:border-[#174638] rounded-xl text-xs font-bold text-[#174638] focus:ring-1 focus:ring-[#174638] focus:outline-hidden pl-8"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#174638]">
                %
              </span>
            </div>
            <p className="text-[10px] text-[#7d8982] mt-1">
              تُحسب كإيراد للمكتب على كل مصروفات المشروع المسجلة
            </p>
          </div>

          {/* Initial Stage */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">المرحلة الأولية</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as ProjectStage)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            >
              {stages.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">تاريخ بداية التعاقد</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Expected End Date */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">تاريخ التسليم المتوقع</label>
            <input
              type="date"
              value={expectedEndDate}
              onChange={(e) => setExpectedEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">موقع المشروع</label>
            <input
              type="text"
              placeholder="مثال: القاهرة الجديدة - التجمع الخامس"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Area & Budget */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">المساحة (م²)</label>
            <input
              type="number"
              placeholder="200"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">
              الميزانية التقديرية (ج.م)
            </label>
            <input
              type="number"
              placeholder="850000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Responsible Engineer */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">المهندس المسؤول</label>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">ملاحظات ومواصفات العقد</label>
            <textarea
              rows={2}
              placeholder="أي تفاصيل خاصة بتشطيب الوحدة، مواعيد الزيارات أو شروط التعاقد..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
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
            className="px-6 py-2.5 rounded-xl bg-[#174638] hover:bg-[#1e5948] text-white text-xs font-bold shadow-xs transition-colors"
          >
            حفظ وإنشاء المشروع
          </button>
        </div>
      </form>
    </Modal>
  );
};
