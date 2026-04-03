'use client';

import { useState, useEffect } from 'react';
import {
  FlaskConical,
  TrendingUp,
  Users,
  BookOpen,
  Download,
  Activity,
  Clock,
  BarChart3,
  PieChart,
} from 'lucide-react';
import Header from '@/components/header';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface CommunicationStats {
  period: { from: string | null; to: string | null };
  total_users: number;
  total_sessions: number;
  communication_metrics: {
    avg_symbols_per_session?: number;
    avg_message_length_mlu?: number;
    avg_communication_rate?: number;
    total_events?: number;
  };
  vocabulary_distribution: Record<string, number>;
  usage_patterns: {
    by_hour: Array<{ hour: number; avg_events: number }>;
    by_day_of_week: Array<{ day: number; avg_events: number }>;
  };
  demographic_breakdown: {
    by_communication_level: Record<string, number>;
    by_motor_capability: Record<string, number>;
  };
  literacy_metrics: {
    programs_active?: number;
    avg_stage?: number;
    avg_activity_score?: number;
    stage_distribution?: Record<string, number>;
  };
}

interface VocabularyStats {
  top_symbols: Array<{ label: string; count: number; class: string }>;
  unique_symbols_used: number;
  vocabulary_growth_trend: Array<{ month: string; avg_unique_symbols: number }>;
}

interface LiteracyStats {
  total_programs: number;
  active_programs: number;
  stage_distribution: Record<string, number>;
  avg_score: number;
  total_activities_completed: number;
  avg_time_per_activity_seconds: number;
  completion_rate: number;
}

