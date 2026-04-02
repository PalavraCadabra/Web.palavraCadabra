'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calendar } from 'lucide-react';
import Header from '@/components/header';
import UsageChart from '@/components/usage-chart';
import VocabularyChart from '@/components/vocabulary-chart';
import StatsCard from '@/components/stats-card';
import { api } from '@/lib/api';
import type { AACProfile, Symbol as SymbolType } from '@/lib/types';
import { MessageSquare, TrendingUp, Clock, Users } from 'lucide-react';

type DateRange = '7d' | '30d' | '90d';

// Generate demo analytics data
function generateDailyUsage(days: number) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      count: Math.floor(Math.random() * 80) + 20,
    });
  }
  return data;
}

function generateVocabDistribution() {
  const classes: SymbolType['grammatical_class'][] = [
    'noun',
    'verb',
    'adjective',
    'pronoun',
    'social_phrase',
    'question',
    'misc',
  ];
  return classes.map((c) => ({
    class: c,
    count: Math.floor(Math.random() * 200) + 50,
  }));
}

function generateTopSymbols() {
  const symbols = [
    'Eu',
    'Querer',
    'Comer',
    'Beber',
    'Mais',
    'Sim',
    'Nao',
    'Banheiro',
    'Mamae',
    'Brincar',
  ];
  return symbols.map((name) => ({
    name,
    uses: Math.floor(Math.random() * 150) + 30,
  }));
}

function generateCommRate(days: number) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      count: parseFloat((Math.random() * 4 + 1.5).toFixed(1)),
    });
  }
  return data;
}

export default function AnalyticsPage() {
  const [profiles, setProfiles] = useState<AACProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProfiles()
      .then((p) => setProfiles(p))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;

  const usageData = useMemo(() => generateDailyUsage(days), [days]);
  const vocabData = useMemo(() => generateVocabDistribution(), []);
  const topSymbols = useMemo(() => generateTopSymbols(), []);
  const commRateData = useMemo(() => generateCommRate(days), [days]);

  const totalSymbols = usageData.reduce((s, d) => s + d.count, 0);
  const avgRate =
    commRateData.length > 0
      ? (
          commRateData.reduce((s, d) => s + d.count, 0) / commRateData.length
        ).toFixed(1)
      : '0';

  return (
    <div>
      <Header
        title="Analytics"
        subtitle="Analise de uso e progresso"
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
          >
            <option value="all">Todos os pacientes</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200">
            {[
              { value: '7d' as DateRange, label: '7 dias' },
              { value: '30d' as DateRange, label: '30 dias' },
              { value: '90d' as DateRange, label: '90 dias' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateRange(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  dateRange === opt.value
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats overview */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total de selecoes"
              value={totalSymbols.toLocaleString('pt-BR')}
              icon={MessageSquare}
              subtitle={`Ultimos ${days} dias`}
              color="bg-brand-primary"
            />
            <StatsCard
              title="Taxa media"
              value={`${avgRate}/min`}
              icon={TrendingUp}
              subtitle="Simbolos por minuto"
              color="bg-brand-secondary"
            />
            <StatsCard
              title="Sessoes no periodo"
              value={Math.floor(days * 0.7)}
              icon={Clock}
              subtitle={`De ${days} dias`}
              color="bg-fitz-verb"
            />
            <StatsCard
              title="Pacientes ativos"
              value={profiles.length}
              icon={Users}
              subtitle="Com atividade recente"
              color="bg-fitz-adjective"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UsageChart data={usageData} title="Selecoes diarias de simbolos" />
          <VocabularyChart data={vocabData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top symbols */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Simbolos mais usados
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSymbols} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#F3F4F6"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value) => [`${value} usos`, '']}
                  />
                  <Bar
                    dataKey="uses"
                    fill="#6750A4"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Communication rate */}
          <UsageChart
            data={commRateData}
            title="Taxa comunicativa (simbolos/minuto)"
          />
        </div>
      </div>
    </div>
  );
}
