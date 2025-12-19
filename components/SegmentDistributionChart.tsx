import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Partner } from '../types';

interface SegmentDistributionChartProps {
  data: Partner[];
}

const SegmentDistributionChart: React.FC<SegmentDistributionChartProps> = ({ data }) => {
  // 1. Agrupar dados por Segmento e contar a quantidade
  const groupedData = data.reduce((acc: Record<string, number>, curr) => {
    const segment = curr.segment;
    if (!acc[segment]) {
      acc[segment] = 0;
    }
    acc[segment] += 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Transformar em array e ordenar decrescente
  const chartData = Object.entries(groupedData)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Mostrar os top 8 para manter o visual limpo

  // Escala de cores baseada em Orange-600 a Orange-300
  const colors = ['#ea580c', '#f97316', '#fb923c', '#fdba74'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <div className="mb-4 shrink-0">
        <h3 className="text-lg font-bold text-gray-800">Parceiros por Segmento</h3>
        <p className="text-sm text-gray-500">Volumetria total por categoria de atuação.</p>
      </div>
      
      <div className="flex-1 w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{fontSize: 11, fill: '#4b5563', fontWeight: 500}} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{fill: '#fff7ed'}}
              formatter={(value: number) => [`${value} Parceiros`, 'Quantidade']}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
              <LabelList 
                dataKey="value" 
                position="right" 
                fill="#ea580c" 
                fontSize={12} 
                fontWeight="700"
                offset={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SegmentDistributionChart;