interface CohortData {
  cohorts: Array<{
    cohort: string;
    profile_count: number;
    total_sessions: number;
    total_events: number;
    avg_events_per_profile: number;
  }>;
}

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const COMM_LEVEL_LABELS: Record<string, string> = {
  pre_symbolic: 'Pre-simbolico',
  symbolic: 'Simbolico',
  emerging_language: 'Ling. emergente',
  contextual_language: 'Ling. contextual',
};
const STAGE_LABELS: Record<string, string> = {
  foundations: 'Fundamentos',
  emerging: 'Emergente',
  developing: 'Desenvolvimento',
  conventional: 'Convencional',
};

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color = 'brand-primary',
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function BarChartSimple({
  data,
  labelKey,
  valueKey,
  labels,
  maxBarWidth = 100,
}: {
  data: Array<Record<string, unknown>>;
  labelKey: string;
  valueKey: string;
  labels?: Record<string, string>;
  maxBarWidth?: number;
}) {
  const maxValue = Math.max(
    ...data.map((d) => Number(d[valueKey]) || 0),
    1
  );

  return (
    <div className="space-y-2">
      {data.map((item, i) => {
        const label = String(item[labelKey]);
        const value = Number(item[valueKey]) || 0;
        const pct = (value / maxValue) * maxBarWidth;
        const displayLabel = labels?.[label] || label;

        return (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-28 text-gray-600 text-right truncate">
              {displayLabel}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
              <div
                className="bg-brand-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-12 text-gray-700 font-medium text-right">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HeatmapRow({
  label,
  values,
  maxValue,
}: {
  label: string;
  values: number[];
  maxValue: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="w-10 text-xs text-gray-500 text-right">{label}</span>
      {values.map((v, i) => {
        const intensity = maxValue > 0 ? v / maxValue : 0;
        const opacity = Math.max(0.05, intensity);
        return (
          <div
            key={i}
            className="w-6 h-6 rounded-sm"
            style={{
              backgroundColor: `rgba(124, 58, 237, ${opacity})`,
            }}
            title={`${v.toFixed(1)} eventos`}
          />
        );
      })}
    </div>
  );
}

export default function ResearchPage() {
  const { user } = useAuth();
  const [commStats, setCommStats] = useState<CommunicationStats | null>(null);
  const [vocabStats, setVocabStats] = useState<VocabularyStats | null>(null);
  const [litStats, setLitStats] = useState<LiteracyStats | null>(null);
  const [cohorts, setCohorts] = useState<CohortData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const isResearcher = user?.role === 'admin';

  useEffect(() => {
    if (!isResearcher) {
      setLoading(false);
      return;
    }

    Promise.all([
      api.getResearchCommunicationStats(),
      api.getResearchVocabularyStats(),
      api.getResearchLiteracyStats(),
      api.getResearchCohorts(),
    ])
      .then(([comm, vocab, lit, coh]) => {
        setCommStats(comm);
        setVocabStats(vocab);
        setLitStats(lit);
        setCohorts(coh);
      })
      .catch(() => {
        // Dados podem não estar disponíveis
      })
      .finally(() => setLoading(false));
  }, [isResearcher]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await api.exportResearchData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `palavracadabra_research_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  if (!isResearcher) {
    return (
      <div>
        <Header title="Pesquisa" />
        <div className="p-6">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              Acesso restrito a administradores e pesquisadores
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Header title="Pesquisa" subtitle="Dados anonimizados para pesquisa" />
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Preparar heatmap: hora (0-23) x dia da semana (0-6)
  const heatmapData: number[][] = Array.from({ length: 7 }, () =>
    Array(24).fill(0)
  );
  let heatmapMax = 1;
  if (commStats?.usage_patterns.by_hour) {
    for (const h of commStats.usage_patterns.by_hour) {
      heatmapMax = Math.max(heatmapMax, h.avg_events);
    }
  }

  // Dados demográficos para gráfico
  const commLevelData = Object.entries(
    commStats?.demographic_breakdown.by_communication_level || {}
  ).map(([key, value]) => ({ level: key, count: value }));

  const motorCapData = Object.entries(
    commStats?.demographic_breakdown.by_motor_capability || {}
  ).map(([key, value]) => ({ capability: key, count: value }));

  // Dados de estágio de letramento
  const stageData = Object.entries(
    litStats?.stage_distribution || {}
  ).map(([key, value]) => ({ stage: key, count: value }));

  return (
    <div>
      <Header
        title="Pesquisa"
        subtitle="Dashboard de dados anonimizados para pesquisa cientifica"
      />

      <div className="p-6 space-y-6">
        {/* Botão de exportação */}
        <div className="flex justify-end">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exportando...' : 'Exportar Dataset Anonimizado'}
          </button>
        </div>

        {/* Cards de métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Usuarios Consentidos"
            value={commStats?.total_users || 0}
            subtitle="Com consentimento para pesquisa"
          />
          <StatCard
            icon={Activity}
            label="Sessoes Totais"
            value={commStats?.total_sessions || 0}
          />
          <StatCard
            icon={TrendingUp}
            label="Simbolos/Sessao"
            value={
              commStats?.communication_metrics.avg_symbols_per_session?.toFixed(
                1
              ) || '0'
            }
            subtitle="Media por sessao"
          />
          <StatCard
            icon={BookOpen}
            label="Programas Ativos"
            value={litStats?.active_programs || 0}
            subtitle="De letramento"
          />
        </div>

        {/* Métricas de Comunicação */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-primary" />
              Metricas de Comunicacao
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">MLU Medio</p>
                <p className="text-lg font-bold text-gray-900">
                  {commStats?.communication_metrics.avg_message_length_mlu?.toFixed(
                    1
                  ) || '0'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Taxa de Comunicacao</p>
                <p className="text-lg font-bold text-gray-900">
                  {commStats?.communication_metrics.avg_communication_rate?.toFixed(
                    1
                  ) || '0'}
                  <span className="text-xs font-normal text-gray-400">
                    {' '}
                    simb/min
                  </span>
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Eventos Totais</p>
                <p className="text-lg font-bold text-gray-900">
                  {commStats?.communication_metrics.total_events?.toLocaleString() ||
                    '0'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Simbolos Unicos</p>
                <p className="text-lg font-bold text-gray-900">
                  {vocabStats?.unique_symbols_used?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Top Vocabulário */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-brand-primary" />
              Top Vocabulario
            </h3>
            {vocabStats?.top_symbols && vocabStats.top_symbols.length > 0 ? (
              <BarChartSimple
                data={vocabStats.top_symbols.slice(0, 8)}
                labelKey="label"
                valueKey="count"
              />
            ) : (
              <p className="text-sm text-gray-400">
                Nenhum dado disponivel
              </p>
            )}
          </div>
        </div>

        {/* Padrões de uso + Demográfico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Padrões de uso por hora */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-primary" />
              Padrao de Uso por Hora
            </h3>
            {commStats?.usage_patterns.by_hour &&
            commStats.usage_patterns.by_hour.length > 0 ? (
              <div className="space-y-1">
                {commStats.usage_patterns.by_hour.map((h) => (
                  <div key={h.hour} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-gray-500 text-right">
                      {String(h.hour).padStart(2, '0')}h
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-brand-primary/70 h-full rounded-full"
                        style={{
                          width: `${(h.avg_events / heatmapMax) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 text-gray-600 text-right">
                      {h.avg_events}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Nenhum dado disponivel
              </p>
            )}
          </div>

          {/* Breakdown demográfico */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-primary" />
              Perfil Demografico
            </h3>

            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Nivel de Comunicacao
            </h4>
            {commLevelData.length > 0 ? (
              <BarChartSimple
                data={commLevelData}
                labelKey="level"
                valueKey="count"
                labels={COMM_LEVEL_LABELS}
              />
            ) : (
              <p className="text-sm text-gray-400 mb-4">Sem dados</p>
            )}

            <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">
              Capacidade Motora
            </h4>
            {motorCapData.length > 0 ? (
              <BarChartSimple
                data={motorCapData}
                labelKey="capability"
                valueKey="count"
              />
            ) : (
              <p className="text-sm text-gray-400">Sem dados</p>
            )}
          </div>
        </div>

        {/* Letramento + Coortes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Letramento */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-primary" />
              Letramento — Visao Geral
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Programas Totais</p>
                <p className="text-lg font-bold text-gray-900">
                  {litStats?.total_programs || 0}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Pontuacao Media</p>
                <p className="text-lg font-bold text-gray-900">
                  {litStats?.avg_score?.toFixed(1) || '0'}%
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Atividades Concluidas</p>
                <p className="text-lg font-bold text-gray-900">
                  {litStats?.total_activities_completed || 0}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Taxa de Conclusao</p>
                <p className="text-lg font-bold text-gray-900">
                  {litStats?.completion_rate?.toFixed(1) || '0'}%
                </p>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Distribuicao por Estagio
            </h4>
            {stageData.length > 0 ? (
              <BarChartSimple
                data={stageData}
                labelKey="stage"
                valueKey="count"
                labels={STAGE_LABELS}
              />
            ) : (
              <p className="text-sm text-gray-400">Sem dados</p>
            )}
          </div>

          {/* Coortes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-brand-primary" />
              Comparacao de Coortes
            </h3>
            {cohorts?.cohorts && cohorts.cohorts.length > 0 ? (
              <div className="space-y-3">
                {cohorts.cohorts.map((c, i) => {
                  const label = c.cohort
                    .replace('communication_', '')
                    .replace('motor_', '');
                  const displayLabel =
                    COMM_LEVEL_LABELS[label] || label.replace(/_/g, ' ');

                  return (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800 capitalize">
                          {displayLabel}
                        </p>
                        <p className="text-xs text-gray-500">
                          {c.profile_count} perfis / {c.total_sessions} sessoes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-brand-primary">
                          {c.avg_events_per_profile}
                        </p>
                        <p className="text-xs text-gray-400">
                          eventos/perfil
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Nenhum dado disponivel para comparacao
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
