import React, { useState } from 'react';
import { Partner, Segment, ContractStatus } from '../types';
import { analyzePartnerStrategy } from '../services/geminiService';
import { Sparkles, MoreHorizontal, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface PartnerListProps {
  partners: Partner[];
}

const PartnerList: React.FC<PartnerListProps> = ({ partners }) => {
  const [filter, setFilter] = useState<'all' | 'top20' | 'bottom80'>('all');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<Record<string, { recommendation: string; strategy: string }>>({});

  const filteredPartners = partners.filter(p => {
    if (filter === 'top20') return p.isTop20;
    if (filter === 'bottom80') return !p.isTop20;
    return true;
  });

  const handleAnalyze = async (partner: Partner) => {
    setAnalyzingId(partner.id);
    const result = await analyzePartnerStrategy(partner);
    setAiInsights(prev => ({
      ...prev,
      [partner.id]: result
    }));
    setAnalyzingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Mapeamento de Parceiros - Uberlândia</h3>
          <p className="text-sm text-gray-500">Gerenciamento de contratos e análise de performance</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'all' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('top20')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'top20' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Top 20%
          </button>
          <button
            onClick={() => setFilter('bottom80')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'bottom80' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Base 80%
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Parceiro</th>
              <th className="px-6 py-4">Segmento</th>
              <th className="px-6 py-4">Performance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPartners.map((partner) => (
              <React.Fragment key={partner.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${partner.isTop20 ? 'bg-emerald-500' : 'bg-gray-400'}`}>
                        {partner.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{partner.name}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={12} /> {partner.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                      {partner.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span>Score: {partner.usageScore}</span>
                        <span className="font-medium">R$ {partner.monthlyRevenue.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${partner.isTop20 ? 'bg-emerald-500' : 'bg-orange-400'}`} 
                          style={{ width: `${partner.usageScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {partner.isTop20 ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs">
                        <CheckCircle size={14} /> Alta Performance
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600 font-medium text-xs">
                        <AlertCircle size={14} /> Avaliar Contrato
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!partner.isTop20 ? (
                      <button 
                        onClick={() => handleAnalyze(partner)}
                        disabled={analyzingId === partner.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                      >
                        {analyzingId === partner.id ? (
                          <>Gerando...</>
                        ) : (
                          <><Sparkles size={14} /> IA Analisar</>
                        )}
                      </button>
                    ) : (
                       <button className="text-gray-400 hover:text-gray-600">
                         <MoreHorizontal size={18} />
                       </button>
                    )}
                  </td>
                </tr>
                {aiInsights[partner.id] && (
                  <tr className="bg-indigo-50/50">
                    <td colSpan={5} className="px-6 py-3">
                      <div className="flex gap-3 text-xs">
                        <div className="flex-shrink-0 mt-0.5 text-indigo-600">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-indigo-900 mb-1">Recomendação: {aiInsights[partner.id].recommendation}</p>
                          <p className="text-indigo-800">{aiInsights[partner.id].strategy}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerList;