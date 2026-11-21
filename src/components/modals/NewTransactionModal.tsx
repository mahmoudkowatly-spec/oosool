import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  Project,
  Transaction,
  TransactionType,
  ExpenseCategory,
  CollectionCategory,
  PaymentMethod,
} from '../../types';
import { getFeeRateAtDate, formatMoney } from '../../services/storage';
import { ArrowDownLeft, ArrowUpRight, Calculator } from 'lucide-react';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  defaultProjectId?: string;
  onSave: (txData: Partial<Transaction>) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProjectId,
  onSave,
}) => {
  const today = new Date().toISOString().slice(0, 10);

  const [projectId, setProjectId] = useState<string>(
    defaultProjectId || (projects.length > 0 ? projects[0].id : '')
  );
  const [type, setType] = useState<TransactionType>('مصروف');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('مواد وخامات');
  const [collectionCategory, setCollectionCategory] = useState<CollectionCategory>('دفعة تعاقد');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(today);
  const [desc, setDesc] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('نقدي');
  const [refNumber, setRefNumber] = useState<string>('');
  const [error, setError] = useState<string>('');

  const selectedProject = projects.find((p) => p.id === projectId);
  const effectiveFeeRate = selectedProject ? getFeeRateAtDate(selectedProject, date || today) : 12;

  const numAmount = Number(amount) || 0;
  const estimatedFeeForThisTx = type === 'مصروف' ? (numAmount * effectiveFeeRate) / 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!projectId) {
      setError('يرجى اختيار المشروع');
      return;
    }

    if (!(numAmount > 0)) {
      setError('يرجى إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    const trimmedDesc = desc.trim();
    if (!trimmedDesc) {
      setError('يرجى إدخال بيان الحركة (شرح تفصيلي)');
      return;
    }

    onSave({
      projectId,
      type,
      category: type === 'مصروف' ? expenseCategory : collectionCategory,
      amount: numAmount,
      date: date || today,
      desc: trimmedDesc,
      paymentMethod,
      refNumber: refNumber.trim() || undefined,
    });

    onClose();
    // Reset form fields
    setAmount('');
    setDesc('');
    setRefNumber('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تسجيل حركة مالية جديدة"
      subtitle="تسجيل تحصيل من عميل أو مصروف نقدي على المشروع"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Transaction Type Tabs */}
        <div>
          <label className="block text-xs font-bold text-[#536158] mb-2">نوع الحركة المالية</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setType('مصروف');
                setPaymentMethod('نقدي');
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                type === 'مصروف'
                  ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                  : 'bg-white border-[#dde6df] text-[#7d8982] hover:bg-[#f6f8f6]'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-rose-600" />
              <span>مصروف نقدي مدفوع (− سالب)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('تحصيل');
                setPaymentMethod('تحويل بنكي');
              }}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                type === 'تحصيل'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : 'bg-white border-[#dde6df] text-[#7d8982] hover:bg-[#f6f8f6]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span>تحصيل من العميل (+ موجب)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Selection */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">
              المشروع المرتبط <span className="text-red-500">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — العميل: {p.client} ({p.code})
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-[#174638] mb-1">
              المبلغ النقدى (ج.م) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#174638] focus:border-[#174638] rounded-xl text-sm font-bold text-[#174638] focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">
              تاريخ الحركة <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">تصنيف الحركة</label>
            {type === 'مصروف' ? (
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
              >
                <option value="مواد وخامات">مواد وخامات (سباكة، كهرباء، دهانات، أسمنت...)</option>
                <option value="مصنعيات وعمالة">مصنعيات وعمالة وفنيين</option>
                <option value="نقل وتشوين">نقل وتشوين ورافعات</option>
                <option value="مقاولين باطن">مقاولين باطن (تكييف، سيكوريت، رخام...)</option>
                <option value="إداريات ورسوم تصاريح">إداريات ورسوم وتصاريح جهاز/حي</option>
                <option value="أخرى">أخرى</option>
              </select>
            ) : (
              <select
                value={collectionCategory}
                onChange={(e) => setCollectionCategory(e.target.value as CollectionCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
              >
                <option value="دفعة تعاقد">دفعة تعاقد أولية</option>
                <option value="دفعة مرحلية">دفعة مرحلية (تأسيس / تشطيب)</option>
                <option value="دفعة تشطيبات">دفعة خامات وسيراميك</option>
                <option value="دفعة استلام نهائي">دفعة مخالصة وتسليم نهائي</option>
                <option value="أخرى">أخرى</option>
              </select>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">طريقة الدفع</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            >
              <option value="نقدي">نقدي (كاش خزينة الموقع)</option>
              <option value="تحويل بنكي">تحويل بنكي (حساب الشركة)</option>
              <option value="إنستاباي">إنستاباي (InstaPay)</option>
              <option value="شيك">شيك مصرفي</option>
            </select>
          </div>

          {/* Reference Number */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">
              رقم المرجع / الإيصال / الفاتورة
            </label>
            <input
              type="text"
              placeholder="مثال: فاتورة رقم INV-5542 أو مرجع بنكي TRX-981"
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">
              بيان الحركة (شرح تفصيلي) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              placeholder="مثال: توريد 15 شيكارة معجون وبويات دهانات شقة النخيل..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Business Rule Calculation Callout */}
        {type === 'مصروف' && numAmount > 0 && selectedProject && (
          <div className="p-3.5 bg-[#e7f0e9] border border-[#c4dcce] rounded-xl flex items-start gap-3 text-xs text-[#174638]">
            <Calculator className="w-5 h-5 shrink-0 text-[#174638] mt-0.5" />
            <div>
              <p className="font-bold leading-normal">
                رسوم المكتب المقدرة لهذه الحركة:{' '}
                <span className="text-sm underline font-extrabold">
                  {formatMoney(estimatedFeeForThisTx)}
                </span>{' '}
                (بنسبة {effectiveFeeRate}% السارية في {date})
              </p>
              <p className="text-[11px] text-[#536158] mt-1 leading-relaxed">
                قاعدة معتمدة: تُعرض الرسوم كإيراد مستقل للمكتب ولا تخصم من صافي حركة النقد (التحصيلات − المصروفات).
              </p>
            </div>
          </div>
        )}

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
            تسجيل الحركة المالية
          </button>
        </div>
      </form>
    </Modal>
  );
};
