import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users2,
  Wallet,
  FileBarChart,
  Settings,
  ShieldCheck,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';

export type NavTab = 'home' | 'projects' | 'clients' | 'finance' | 'reports' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  onChangeRole,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'projects', label: 'المشروعات', icon: FolderKanban },
    { id: 'clients', label: 'العملاء', icon: Users2 },
    { id: 'finance', label: 'الحسابات', icon: Wallet },
    { id: 'reports', label: 'التقارير', icon: FileBarChart },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ] as const;

  const roles: UserRole[] = [
    'مدير المكتب',
    'مدير مشروع',
    'محاسب',
    'مهندس/مشرف',
    'قارئ',
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-[#10271d]/60 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-[#e6ebe7] flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#e6ebe7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#174638] text-white flex items-center justify-center font-bold text-xl shadow-xs">
              أ
            </div>
            <div>
              <div className="font-bold text-base text-[#174638] leading-tight flex items-center gap-1.5">
                أصول
                <span className="text-[10px] bg-[#e7f0e9] text-[#174638] font-semibold px-1.5 py-0.5 rounded">
                  النسخة الأولى
                </span>
              </div>
              <p className="text-[11px] text-[#7d8982] mt-0.5 font-medium">للهندسة والتشطيبات</p>
            </div>
          </div>
        </div>

        {/* Workspace Label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[11px] font-bold text-[#9aa89f] tracking-wider uppercase">
            مساحة العمل
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#e7f0e9] text-[#174638] shadow-xs'
                    : 'text-[#536158] hover:bg-[#f6f8f6] hover:text-[#174638]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-[#174638] scale-110' : 'text-[#7d8982]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Role Card & Switcher */}
        <div className="p-4 border-t border-[#e6ebe7] bg-[#fafbf9]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#174638]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#174638]" />
              <span>الصلاحية النشطة:</span>
            </div>
            <span className="text-[10px] bg-white border border-[#e6ebe7] text-[#7d8982] px-1.5 py-0.5 rounded">
              تجربة الأدوار
            </span>
          </div>

          <div className="relative">
            <select
              value={activeRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="w-full appearance-none bg-white border border-[#dde6df] hover:border-[#174638] rounded-lg px-3 py-2 text-xs font-semibold text-[#25352e] focus:outline-hidden focus:ring-1 focus:ring-[#174638] cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d8982] pointer-events-none" />
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#eef2ee] flex items-center justify-between text-[11px] text-[#7d8982]">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#174638]" />
              مكتب أصول للهندسة
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="متصل محلياً" />
          </div>
        </div>
      </aside>
    </>
  );
};
