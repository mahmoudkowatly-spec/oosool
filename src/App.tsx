import React, { useState, useEffect } from 'react';
import {
  Project,
  Client,
  Transaction,
  AuditLog,
  OfficeSettings,
  UserRole,
  ProjectStage,
  ProjectItem,
} from './types';
import {
  loadAppState,
  saveAppState,
  createAuditLog,
  INITIAL_PROJECTS,
  INITIAL_CLIENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
} from './services/storage';

// Layout & Navigation
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer, ToastMessage } from './components/common/Toast';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ProjectsView } from './components/views/ProjectsView';
import { ProjectDetailModal } from './components/views/ProjectDetailModal';
import { ClientsView } from './components/views/ClientsView';
import { FinanceView } from './components/views/FinanceView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

// Interactive In-Page Modals
import { NewProjectModal } from './components/modals/NewProjectModal';
import { NewTransactionModal } from './components/modals/NewTransactionModal';
import { EditFeeModal } from './components/modals/EditFeeModal';
import { NewClientModal } from './components/modals/NewClientModal';
import { NewStageUpdateModal } from './components/modals/NewStageUpdateModal';
import { NewProjectItemModal } from './components/modals/NewProjectItemModal';

export default function App() {
  const [state, setState] = useState(() => loadAppState());
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isNewTxOpen, setIsNewTxOpen] = useState(false);
  const [selectedProjectIdForTx, setSelectedProjectIdForTx] = useState<string | undefined>(undefined);
  const [isNewClientOpen, setIsNewClientOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [projectToEditFee, setProjectToEditFee] = useState<Project | null>(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<Project | null>(null);
  const [projectForStageUpdate, setProjectForStageUpdate] = useState<Project | null>(null);
  const [projectForItemAdd, setProjectForItemAdd] = useState<Project | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Keep selectedProjectDetail updated if state.projects changes
  useEffect(() => {
    if (selectedProjectDetail) {
      const refreshed = state.projects.find((p) => p.id === selectedProjectDetail.id);
      if (refreshed) {
        setSelectedProjectDetail(refreshed);
      }
    }
  }, [state.projects]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role Switcher
  const handleRoleChange = (role: UserRole) => {
    setState((prev) => ({
      ...prev,
      activeRole: role,
    }));
    addToast('info', `تم تبديل الصلاحية النشطة إلى: ${role}`);
  };

  // 1. ADD NEW PROJECT
  const handleSaveProject = (projectData: Partial<Project>, newClientName?: string) => {
    const today = new Date().toISOString().slice(0, 10);
    let updatedClients = [...state.clients];
    let clientId = projectData.clientId;

    // If a new client was entered during project creation, create them
    if (newClientName) {
      const newClient: Client = {
        id: `C-${Date.now().toString().slice(-4)}`,
        code: `CLI-${String(updatedClients.length + 1).padStart(2, '0')}`,
        name: newClientName,
        phone: '',
        status: 'نشط',
        createdAt: today,
      };
      updatedClients = [newClient, ...updatedClients];
      clientId = newClient.id;
    }

    const projectId = `P-${Date.now().toString().slice(-4)}`;
    const feeRate = projectData.fee ?? state.settings.defaultFeeRate;

    const newProject: Project = {
      id: projectId,
      code: `PRJ-${String(state.projects.length + 105)}`,
      name: projectData.name || 'مشروع جديد',
      client: projectData.client || newClientName || 'عميل',
      clientId,
      type: projectData.type || 'تشطيب للغير',
      stage: projectData.stage || 'التنفيذ',
      progress: projectData.progress ?? 20,
      fee: feeRate,
      rateHistory: [
        {
          id: `R-${Date.now().toString().slice(-4)}`,
          rate: feeRate,
          effectiveFrom: projectData.startDate || today,
          reason: 'النسبة التعاقدية عند بداية المشروع',
          createdBy: state.activeRole,
          createdAt: today,
        },
      ],
      status: 'جاري',
      startDate: projectData.startDate || today,
      expectedEndDate: projectData.expectedEndDate,
      location: projectData.location,
      area: projectData.area,
      budget: projectData.budget,
      notes: projectData.notes,
      manager: projectData.manager,
      items: [],
      updates: [],
      createdAt: today,
    };

    const newLog = createAuditLog(
      'إنشاء',
      'مشروع',
      newProject.code,
      `إنشاء مشروع ${newProject.name} للعميل ${newProject.client} بنسبة رسوم ${newProject.fee}%`,
      { name: 'مستخدم النظام', role: state.activeRole }
    );

    setState((prev) => ({
      ...prev,
      clients: updatedClients,
      projects: [newProject, ...prev.projects],
      auditLogs: [...prev.auditLogs, newLog],
    }));

    addToast('success', 'تم إنشاء المشروع بنجاح', `تم إضافة ${newProject.name} إلى مساحة العمل`);
  };

  // 2. ADD NEW TRANSACTION (Collection or Expense)
  const handleSaveTransaction = (txData: Partial<Transaction>) => {
    const today = new Date().toISOString().slice(0, 10);
    const newTx: Transaction = {
      id: `TX-${Date.now().toString().slice(-5)}`,
      projectId: txData.projectId || '',
      type: txData.type || 'مصروف',
      category: txData.category || 'مواد وخامات',
      amount: Number(txData.amount) || 0,
      date: txData.date || today,
      desc: txData.desc || '',
      paymentMethod: txData.paymentMethod || 'نقدي',
      refNumber: txData.refNumber,
      createdBy: state.activeRole,
      createdAt: today,
    };

    const project = state.projects.find((p) => p.id === newTx.projectId);
    const isCol = newTx.type === 'تحصيل';

    const newLog = createAuditLog(
      'تسجيل حركة',
      'حركة مالية',
      newTx.id,
      `تسجيل ${isCol ? 'تحصيل (+)' : 'مصروف (−)'} بمبلغ ${newTx.amount} ج.م على مشروع ${
        project?.name || ''
      }`,
      { name: 'مستخدم النظام', role: state.activeRole }
    );

    setState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
      auditLogs: [...prev.auditLogs, newLog],
    }));

    addToast(
      'success',
      'تم تسجيل الحركة المالية بنجاح',
      `${isCol ? 'تحصيل' : 'مصروف'} بمبلغ ${newTx.amount.toLocaleString('ar-EG')} ج.م`
    );
  };

  // 3. EDIT OFFICE FEE (Rule #1 and #6)
  const handleSaveFee = (
    projectId: string,
    newRate: number,
    effectiveFrom: string,
    reason: string
  ) => {
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) return;

    const oldRate = project.fee;
    const historyEntry = {
      id: `R-${Date.now().toString().slice(-4)}`,
      rate: newRate,
      effectiveFrom,
      reason,
      createdBy: state.activeRole,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    const updatedProjects = state.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          fee: newRate,
          rateHistory: [...(p.rateHistory || []), historyEntry],
        };
      }
      return p;
    });

    const newLog = createAuditLog(
      'تعديل نسبة الرسوم',
      'نسبة الرسوم',
      project.code,
      `تعديل نسبة الرسوم لمشروع ${project.name} من ${oldRate}% إلى ${newRate}% تسري من ${effectiveFrom}`,
      { name: 'مستخدم النظام', role: state.activeRole }
    );

    setState((prev) => ({
      ...prev,
      projects: updatedProjects,
      auditLogs: [...prev.auditLogs, newLog],
    }));

    addToast(
      'success',
      'تم تحديث نسبة رسوم المكتب بنجاح',
      `تسري النسبة الجديدة (${newRate}%) ابتداءً من تاريخ ${effectiveFrom}`
    );
  };

  // 4. ADD / EDIT CLIENT
  const handleSaveClient = (clientData: Partial<Client>) => {
    const today = new Date().toISOString().slice(0, 10);

    if (clientData.id) {
      // Edit existing
      const updatedClients = state.clients.map((c) => {
        if (c.id === clientData.id) {
          return { ...c, ...clientData };
        }
        return c;
      });

      const newLog = createAuditLog(
        'تعديل',
        'عميل',
        clientData.id,
        `تحديث بيانات العميل ${clientData.name}`,
        { name: 'مستخدم النظام', role: state.activeRole }
      );

      setState((prev) => ({
        ...prev,
        clients: updatedClients as Client[],
        auditLogs: [...prev.auditLogs, newLog],
      }));

      addToast('success', 'تم تعديل بيانات العميل بنجاح');
    } else {
      // New Client
      const newClient: Client = {
        id: `C-${Date.now().toString().slice(-4)}`,
        code: `CLI-${String(state.clients.length + 1).padStart(2, '0')}`,
        name: clientData.name || 'عميل جديد',
        phone: clientData.phone || '',
        email: clientData.email,
        address: clientData.address,
        notes: clientData.notes,
        status: clientData.status || 'نشط',
        createdAt: today,
      };

      const newLog = createAuditLog(
        'إنشاء',
        'عميل',
        newClient.code,
        `تسجيل عميل جديد: ${newClient.name}`,
        { name: 'مستخدم النظام', role: state.activeRole }
      );

      setState((prev) => ({
        ...prev,
        clients: [newClient, ...prev.clients],
        auditLogs: [...prev.auditLogs, newLog],
      }));

      addToast('success', 'تمت إضافة العميل بنجاح إلى السجل');
    }
  };

  // 5. ADD SITE UPDATE
  const handleSaveStageUpdate = (
    projectId: string,
    stage: ProjectStage,
    progress: number,
    notes: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const updateEntry = {
      id: `U-${Date.now().toString().slice(-4)}`,
      projectId,
      stage,
      progress,
      notes,
      author: state.activeRole,
      createdAt: today,
    };

    const updatedProjects = state.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          stage,
          progress,
          status: progress === 100 ? ('مكتمل' as const) : p.status,
          updates: [updateEntry, ...(p.updates || [])],
        };
      }
      return p;
    });

    const project = state.projects.find((p) => p.id === projectId);
    const newLog = createAuditLog(
      'تعديل',
      'مرحلة',
      project?.code || projectId,
      `تحديث مرحلة مشروع ${project?.name} إلى "${stage}" بنسبة إنجاز ${progress}%`,
      { name: 'مستخدم النظام', role: state.activeRole }
    );

    setState((prev) => ({
      ...prev,
      projects: updatedProjects,
      auditLogs: [...prev.auditLogs, newLog],
    }));

    addToast('success', 'تم حفظ تحديث الموقع ونسبة الإنجاز بنجاح');
  };

  // 6. ADD BOQ ITEM
  const handleSaveProjectItem = (
    projectId: string,
    itemData: Omit<ProjectItem, 'id' | 'projectId'>
  ) => {
    const newItem: ProjectItem = {
      id: `I-${Date.now().toString().slice(-4)}`,
      projectId,
      ...itemData,
    };

    const updatedProjects = state.projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          items: [...(p.items || []), newItem],
        };
      }
      return p;
    });

    const project = state.projects.find((p) => p.id === projectId);
    const newLog = createAuditLog(
      'إنشاء',
      'بند',
      project?.code || projectId,
      `إضافة بند مقايسة: ${newItem.name} لمشروع ${project?.name}`,
      { name: 'مستخدم النظام', role: state.activeRole }
    );

    setState((prev) => ({
      ...prev,
      projects: updatedProjects,
      auditLogs: [...prev.auditLogs, newLog],
    }));

    addToast('success', 'تمت إضافة بند المقايسة بنجاح');
  };

  // 7. SETTINGS & DATA TOOLS
  const handleUpdateSettings = (newSettings: Partial<OfficeSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
    addToast('success', 'تم حفظ إعدادات وهوية المكتب');
  };

  const handleToggleDemoData = () => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, isDemoData: !prev.settings.isDemoData },
    }));
    addToast(
      'info',
      state.settings.isDemoData ? 'تم التبديل إلى وضع بيانات المكتب الحقيقية' : 'تم تفعيل وضع البيانات التجريبية المعزولة'
    );
  };

  const handleResetData = () => {
    setState({
      projects: INITIAL_PROJECTS,
      clients: INITIAL_CLIENTS,
      transactions: INITIAL_TRANSACTIONS,
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_SETTINGS,
      activeRole: 'مدير المكتب',
    });
    addToast('info', 'تمت استعادة البيانات النموذجية الأولية');
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `aousol_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'تم تصدير النسخة الاحتياطية بنجاح');
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] flex flex-col md:flex-row antialiased">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeRole={state.activeRole}
        onChangeRole={handleRoleChange}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenNewProject={() => setIsNewProjectOpen(true)}
          onOpenNewTransaction={() => {
            setSelectedProjectIdForTx(undefined);
            setIsNewTxOpen(true);
          }}
          isDemoData={state.settings.isDemoData}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'home' && (
            <DashboardView
              projects={state.projects}
              transactions={state.transactions}
              onOpenNewProject={() => setIsNewProjectOpen(true)}
              onOpenNewTransaction={() => {
                setSelectedProjectIdForTx(undefined);
                setIsNewTxOpen(true);
              }}
              onSelectProject={(p) => setSelectedProjectDetail(p)}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={state.projects}
              transactions={state.transactions}
              onOpenNewProject={() => setIsNewProjectOpen(true)}
              onSelectProject={(p) => setSelectedProjectDetail(p)}
              onEditFee={(p) => setProjectToEditFee(p)}
              onAddTransactionForProject={(pId) => {
                setSelectedProjectIdForTx(pId);
                setIsNewTxOpen(true);
              }}
            />
          )}

          {currentTab === 'clients' && (
            <ClientsView
              clients={state.clients}
              projects={state.projects}
              transactions={state.transactions}
              onOpenNewClient={() => {
                setClientToEdit(null);
                setIsNewClientOpen(true);
              }}
              onEditClient={(c) => {
                setClientToEdit(c);
                setIsNewClientOpen(true);
              }}
              onSelectProject={(p) => setSelectedProjectDetail(p)}
            />
          )}

          {currentTab === 'finance' && (
            <FinanceView
              projects={state.projects}
              transactions={state.transactions}
              onOpenNewTransaction={() => {
                setSelectedProjectIdForTx(undefined);
                setIsNewTxOpen(true);
              }}
              onSelectProject={(p) => setSelectedProjectDetail(p)}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              projects={state.projects}
              transactions={state.transactions}
              clients={state.clients}
              onSelectProject={(p) => setSelectedProjectDetail(p)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={state.settings}
              projects={state.projects}
              auditLogs={state.auditLogs}
              onUpdateSettings={handleUpdateSettings}
              onEditFee={(p) => setProjectToEditFee(p)}
              onToggleDemoData={handleToggleDemoData}
              onResetData={handleResetData}
              onExportJSON={handleExportJSON}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        clients={state.clients}
        defaultFeeRate={state.settings.defaultFeeRate}
        onSave={handleSaveProject}
      />

      {/* 2. New Transaction Modal */}
      <NewTransactionModal
        isOpen={isNewTxOpen}
        onClose={() => {
          setIsNewTxOpen(false);
          setSelectedProjectIdForTx(undefined);
        }}
        projects={state.projects}
        defaultProjectId={selectedProjectIdForTx}
        onSave={handleSaveTransaction}
      />

      {/* 3. Edit Fee Modal (Rule #1 and #6) */}
      <EditFeeModal
        isOpen={!!projectToEditFee}
        onClose={() => setProjectToEditFee(null)}
        project={projectToEditFee}
        onSave={handleSaveFee}
      />

      {/* 4. New / Edit Client Modal */}
      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => {
          setIsNewClientOpen(false);
          setClientToEdit(null);
        }}
        onSave={handleSaveClient}
        editClient={clientToEdit}
      />

      {/* 5. Project Detail View Drawer/Modal */}
      <ProjectDetailModal
        isOpen={!!selectedProjectDetail}
        onClose={() => setSelectedProjectDetail(null)}
        project={selectedProjectDetail}
        transactions={state.transactions}
        onEditFee={(p) => setProjectToEditFee(p)}
        onAddTransaction={(pId) => {
          setSelectedProjectIdForTx(pId);
          setIsNewTxOpen(true);
        }}
        onAddStageUpdate={(p) => setProjectForStageUpdate(p)}
        onAddProjectItem={(p) => setProjectForItemAdd(p)}
      />

      {/* 6. Site Stage Update Modal */}
      <NewStageUpdateModal
        isOpen={!!projectForStageUpdate}
        onClose={() => setProjectForStageUpdate(null)}
        project={projectForStageUpdate}
        currentRole={state.activeRole}
        onSave={handleSaveStageUpdate}
      />

      {/* 7. New Project Item BOQ Modal */}
      <NewProjectItemModal
        isOpen={!!projectForItemAdd}
        onClose={() => setProjectForItemAdd(null)}
        project={projectForItemAdd}
        onSave={handleSaveProjectItem}
      />
    </div>
  );
}
