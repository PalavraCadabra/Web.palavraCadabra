'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { FITZGERALD_COLORS, GRAMMATICAL_CLASS_LABELS } from '@/lib/types';
import type { Symbol } from '@/lib/types';

interface VocabularyChartProps {
  data: { class: Symbol['grammatical_class']; count: number }[];
  title?: string;
}

export default function VocabularyChart({
  data,
  title = 'Distribuicao do vocabulario',
}: VocabularyChartProps) {
  const chartData = data.map((d) => ({
    name: GRAMMATICAL_CLASS_LABELS[d.class],
    value: d.count,
    color: FITZGERALD_COLORS[d.class],
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
              formatter={(value) => [`${value} usos`, '']}
            />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
