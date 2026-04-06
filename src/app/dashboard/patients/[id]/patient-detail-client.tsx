'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Grid3X3,
  TrendingUp,
  Clock,
  Edit3,
  Save,
  X,
  BookOpen,
  Plus,
  Award,
  CheckCircle2,
} from 'lucide-react';
import Header from '@/components/header';
import BoardPreview from '@/components/board-preview';
import UsageChart from '@/components/usage-chart';
import VocabularyChart from '@/components/vocabulary-chart';
import LiteracyProgress from '@/components/literacy-progress';
import { api } from '@/lib/api';
import type {
  AACProfile,
  Board,
  UsageLog,
  Symbol as SymbolType,
  LiteracyProgram,
  LiteracyProgress as LiteracyProgressType,
} from '@/lib/types';
import {
  COMMUNICATION_LEVEL_LABELS,
  MOTOR_CAPABILITY_LABELS,
  VISUAL_CAPABILITY_LABELS,
  stageLabels,
  stageColors,
} from '@/lib/types';

type Tab = 'perfil' | 'pranchas' | 'progresso' | 'sessoes';

// Demo data generators
function generateUsageData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      count: Math.floor(Math.random() * 50) + 10,
    });
  }
  return data;
}

function generateVocabData() {
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
    count: Math.floor(Math.random() * 100) + 20,
  }));
}

