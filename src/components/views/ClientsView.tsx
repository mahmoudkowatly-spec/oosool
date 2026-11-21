import React, { useState } from 'react';
import {
  Users2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  FolderKanban,
  FileSpreadsheet,
  Edit,
  ArrowUpRight,
} from 'lucide-react';
import { Client, Project, Transaction } from '../../types';
import { calculateProjectFinancials, formatMoney, formatDate } from '../../services/storage';

interface ClientsViewProps {
  clients: Client[];
  projects: Project[];
  transactions: Transaction[];
  onOpenNewClient: () => void;
  onEditClient: (client: Client) => void;
  onSelectProject: (project: Project) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  projects,
  transactions,
  onOpenNewClient,
  onEditClient,
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientForStatement, setSelectedClientForStatement] = useState<Client | null>(null);

  const filteredClients = clients.filter((c) =>
    (c.name + ' ' + (c.phone || '') + ' ' + (c.code || '') + ' ' + (c.email || ''))
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#174638]">عملاء أصول</h1>
          <p className="text-xs text-[#7d8982] mt-0.5">
            سجل العملاء، مشروعات كل عميل، وكشوفات التحصيلات والتعاقدات ({clients.length} عميل)
          </p>
        </div>

        <button
          onClick={onOpenNewClient}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#174638] hover:bg-[#1e5948] text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عميل جديد</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 border border-[#e6ebe7] shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7d8982] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث باسم العميل، الهاتف، البريد أو الكود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-[#fafbf9] border border-[#dde6df] focus:border-[#174638] rounded-xl text-xs font-medium focus:ring-1 focus:ring-[#174638] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#e6ebe7] shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#f6f8f6] text-[#7d8982] flex items-center justify-center mx-auto mb-3">
            <Users2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#174638]">لا يوجد عملاء يطابقون البحث</h3>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-1.5 bg-[#e7f0e9] text-[#174638] rounded-lg text-xs font-bold hover:bg-[#d5e7d9]"
          >
            إلغاء البحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => {
            const clientProjects = projects.filter(
              (p) => p.clientId === client.id || p.client === client.name
            );

            // Calculate total collected from this client across their projects
            const totalCollectedFromClient = clientProjects.reduce((acc, p) => {
              const pf = calculateProjectFinancials(p, transactions);
              return acc + pf.totalCollections;
            }, 0);

            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-[#e6ebe7] shadow-xs hover:border-[#174638] transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#7d8982] bg-[#f6f8f6] px-2 py-0.5 rounded border border-[#e6ebe7]">
                        {client.code}
                      </span>
                      <h3 className="text-base font-bold text-[#174638] mt-1.5">{client.name}</h3>
                    </div>

                    <button
                      onClick={() => onEditClient(client)}
                      className="p-1.5 text-[#7d8982] hover:text-[#174638] hover:bg-[#e7f0e9] rounded-lg transition-colors"
                      title="تعديل بيانات العميل"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-[#536158]">
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#7d8982]" />
                        <span dir="ltr">{client.phone}</span>
                      </div>
                    )}
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#7d8982]" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#7d8982]" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="mt-4 p-3 bg-[#fafbf9] border border-[#eef2ee] rounded-xl grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#7d8982] block">عدد المشروعات</span>
                      <span className="font-bold text-[#174638]">
                        {clientProjects.length} مشروع
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#7d8982] block">إجمالي المسدد</span>
                      <span className="font-extrabold text-emerald-700">
                        +{formatMoney(totalCollectedFromClient)}
                      </span>
                    </div>
                  </div>

                  {/* Linked Projects list */}
                  {clientProjects.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[11px] font-bold text-[#7d8982] block mb-1">
                        المشروعات المرتبطة:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {clientProjects.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => onSelectProject(p)}
                            className="text-[11px] font-semibold bg-[#e7f0e9] text-[#174638] px-2.5 py-1 rounded-lg hover:bg-[#d5e7d9] transition-colors"
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#f1f4f2] flex items-center justify-between text-xs">
                  <span className="text-[10px] text-[#7d8982]">
                    مسجل منذ: {formatDate(client.createdAt)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      client.status === 'نشط'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
