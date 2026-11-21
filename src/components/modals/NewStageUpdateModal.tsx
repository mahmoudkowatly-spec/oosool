import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Project, ProjectStage } from '../../types';

interface NewStageUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  currentRole: string;
  onSave: (projectId: string, stage: ProjectStage, progress: number, notes: string) => void;
}

export const NewStageUpdateModal: React.FC<NewStageUpdateModalProps> = ({
  isOpen,
  onClose,
  project,
  currentRole,
  onSave,
}) => {
  const [stage, setStage] = useState<ProjectStage>(project?.stage || 'التنفيذ');
  const [progress, setProgress] = useState<number>(project?.progress || 50);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (project) {
      setStage(project.stage);
      setProgress(project.progress);
    }
  }, [project, isOpen]);

  if (!project) return null;

  const stages: ProjectStage[] = [
    'المعاينة',
    'التصميم',
    'التأسيس',
    'التنفيذ',
    'التشطيبات النهائية',
    'المراجعة والاستلام',
    'مكتمل',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('يرجى كتابة ملاحظة أو تقرير التحديث للموقع');
      return;
    }

    onSave(project.id, stage, progress, notes.trim());
    onClose();
    setNotes('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تحديث موقع ومرحلة — ${project.name}`}
      subtitle="تسجيل نسبة الإنجاز وملاحظات مهندس الموقع"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">المرحلة الحالية</label>
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

          <div>
            <label className="block text-xs font-bold text-[#536158] mb-1">
              نسبة الإنجاز الكلية: <span className="text-[#174638] font-bold">{progress}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-[#174638] mt-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#536158] mb-1">
              تقرير الموقع والملاحظات الفنية <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="مثال: تم إنهاء أعمال سحب أسلاك الكهرباء واختبار خطوط السباكة، وجاري البدء في المحارة..."
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
            حفظ تحديث الموقع
          </button>
        </div>
      </form>
    </Modal>
  );
};
