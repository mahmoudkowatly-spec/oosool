import React from 'react';
import { Menu, Plus, PlusCircle, Calendar } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobileSidebar: () => void;
  onOpenNewProject: () => void;
  onOpenNewTransaction: () => void;
  isDemoData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileSidebar,
  onOpenNewProject,
  onOpenNewTransaction,
  isDemoData,
}) => {
  const titles: Record<NavTab, { main: string; sub: string }> = {
    home: { main: 'الرئيسية', sub: 'نظرة شاملة على المشروعات والسيولة والرسوم' },
    projects: { main: 'المشروعات', sub: 'إدارة مشروعات التشطيب والمراحل والتقدم' },
    clients: { main: 'العملاء', sub: 'سجل العملاء، كشوفات الحسابات والتعاقدات' },
    finance: { main: 'الحسابات', sub: 'تسجيل التحصيلات والمصروفات وصافي السيولة' },
    reports: { main: 'التقارير', sub: 'كشوف الحساب والملخصات المالية والتشغيلية' },
    settings: { main: 'الإعدادات', sub: 'نسب الرسوم وهوية المكتب وقاعدة البيانات' },
  };

  const todayArabic = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#e6ebe7] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left / Start: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -mr-2 text-[#536158] hover:text-[#174638] hover:bg-[#e7f0e9] rounded-lg md:hidden transition-colors"
          aria-label="القائمة الجانبية"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#7d8982]">أصول</span>
          <span className="text-[#c3cec6]">/</span>
          <span className="font-bold text-[#174638] text-sm">
            {titles[currentTab]?.main}
          </span>
        </div>

        {isDemoData && (
          <span className="hidden sm:inline-flex items-center text-[11px] bg-[#fdf8ee] text-[#925f17] border border-[#f5dfb8] px-2.5 py-0.5 rounded-full font-medium">
            نسخة أولية · بيانات تجريبية معزولة
          </span>
        )}
      </div>

      {/* Right / End: Actions & Date */}
      <div className="flex items-center gap-2.5">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#7d8982] ml-3 pl-3 border-l border-[#e6ebe7]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{todayArabic}</span>
        </div>

        <button
          onClick={onOpenNewTransaction}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174638] bg-[#e7f0e9] hover:bg-[#d5e7d9] px-3 py-2 rounded-lg border border-[#c4dcce] transition-colors"
          title="تسجيل تحصيل أو مصروف جديد"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden xs:inline">حركة مالية</span>
        </button>

        <button
          onClick={onOpenNewProject}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#174638] hover:bg-[#1e5948] px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          title="إضافة مشروع تشطيب جديد"
        >
          <Plus className="w-4 h-4" />
          <span>مشروع جديد</span>
        </button>
      </div>
    </header>
  );
};
