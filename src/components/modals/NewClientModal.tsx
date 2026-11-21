import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Client } from '../../types';

interface NewClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<Client>) => void;
  editClient?: Client | null;
}

export const NewClientModal: React.FC<NewClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editClient,
}) => {
  const [name, setName] = useState(editClient?.name || '');
  const [phone, setPhone] = useState(editClient?.phone || '');
  const [email, setEmail] = useState(editClient?.email || '');
  const [address, setAddress] = useState(editClient?.address || '');
  const [notes, setNotes] = useState(editClient?.notes || '');
  const [status, setStatus] = useState<Client['status']>(editClient?.status || 'نشط');
  const [error, setError] = useState('');

  // Sync edit client when modal opens
  React.useEffect(() => {
    if (editClient) {
      setName(editClient.name);
      setPhone(editClient.phone);
      setEmail(editClient.email || '');
      setAddress(editClient.address || '');
      setNotes(editClient.notes || '');
      setStatus(editClient.status);
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setNotes('');
      setStatus('نشط');
    }
  }, [editClient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('يرجى إدخال اسم العميل');
      return;
    }

    onSave({
      id: editClient?.id,
      name: trimmedName,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      status,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editClient ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
      subtitle="سجل بيانات العميل للتواصل وربطه بمشروعات التشطيب"
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
              اسم العميل / الجهة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: م. أحمد الشناوي أو شركة آفاق"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">
              رقم الهاتف / الواتساب
            </label>
            <input
              type="tel"
              placeholder="010XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">حالة العميل</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Client['status'])}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            >
              <option value="نشط">نشط (مشروع قائم)</option>
              <option value="مكتمل">مكتمل (تم التسليم والمخالصة)</option>
              <option value="محتمل">محتمل (قيد المعاينة والتسعير)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">العنوان أو المقر</label>
            <input
              type="text"
              placeholder="مثال: التجمع الخامس، القاهرة الجديدة"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">ملاحظات إضافية</label>
            <textarea
              rows={2}
              placeholder="تفضيلات العميل في التشطيب، متطلبات خاصة، مواعيد التواصل..."
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
            {editClient ? 'حفظ التعديلات' : 'إضافة العميل'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
