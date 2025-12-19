
import React, { useState, useMemo } from 'react';
import { Partner, Segment } from '../types';
import { MapPin, Search, Filter, Home, Users } from 'lucide-react';

interface MapDistributionProps {
  partners: Partner[];
}

const MapDistribution: React.FC<MapDistributionProps> = ({ partners }) => {
  const [selectedSegment, setSelectedSegment] = useState<Segment | 'all'>('all');
  const [searchNeighborhood, setSearchNeighborhood] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  // 1. Filtrar parceiros baseado nos critérios
  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const segmentMatch = selectedSegment === 'all' || p.segment === selectedSegment;
      const searchMatch = p.location.toLowerCase().includes(searchNeighborhood.toLowerCase());
      return segmentMatch && searchMatch;
    });
  }, [partners, selectedSegment, searchNeighborhood]);

  // 2. Agrupar dados por bairro
  const neighborhoodData = useMemo(() => {
    // Ensuring 'counts' is correctly typed to avoid arithmetic errors during processing
    const counts = filteredPartners.reduce((acc: Record<string, number>, curr) => {
      acc[curr.location] = (acc[curr.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Fix: Use Object.keys to ensure count is inferred as number from the Record
    return Object.keys(counts)
      .map((name): { name: string; count: number } => ({ 
        name, 
        count: counts[name] 
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredPartners]);

  // 3. Parceiros do bairro selecionado
  const partnersInSelected = useMemo(() => {
    if (!selectedNeighborhood) return [];
    return filteredPartners.filter(p => p.location === selectedNeighborhood);
  }, [filteredPartners, selectedNeighborhood]);

  const maxCount = Math.max(...neighborhoodData.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Filter size={16} className="text-orange-500" /> Filtrar por Segmento
            </label>
            <select 
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value as Segment | 'all')}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos os Segmentos</option>
              {Object.values(Segment).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Search size={16} className="text-orange-500" /> Buscar Bairro
            </label>
            <input 
              type="text"
              placeholder="Digite o nome do bairro (ex: Santa Mônica, Roosevelt...)"
              value={searchNeighborhood}
              onChange={(e) => setSearchNeighborhood(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mapa / Lista de Densidade */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 shrink-0">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="text-red-500" /> Densidade por Bairro
            </h3>
            <p className="text-sm text-gray-500">Bairros com maior concentração de parceiros Valorize.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {neighborhoodData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Search size={48} className="mb-2 opacity-20" />
                <p>Nenhum bairro encontrado com estes filtros.</p>
              </div>
            ) : (
              neighborhoodData.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSelectedNeighborhood(item.name === selectedNeighborhood ? null : item.name)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group ${
                    selectedNeighborhood === item.name 
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200' 
                      : 'border-gray-100 hover:border-orange-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedNeighborhood === item.name ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600'}`}>
                        <Home size={18} />
                      </div>
                      <div>
                        <span className="block font-bold text-gray-800">{item.name}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Uberlândia - MG</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-gray-900 leading-none">{item.count}</span>
                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Parceiros</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ${selectedNeighborhood === item.name ? 'bg-orange-500' : 'bg-orange-300'}`} 
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detalhes do Bairro */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 shrink-0">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-blue-500" size={20} /> Parceiros na Região
            </h3>
            <p className="text-sm text-gray-500">
              {selectedNeighborhood ? `Listando ${selectedNeighborhood}` : 'Selecione um bairro para detalhar'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {!selectedNeighborhood ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <MapPin size={32} className="opacity-20" />
                </div>
                <p className="text-sm">Toque em um bairro para ver os parceiros ativos naquela área.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {partnersInSelected.map(p => (
                  <div key={p.id} className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight pr-2">{p.name}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${p.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {p.segment}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <span className="text-xs font-bold text-gray-700">Score: {p.usageScore}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedNeighborhood && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total no bairro:</span>
                  <span className="font-bold text-orange-600">{partnersInSelected.length} parceiros</span>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapDistribution;
