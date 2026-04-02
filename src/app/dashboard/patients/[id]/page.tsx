'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import Header from '@/components/header';
import BoardPreview from '@/components/board-preview';
import UsageChart from '@/components/usage-chart';
import VocabularyChart from '@/components/vocabulary-chart';
import { api } from '@/lib/api';
import type { AACProfile, Board, UsageLog, Symbol as SymbolType } from '@/lib/types';
import {
  COMMUNICATION_LEVEL_LABELS,
  MOTOR_CAPABILITY_LABELS,
  VISUAL_CAPABILITY_LABELS,
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

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<AACProfile | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AACProfile>>({});

  useEffect(() => {
    Promise.all([
      api.getProfile(id).catch(() => null),
      api.getBoards({ profile_id: id }).catch(() => []),
      api.getUsageLogs({ profile_id: id, limit: 50 }).catch(() => []),
    ])
      .then(([p, b, l]) => {
        setProfile(p);
        setBoards(b);
        setLogs(l);
        if (p) setEditForm(p);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
