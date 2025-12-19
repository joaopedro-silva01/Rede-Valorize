import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Partner } from '../types';

interface ParetoChartProps {
  data: Partner[];
}

const ParetoChart: React.FC<ParetoChartProps> = ({ data }) => {
  // 1. Agrupar dados por Segmento e somar a Receita (Valor)
  const groupedData = data.reduce((acc: Record<string, number>, curr) => {
    const segment = curr.segment;
    if (!acc[segment]) {
      acc[segment] = 0;
    }
    acc[segment] += curr.monthlyRevenue;
    return acc;
  }, {} as Record<string, number>);

  // 2. Transformar em array e ordenar decrescente
  const sortedData = Object.entries(groupedData)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value);

  // 3. Calcular Pareto (Quais segmentos compõem os primeiros 80% do valor)
  const totalValue = sortedData.reduce((sum, item) => sum + item.value, 0);
  let accumulatedValue = 0;
  
  const chartData = sortedData.map(item => {
    accumulatedValue += item.value;
    // Se o valor acumulado ATÉ este item for menor ou igual a ~80% (ou se for o primeiro que passa um pouco), é vital.
    // Ajuste fino: Marcamos como verde os segmentos que constroem a base principal do faturamento.
    const isVital = (accumulatedValue - item.value) / totalValue < 0.75; 
    
    return {
      ...item,
      isVital
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 relative">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Distribuição de Valor por Segmento</h3>
        <p className="text-sm text-gray-500">Segmentos que geram a maior parte da receita da rede (Pareto).</p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{fontSize: 10, fill: '#6b7280'}} 
            interval={0}
            angle={-20}
            textAnchor="end"
            height={40}
          />
          <YAxis 
            tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
            tick={{fontSize: 11, fill: '#9ca3af'}}
          />
          <Tooltip 
            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita Gerada']}
            labelFormatter={(label) => `Segmento: ${label}`}
            cursor={{fill: 'transparent'}}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isVital ? '#10b981' : '#f97316'} // Emerald para Alta Performance, Orange para Complementar
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legenda posicionada dentro da área do gráfico (Absolute Positioning) */}
      <div className="absolute top-20 right-8 bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-2 text-xs z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-700 font-medium">Segmentos Principais (Curva A)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span className="text-gray-700 font-medium">Segmentos Complementares</span>
        </div>
      </div>
    </div>
  );
};

export default ParetoChart;