export default function PatientDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // Extract ID from URL pathname directly — useParams() may return
  // 'placeholder' when served from the static placeholder page.
  const id = (() => {
    const paramId = params.id;
    if (paramId && paramId !== 'placeholder') return paramId;
    // Fallback: read from browser URL
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      // /dashboard/patients/{id} → parts = ['dashboard', 'patients', '{id}']
      const idx = parts.indexOf('patients');
      if (idx >= 0 && idx + 1 < parts.length) {
        return parts[idx + 1];
      }
    }
    return paramId;
  })();
  const [profile, setProfile] = useState<AACProfile | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [literacyPrograms, setLiteracyPrograms] = useState<LiteracyProgram[]>([]);
  const [literacyProgress, setLiteracyProgress] = useState<Record<string, LiteracyProgressType>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AACProfile>>({});
  const [creatingProgram, setCreatingProgram] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getProfile(id).catch(() => null),
      api.getBoards({ profile_id: id }).catch(() => []),
      api.getUsageLogs({ profile_id: id, limit: 50 }).catch(() => []),
      api.getLiteracyPrograms(id).catch(() => []),
    ])
      .then(async ([p, b, l, lp]) => {
        setProfile(p);
        setBoards(b);
        setLogs(l);
        setLiteracyPrograms(lp);
        if (p) setEditForm(p);

        // Carregar progresso de cada programa de letramento
        const progressEntries = await Promise.all(
          lp.map(async (prog) => {
            try {
              const progress = await api.getLiteracyProgress(prog.id);
              return [prog.id, progress] as const;
            } catch {
              return null;
            }
          })
        );
        const map: Record<string, LiteracyProgressType> = {};
        for (const entry of progressEntries) {
          if (entry) map[entry[0]] = entry[1];
        }
        setLiteracyProgress(map);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCreateLiteracyProgram() {
    if (!profile) return;
    setCreatingProgram(true);
    try {
      const created = await api.createLiteracyProgram({
        profile_id: profile.id,
        name: `Programa de Letramento - ${profile.name}`,
      });
      setLiteracyPrograms((prev) => [...prev, created]);
    } catch {
      // erro silencioso
    } finally {
      setCreatingProgram(false);
    }
  }

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      const updated = await api.updateProfile(profile.id, editForm);
      setProfile(updated);
      setEditing(false);
    } catch {
      // silently fail for demo
    }
  };

  const tabs: { key: Tab; label: string; icon: typeof User }[] = [
    { key: 'perfil', label: 'Perfil', icon: User },
    { key: 'pranchas', label: 'Pranchas', icon: Grid3X3 },
    { key: 'progresso', label: 'Progresso', icon: TrendingUp },
    { key: 'sessoes', label: 'Sessoes', icon: Clock },
  ];

  if (loading) {
    return (
      <div>
        <Header title="Carregando..." />
        <div className="p-6 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <Header title="Paciente nao encontrado" />
        <div className="p-6 text-center">
          <p className="text-gray-500">Este perfil nao foi encontrado.</p>
          <button
            onClick={() => router.push('/dashboard/patients')}
            className="mt-4 text-brand-primary hover:underline text-sm"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const usageData = generateUsageData();
  const vocabData = generateVocabData();

  return (
    <div>
      <Header title={profile.name} subtitle="Detalhes do paciente" />

      <div className="p-6 space-y-6">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/patients')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para pacientes
        </button>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-brand-primary text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === 'perfil' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Informacoes do Perfil
              </h2>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditForm(profile);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-brand-primary hover:bg-brand-primary-dark rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-brand-primary hover:bg-brand-surface rounded-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  Editar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nome
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Nivel de comunicacao
                </label>
                {editing ? (
                  <select
                    value={editForm.communication_level || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        communication_level: e.target
                          .value as AACProfile['communication_level'],
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    {Object.entries(COMMUNICATION_LEVEL_LABELS).map(
                      ([k, v]) => (
                        <option key={k} value={k}>
                          {v}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {COMMUNICATION_LEVEL_LABELS[profile.communication_level]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Capacidade motora
                </label>
                {editing ? (
                  <select
                    value={editForm.motor_capability || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        motor_capability: e.target
                          .value as AACProfile['motor_capability'],
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    {Object.entries(MOTOR_CAPABILITY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {MOTOR_CAPABILITY_LABELS[profile.motor_capability]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Capacidade visual
                </label>
                {editing ? (
                  <select
                    value={editForm.visual_capability || ''}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        visual_capability: e.target
                          .value as AACProfile['visual_capability'],
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                  >
                    {Object.entries(VISUAL_CAPABILITY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {VISUAL_CAPABILITY_LABELS[profile.visual_capability]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Voz preferida
                </label>
                <p className="text-gray-900">
                  {profile.preferred_voice || 'Padrao'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Tamanho de grade preferido
                </label>
                <p className="text-gray-900">
                  {profile.grid_size_preference || 'Nao definido'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pranchas' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Pranchas do paciente
              </h2>
              <Link
                href="/dashboard/boards"
                className="text-sm text-brand-primary hover:underline"
              >
                Criar nova prancha
              </Link>
            </div>
            {boards.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                <Grid3X3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Nenhuma prancha atribuida a este paciente
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {boards.map((board) => (
                  <BoardPreview key={board.id} board={board} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'progresso' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsageChart data={usageData} title="Selecoes diarias de simbolos" />
              <VocabularyChart data={vocabData} />
            </div>

            {/* Secao de Letramento */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Letramento</h2>
                    <p className="text-sm text-gray-500">Programas de alfabetizacao</p>
                  </div>
                </div>
                {literacyPrograms.length === 0 && (
                  <button
                    onClick={handleCreateLiteracyProgram}
                    disabled={creatingProgram}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {creatingProgram ? 'Criando...' : 'Criar Programa de Letramento'}
                  </button>
                )}
              </div>

              {literacyPrograms.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Nenhum programa de letramento atribuido a este paciente
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {literacyPrograms.map((program) => {
                    const progress = literacyProgress[program.id];
                    return (
                      <div key={program.id} className="space-y-4">
                        {/* Cabecalho do programa */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {program.name}
                            </h3>
                            <p className="text-xs text-gray-400">
                              Iniciado em{' '}
                              {new Date(program.started_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                            style={{
                              backgroundColor: stageColors[program.current_stage],
                            }}
                          >
                            {stageLabels[program.current_stage]}
                          </span>
                        </div>

                        {/* Barra de progresso de estagios */}
                        <LiteracyProgress currentStage={program.current_stage} />

                        {/* Metricas */}
                        {progress && (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                  {progress.total_activities_completed}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Atividades concluidas
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                  {Math.round(progress.average_score)}%
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Pontuacao media
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                  {Math.round(progress.total_time_minutes)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Minutos totais
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                  {progress.milestones.length}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Marcos alcancados
                                </p>
                              </div>
                            </div>

                            {/* Atividades por tipo */}
                            {Object.keys(progress.activities_by_type).length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                  Desempenho por tipo de atividade
                                </h4>
                                <div className="space-y-2">
                                  {Object.entries(progress.activities_by_type).map(
                                    ([type, data]) => (
                                      <div
                                        key={type}
                                        className="flex items-center gap-3"
                                      >
                                        <span className="text-sm text-gray-600 w-40 truncate">
                                          {type}
                                        </span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                                          <div
                                            className="h-2.5 rounded-full bg-brand-primary"
                                            style={{
                                              width: `${Math.min(data.avg_score, 100)}%`,
                                            }}
                                          />
                                        </div>
                                        <span className="text-xs text-gray-500 w-20 text-right">
                                          {Math.round(data.avg_score)}% ({data.completed})
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Timeline de marcos */}
                            {progress.milestones.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                  Marcos alcancados
                                </h4>
                                <div className="space-y-3">
                                  {progress.milestones.map((milestone, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3"
                                    >
                                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <Award className="w-4 h-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                          {milestone.type}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {new Date(
                                            milestone.achieved_at
                                          ).toLocaleDateString('pt-BR')}
                                        </p>
                                      </div>
                                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Recomendacoes */}
                            {progress.recommendations.length > 0 && (
                              <div className="bg-blue-50 rounded-xl p-4">
                                <h4 className="text-sm font-semibold text-blue-800 mb-2">
                                  Recomendacoes
                                </h4>
                                <ul className="space-y-1">
                                  {progress.recommendations.map((rec, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-blue-700 flex items-start gap-2"
                                    >
                                      <span className="text-blue-400 mt-1">-</span>
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sessoes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Sessoes recentes
              </h2>
            </div>
            {logs.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Nenhum registro de sessao encontrado
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.event_type}
                      </p>
                      <p className="text-xs text-gray-400">
                        Sessao: {log.session_id || 'N/A'}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
