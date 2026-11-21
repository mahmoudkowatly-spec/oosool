import React, { useState } from 'react';
import {
  FileBarChart,
  Printer,
  Download,
  Calendar,
  Building,
  Scale,
  ArrowUpRight,
  ArrowDownLeft,
  Coins,
  CheckCircle,
} from 'lucide-react';
import { Project, Transaction, Client } from '../../types';
import {
  calculateProjectFinancials,
  calculateGlobalFinancials,
  formatMoney,
  formatDate,
} from '../../services/storage';

interface ReportsViewProps {
  projects: Project[];
  transactions: Transaction[];
  clients: Client[];
  onSelectProject: (project: Project) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  projects,
  transactions,
  clients,
  onSelectProject,
}) => {
  const [reportType, setReportType] = useState<'projects' | 'clients' | 'financial_summary'>('projects');
  const financials = calculateGlobalFinancials(projects, transactions);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';

    if (reportType === 'projects') {
      csvContent += 'كود المشروع,اسم المشروع,العميل,المرحلة,نسبة الرسوم,التحصيلات,المصروفات,صافي السيولة,رسوم المكتب\n';
      projects.forEach((p) => {
        const pf = calculateProjectFinancials(p, transactions);
        csvContent += `"${p.code}","${p.name}","${p.client}","${p.stage}","${p.fee}%","${pf.totalCollections}","${pf.totalExpenses}","${pf.netCashFlow}","${pf.officeFeeTotal}"\n`;
      });
    } else {
      csvContent += 'التاريخ,المشروع,النوع,التصنيف,البيان,المبلغ,طريقة الدفع\n';
      transactions.forEach((t) => {
        const p = projects.find((x) => x.id === t.projectId);
        csvContent += `"${t.date}","${p ? p.name : ''}","${t.type}","${t.category}","${t.desc}","${t.amount}","${t.paymentMethod}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `تقرير_أصول_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-[#174638]">التقارير وكشوف الحساب</h1>
          <p className="text-xs text-[#7d8982] mt-0.5">
            ملخصات تشغيلية ومالية شاملة جاهزة للطباعة والتصدير
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#dde6df] hover:border-[#174638] text-[#536158] hover:text-[#174638] rounded-xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Tabs / Switcher */}
      <div className="flex items-center gap-2 border-b border-[#e6ebe7] pb-2 no-print text-xs">
        <button
          onClick={() => setReportType('projects')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            reportType === 'projects'
              ? 'bg-[#174638] text-white shadow-xs'
              : 'text-[#536158] hover:bg-[#f6f8f6]'
          }`}
        >
          تقرير المشروعات التفصيلي
        </button>

        <button
          onClick={() => setReportType('clients')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            reportType === 'clients'
              ? 'bg-[#174638] text-white shadow-xs'
              : 'text-[#536158] hover:bg-[#f6f8f6]'
          }`}
        >
          كشف حساب العملاء
        </button>

        <button
          onClick={() => setReportType('financial_summary')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            reportType === 'financial_summary'
              ? 'bg-[#174638] text-white shadow-xs'
              : 'text-[#536158] hover:bg-[#f6f8f6]'
          }`}
        >
          الملخص المالي الشامل
        </button>
      </div>

      {/* Printable Report Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e6ebe7] shadow-xs">
        <div className="flex items-center justify-between border-b border-[#e6ebe7] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#174638] text-white flex items-center justify-center font-bold text-2xl">
              أ
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#174638]">مكتب أصول للهندسة والتشطيبات</h2>
              <p className="text-xs text-[#7d8982]">
                تقرير رسمي مستخرج بتاريخ:{' '}
                {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'full' }).format(new Date())}
              </p>
            </div>
          </div>

          <div className="text-left text-xs text-[#7d8982]">
            <span className="block font-bold text-[#174638]">
              {reportType === 'projects'
                ? 'كشف المشروعات والرسوم'
                : reportType === 'clients'
                ? 'كشف حساب العملاء'
                : 'ملخص السيولة والرسوم'}
            </span>
            <span className="text-[11px]">العملة: ج.م (الجنيه المصري)</span>
          </div>
        </div>

        {/* Global Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 bg-[#fafbf9] border border-[#eef2ee] rounded-xl text-xs">
          <div>
            <span className="text-[#7d8982] block text-[11px]">إجمالي التحصيلات</span>
            <span className="font-black text-emerald-700 text-sm block mt-0.5">
              +{formatMoney(financials.totalCollections)}
            </span>
          </div>
          <div>
            <span className="text-[#7d8982] block text-[11px]">إجمالي المصروفات</span>
            <span className="font-black text-rose-700 text-sm block mt-0.5">
              −{formatMoney(financials.totalExpenses)}
            </span>
          </div>
          <div>
            <span className="text-[#7d8982] block text-[11px]">صافي حركة السيولة</span>
            <span
              className={`font-black text-sm block mt-0.5 ${
                financials.netCashFlow >= 0 ? 'text-[#174638]' : 'text-rose-700'
              }`}
            >
              {financials.netCashFlow >= 0 ? '+' : '−'}
              {formatMoney(Math.abs(financials.netCashFlow))}
            </span>
          </div>
          <div>
            <span className="text-[#174638] block text-[11px] font-bold">إجمالي إيراد رسوم المكتب</span>
            <span className="font-black text-[#174638] text-sm block mt-0.5">
              {formatMoney(financials.totalOfficeFees)}
            </span>
          </div>
        </div>

        {/* REPORT TYPE 1: PROJECTS DETAILED REPORT */}
        {reportType === 'projects' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#f6f8f6] text-[#7d8982] border-b border-[#e6ebe7]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">المشروع</th>
                  <th className="py-2.5 px-3 font-semibold">العميل</th>
                  <th className="py-2.5 px-3 font-semibold">المرحلة</th>
                  <th className="py-2.5 px-3 font-semibold">نسبة الرسوم</th>
                  <th className="py-2.5 px-3 font-semibold">التحصيلات (+)</th>
                  <th className="py-2.5 px-3 font-semibold">المصروفات (−)</th>
                  <th className="py-2.5 px-3 font-semibold">صافي السيولة</th>
                  <th className="py-2.5 px-3 font-semibold">رسوم المكتب (إيراد)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f2]">
                {projects.map((p) => {
                  const pf = calculateProjectFinancials(p, transactions);

                  return (
                    <tr key={p.id} className="hover:bg-[#fafbf9]">
                      <td className="py-3 px-3 font-bold text-[#174638]">
                        <button
                          onClick={() => onSelectProject(p)}
                          className="hover:underline text-right"
                        >
                          {p.name}
                        </button>
                        <span className="block text-[10px] text-[#7d8982] font-normal">
                          {p.code}
                        </span>
                      </td>
                      <td className="py-3 px-3">{p.client}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#e7f0e9] text-[#174638] font-semibold text-[10px]">
                          {p.stage} ({p.progress}%)
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#174638]">{p.fee}%</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">
                        +{formatMoney(pf.totalCollections)}
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-700">
                        −{formatMoney(pf.totalExpenses)}
                      </td>
                      <td className="py-3 px-3 font-black">
                        <span className={pf.netCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                          {pf.netCashFlow >= 0 ? '+' : '−'}
                          {formatMoney(Math.abs(pf.netCashFlow))}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#174638]">
                        {formatMoney(pf.officeFeeTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT TYPE 2: CLIENTS STATEMENT */}
        {reportType === 'clients' && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#f6f8f6] text-[#7d8982] border-b border-[#e6ebe7]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">كود واسم العميل</th>
                  <th className="py-2.5 px-3 font-semibold">الهاتف</th>
                  <th className="py-2.5 px-3 font-semibold">عدد المشروعات</th>
                  <th className="py-2.5 px-3 font-semibold">إجمالي الدفعات المسددة (+)</th>
                  <th className="py-2.5 px-3 font-semibold">مصروفات مواقعه (−)</th>
                  <th className="py-2.5 px-3 font-semibold">صافي السيولة النقدية</th>
                  <th className="py-2.5 px-3 font-semibold">رسوم المكتب المستحقة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f2]">
                {clients.map((c) => {
                  const clientProjects = projects.filter(
                    (p) => p.clientId === c.id || p.client === c.name
                  );

                  let clientCol = 0;
                  let clientExp = 0;
                  let clientFees = 0;

                  clientProjects.forEach((p) => {
                    const pf = calculateProjectFinancials(p, transactions);
                    clientCol += pf.totalCollections;
                    clientExp += pf.totalExpenses;
                    clientFees += pf.officeFeeTotal;
                  });

                  const net = clientCol - clientExp;

                  return (
                    <tr key={c.id} className="hover:bg-[#fafbf9]">
                      <td className="py-3 px-3 font-bold text-[#174638]">
                        {c.name}
                        <span className="block text-[10px] text-[#7d8982] font-normal">{c.code}</span>
                      </td>
                      <td className="py-3 px-3" dir="ltr">
                        {c.phone || '—'}
                      </td>
                      <td className="py-3 px-3 font-semibold">{clientProjects.length} مشروع</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">
                        +{formatMoney(clientCol)}
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-700">−{formatMoney(clientExp)}</td>
                      <td className="py-3 px-3 font-black">
                        <span className={net >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                          {net >= 0 ? '+' : '−'}
                          {formatMoney(Math.abs(net))}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#174638]">
                        {formatMoney(clientFees)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT TYPE 3: FINANCIAL SUMMARY */}
        {reportType === 'financial_summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#fcfdfc] border border-[#e6ebe7] rounded-xl text-xs space-y-3">
                <h4 className="font-bold text-[#174638] border-b border-[#eef2ee] pb-2">
                  تحليل حركة النقد والسيولة
                </h4>
                <div className="flex justify-between py-1">
                  <span className="text-[#536158]">إجمالي مقبوضات وتحصيلات العملاء:</span>
                  <span className="font-bold text-emerald-700">
                    +{formatMoney(financials.totalCollections)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#536158]">إجمالي المصروفات المنفذة بالمواقع:</span>
                  <span className="font-bold text-rose-700">
                    −{formatMoney(financials.totalExpenses)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-[#e6ebe7] font-black text-sm">
                  <span>صافي فائض السيولة النقدية:</span>
                  <span className={financials.netCashFlow >= 0 ? 'text-[#174638]' : 'text-rose-700'}>
                    {financials.netCashFlow >= 0 ? '+' : '−'}
                    {formatMoney(Math.abs(financials.netCashFlow))}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#fcfdfc] border border-[#e6ebe7] rounded-xl text-xs space-y-3">
                <h4 className="font-bold text-[#174638] border-b border-[#eef2ee] pb-2">
                  تحليل إيرادات ورسوم أصول
                </h4>
                <div className="flex justify-between py-1">
                  <span className="text-[#536158]">إجمالي الرسوم المكتسبة من المصروفات:</span>
                  <span className="font-extrabold text-[#174638]">
                    {formatMoney(financials.totalOfficeFees)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#536158]">متوسط نسبة الرسوم الحالية:</span>
                  <span className="font-bold text-[#174638]">
                    {(
                      projects.reduce((acc, p) => acc + p.fee, 0) / (projects.length || 1)
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="p-2.5 bg-[#e7f0e9] rounded-lg text-[11px] text-[#174638] leading-relaxed">
                  تُسجل الرسوم كإيراد خدمات هندسية وتشطيب وليست تدفقاً نقدياً يخصم من حركة النقد.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Signature Block for Printing */}
        <div className="mt-8 pt-6 border-t border-[#e6ebe7] grid grid-cols-3 text-center text-xs text-[#7d8982]">
          <div>
            <span className="block font-semibold">إعداد محاسب الموقع</span>
            <span className="block mt-6 border-b border-dashed border-[#c3cec6] w-32 mx-auto"></span>
          </div>
          <div>
            <span className="block font-semibold">اعتماد مدير المشروعات</span>
            <span className="block mt-6 border-b border-dashed border-[#c3cec6] w-32 mx-auto"></span>
          </div>
          <div>
            <span className="block font-semibold">اعتماد إدارة مكتب أصول</span>
            <span className="block mt-6 border-b border-dashed border-[#c3cec6] w-32 mx-auto"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
