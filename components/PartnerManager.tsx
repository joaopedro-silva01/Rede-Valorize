import React, { useState, useEffect } from 'react';
import { Partner, Segment, ContractStatus } from '../types';
import { Edit2, Trash2, Plus, X, Save, Check, Globe, EyeOff } from 'lucide-react';

interface PartnerManagerProps {
  partners: Partner[];
  onAdd: (partner: Partner) => void;
  onUpdate: (partner: Partner) => void;
  onDelete: (id: string) => void;
}

const PartnerManager: React.FC<PartnerManagerProps> = ({ partners, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Partner>>({
    name: '',
    segment: Segment.HEALTH, // Updated default
    location: '',
    monthlyRevenue: 0,
    usageScore: 50,
    status: ContractStatus.ACTIVE,
    isOnWebsite: true,
    benefits: []
  });

  const openModal = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({ ...partner });
    } else {
      setEditingPartner(null);
      setFormData({
        name: '',
        segment: Segment.HEALTH, // Updated default
        location: 'Centro',
        monthlyRevenue: 0,
        usageScore: 50,
        status: ContractStatus.ACTIVE,
        isOnWebsite: true,
        benefits: ['Desconto Padrão']
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-calculate isTop20 logic is handled in App.tsx generally, 
    // but here we ensure basic data integrity
    const partnerData = {
        ...formData,
        isTop20: (formData.usageScore || 0) > 80 // Simple local logic, App.tsx can override
    } as Partner;

    if (editingPartner && editingPartner.id) {
      onUpdate(partnerData);
    } else {
      onAdd({
        ...partnerData,
        id: `new-${Date.now()}`,
        contractStart: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este parceiro?')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with Add Button */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
            <h3 className="text-lg font-bold text-gray-800">Gerenciamento de Parceiros</h3>
            <p className="text-sm text-gray-500">Adicione, edite ou remova parceiros da rede.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Adicionar Novo
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Nome / Local</th>
              <th className="px-6 py-4">Segmento</th>
              <th className="px-6 py-4">Status Contrato</th>
              <th className="px-6 py-4 text-center">No Site?</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners.map((partner) => (
              <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{partner.name}</div>
                  <div className="text-xs text-gray-400">{partner.location}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {partner.segment}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${partner.status === ContractStatus.ACTIVE ? 'bg-emerald-100 text-emerald-800' : 
                      partner.status === ContractStatus.REVIEW ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full 
                        ${partner.status === ContractStatus.ACTIVE ? 'bg-emerald-500' : 
                          partner.status === ContractStatus.REVIEW ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                    {partner.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                   {partner.isOnWebsite ? (
                       <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600" title="Vigente no Site">
                           <Globe size={16} />
                       </span>
                   ) : (
                       <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400" title="Oculto no Site">
                           <EyeOff size={16} />
                       </span>
                   )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900 font-bold w-6">{partner.usageScore}</span>
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${partner.usageScore > 70 ? 'bg-emerald-500' : partner.usageScore > 40 ? 'bg-orange-400' : 'bg-red-400'}`} 
                          style={{ width: `${partner.usageScore}%` }}
                        ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openModal(partner)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(partner.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">
                {editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Parceiro</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Segment & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
                  <select 
                    value={formData.segment}
                    onChange={e => setFormData({...formData, segment: e.target.value as Segment})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {Object.values(Segment).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro / Local</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Status & Website */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Contrato</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ContractStatus})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {Object.values(ContractStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-center">
                    <label className="flex items-center gap-2 cursor-pointer mt-4">
                        <input 
                            type="checkbox"
                            checked={formData.isOnWebsite}
                            onChange={e => setFormData({...formData, isOnWebsite: e.target.checked})}
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Vigente no Site</span>
                    </label>
                </div>
              </div>

              {/* Metrics - Score Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score de Uso (0-100)</label>
                <input 
                  type="number" 
                  min="0" max="100"
                  value={formData.usageScore}
                  onChange={e => setFormData({...formData, usageScore: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                 <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                 >
                    Cancelar
                 </button>
                 <button 
                    type="submit" 
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 flex items-center justify-center gap-2"
                 >
                    <Save size={18} /> Salvar
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerManager;