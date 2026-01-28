
import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { AssessmentResult } from '../types';

interface ResultChartProps {
  results: AssessmentResult[];
  isExporting?: boolean;
}

export const ResultChart: React.FC<ResultChartProps> = ({ results, isExporting = false }) => {
  const data = results.map(r => ({
    subject: r.domain,
    A: r.score,
    fullMark: 5,
  }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center">
        <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-400">Jaring Kompetensi Utama</h3>
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 5]} 
              tick={false} 
              axisLine={false} 
            />
            <Radar
              name="Skor"
              dataKey="A"
              stroke="#2563eb"
              strokeWidth={3}
              fill="#3b82f6"
              fillOpacity={0.6} // Lebih solid sesuai gambar
              isAnimationActive={!isExporting}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
        <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-slate-400">Distribusi Performa</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
            <XAxis type="number" domain={[0, 5]} hide />
            <YAxis 
              dataKey="subject" 
              type="category" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
              width={140}
              axisLine={false}
              tickLine={false}
            />
            {!isExporting && (
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
              />
            )}
            <Bar dataKey="A" radius={[0, 8, 8, 0]} barSize={32} isAnimationActive={!isExporting}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 pt-6 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Entry (1)</span>
            <span>Professional (3)</span>
            <span>Expert (5)</span>
        </div>
      </div>
    </div>
  );
};
