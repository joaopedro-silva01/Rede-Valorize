
import React from 'react';
import { Partner, ContractStatus } from '../types';

interface ActivePartnersChartProps {
  data: Partner[];
}

const ActivePartnersChart: React.FC<ActivePartnersChartProps> = ({ data }) => {
  // 1. Processar dados
  const groupedData = data.reduce((acc: Record<string, any>, curr) => {
    const segment = curr.segment;
    if (!acc[segment]) {
      acc[segment] = { name: segment, active: 0, review: 0, risk: 0, total: 0 };
    }
    
    if (curr.status === ContractStatus.ACTIVE) acc[segment].active++;
    else if (curr.status === ContractStatus.REVIEW) acc[segment].review++;
    else if (curr.status === ContractStatus.RISK) acc[segment].risk++;
    
    acc[segment].total++;
    return acc;
  }, {});

  const chartData = Object.values(groupedData).sort((a: any, b: any) => b.total - a.total);
  // Encontrar o maior total para usar como base de 100% da largura da barra visual
  const maxTotal = Math.max(...chartData.map((d: any) => d.total), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[450px] flex flex-col overflow-hidden">
      {/* Título (Fixo) */}
      <div className="p-6 pb-4 shrink-0 bg-white z-20">
           <h3 className="text-lg font-bold text-gray-800">Status dos Contratos</h3>
           <p className="text-sm text-gray-500">Detalhamento de volume e risco por segmento.</p>
      </div>

      {/* Container de Rolagem Único (Contém Cabeçalho Sticky + Dados) */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
         
         {/* Cabeçalho Sticky - Fica preso ao topo ao rolar, mas respeita a largura da barra de rolagem */}
         <div className="sticky top-0 z-10 grid grid-cols-12 bg-gray-50 border-y border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider shadow-sm">
            <div className="col-span-4 pl-6 py-3 border-r border-gray-200 flex items-center">Segmento</div>
            <div className="col-span-3 py-3 text-center border-r border-gray-200 flex items-center justify-center">Volume</div>
            
            {/* Colunas Numéricas no Cabeçalho */}
            <div className="col-span-5 grid grid-cols-3">
                 <div className="py-3 text-center text-emerald-700 bg-emerald-50/50 border-r border-gray-200 flex items-center justify-center">
                    Ativo
                 </div>
                 <div className="py-3 text-center text-amber-700 bg-amber-50/50 border-r border-gray-200 flex items-center justify-center">
                    Análise
                 </div>
                 <div className="py-3 text-center text-red-700 bg-red-50/50 flex items-center justify-center">
                    Risco
                 </div>
            </div>
         </div>

         {/* Linhas de Dados */}
         {chartData.map((item: any, index: number) => (
             <div key={item.name} className={`grid grid-cols-12 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                 
                 {/* Nome do Segmento */}
                 <div className="col-span-4 pl-6 py-3 flex items-center font-medium text-gray-700 truncate border-r border-gray-100" title={item.name}>
                     {item.name}
                 </div>
                 
                 {/* Barra Visual */}
                 <div className="col-span-3 py-3 px-2 flex items-center justify-center border-r border-gray-100">
                    <div className="w-full max-w-[120px] h-2 bg-gray-100 rounded-full overflow-hidden flex relative">
                       {/* Container da barra com largura relativa ao MAIOR segmento */}
                       <div style={{ width: `${(item.total / maxTotal) * 100}%` }} className="h-full flex min-w-[2px]">
                           {item.active > 0 && (
                             <div style={{ width: `${(item.active / item.total) * 100}%` }} className="h-full bg-emerald-500" />
                           )}
                           {item.review > 0 && (
                             <div style={{ width: `${(item.review / item.total) * 100}%` }} className="h-full bg-amber-400" />
                           )}
                           {item.risk > 0 && (
                             <div style={{ width: `${(item.risk / item.total) * 100}%` }} className="h-full bg-red-500" />
                           )}
                       </div>
                    </div>
                 </div>

                 {/* Colunas Numéricas - Divisórias Alinhadas */}
                 <div className="col-span-5 grid grid-cols-3">
                     <div className={`py-3 flex items-center justify-center font-medium border-r border-gray-100 ${item.active > 0 ? "text-gray-700" : "text-gray-300"}`}>
                       {item.active}
                     </div>
                     <div className={`py-3 flex items-center justify-center font-medium border-r border-gray-100 ${item.review > 0 ? "text-amber-600" : "text-gray-300"}`}>
                       {item.review}
                     </div>
                     <div className="py-3 flex items-center justify-center font-medium">
                       {item.risk > 0 ? (
                         <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">{item.risk}</span>
                       ) : (
                         <span className="text-gray-300">0</span>
                       )}
                     </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};

export default ActivePartnersChart;
