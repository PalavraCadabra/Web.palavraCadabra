'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Clock,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import Header from '@/components/header';
import LiteracyProgress from '@/components/literacy-progress';
import { api } from '@/lib/api';
import type { LiteracyProgram, AACProfile, LiteracyProgress as LiteracyProgressType } from '@/lib/types';
import { stageLabels, stageColors } from '@/lib/types';

export default function LiteracyPage() {
  const [programs, setPrograms] = useState<LiteracyProgram[]>([]);
  const [profiles, setProfiles] = useState<AACProfile[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, LiteracyProgressType>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [patientFilter, setPatientFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProgram, setNewProgram] = useState({
    profile_id: '',
    name: '',
    notes: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [progs, profs] = await Promise.all([
        api.getLiteracyPrograms().catch(() => []),
        api.getProfiles().catch(() => []),
      ]);
      setPrograms(progs);
      setProfiles(profs);

      // Carregar progresso de cada programa
      const progressEntries = await Promise.all(
        progs.map(async (p) => {
          try {
            const progress = await api.getLiteracyProgress(p.id);
            return [p.id, progress] as const;
          } catch {
            return null;
          }
        })
      );
      const map: Record<string, LiteracyProgressType> = {};
      for (const entry of progressEntries) {
        if (entry) map[entry[0]] = entry[1];
      }
      setProgressMap(map);
    } finally {
      setLoading(false);
    }
  }

  function getProfileName(profileId: string): string {
    return profiles.find((p) => p.id === profileId)?.name || 'Paciente';
  }

  async function handleCreateProgram() {
    if (!newProgram.profile_id || !newProgram.name) return;
    setCreating(true);
    try {
      const created = await api.createLiteracyProgram({
        profile_id: newProgram.profile_id,
        name: newProgram.name,
        notes: newProgram.notes || null,
      });
      setPrograms((prev) => [...prev, created]);
      setShowCreateModal(false);
      setNewProgram({ profile_id: '', name: '', notes: '' });
    } catch {
      // erro silencioso
    } finally {
      setCreating(false);
    }
  }

  const filteredPrograms = programs.filter((p) => {
    const name = getProfileName(p.profile_id).toLowerCase();
    const matchesSearch =
      !searchTerm ||
      name.includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = !stageFilter || p.current_stage === stageFilter;
    const matchesPatient = !patientFilter || p.profile_id === patientFilter;
    return matchesSearch && matchesStage && matchesPatient;
  });

  const activePrograms = programs.filter((p) => p.is_active).length;
  const stageDistribution = programs.reduce(
    (acc, p) => {
      acc[p.current_stage] = (acc[p.current_stage] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (loading) {
    return (
      <div>
        <Header title="Letramento" subtitle="Programas de alfabetizacao" />
        <div className="p-6 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Letramento" subtitle="Programas de alfabetizacao" />

      <div className="p-6 space-y-6">
        {/* Metricas resumidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Total de programas
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Programas ativos
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activePrograms}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Pacientes
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(programs.map((p) => p.profile_id)).size}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">
                Media geral
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {programs.length > 0
                ? `${Math.round(
                    Object.values(progressMap).reduce(
                      (sum, p) => sum + (p.average_score || 0),
                      0
                    ) / Math.max(Object.values(progressMap).length, 1)
                  )}%`
                : '--'}
            </p>
          </div>
        </div>

        {/* Pipeline de estagios */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Distribuicao por estagio
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {(['foundations', 'emerging', 'developing', 'conventional'] as const).map(
              (stage) => (
                <div
                  key={stage}
                  className="text-center p-4 rounded-xl"
                  style={{ backgroundColor: `${stageColors[stage]}10` }}
                >
                  <p
                    className="text-3xl font-bold"
                    style={{ color: stageColors[stage] }}
                  >
                    {stageDistribution[stage] || 0}
                  </p>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    {stageLabels[stage]}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Barra de acoes */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-3 flex-1 w-full sm:w-auto">
            {/* Busca */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              />
            </div>

            {/* Filtro por estagio */}
            <div className="relative">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="">Todos os estagios</option>
                {Object.entries(stageLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Filtro por paciente */}
            <div className="relative">
              <select
                value={patientFilter}
                onChange={(e) => setPatientFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              >
                <option value="">Todos os pacientes</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-brand-primary-dark transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo programa
          </button>
        </div>

        {/* Lista de programas */}
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {programs.length === 0
                ? 'Nenhum programa de letramento criado'
                : 'Nenhum programa encontrado com os filtros selecionados'}
            </p>
            {programs.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-sm text-brand-primary hover:underline"
              >
                Criar primeiro programa
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPrograms.map((program) => {
              const progress = progressMap[program.id];
              return (
                <div
                  key={program.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Cabecalho do card */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{program.name}</h3>
                      <p className="text-sm text-gray-500">
                        {getProfileName(program.profile_id)}
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
                  <div className="mb-4">
                    <LiteracyProgress currentStage={program.current_stage} />
                  </div>

                  {/* Metricas do programa */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {progress?.total_activities_completed ?? '--'}
                      </p>
                      <p className="text-xs text-gray-500">Atividades</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {progress
                          ? `${Math.round(progress.average_score)}%`
                          : '--'}
                      </p>
                      <p className="text-xs text-gray-500">Media</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {progress
                          ? `${Math.round(progress.total_time_minutes)}min`
                          : '--'}
                      </p>
                      <p className="text-xs text-gray-500">Tempo total</p>
                    </div>
                  </div>

                  {/* Rodape */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      Iniciado em{' '}
                      {new Date(program.started_at).toLocaleDateString('pt-BR')}
                    </div>
                    <Link
                      href={`/dashboard/patients/${program.profile_id}`}
                      className="text-xs text-brand-primary hover:underline font-medium"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de criacao */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Criar programa de letramento
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Atribua um novo programa de alfabetizacao a um paciente
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente
                </label>
                <select
                  value={newProgram.profile_id}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, profile_id: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                >
                  <option value="">Selecione um paciente...</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do programa
                </label>
                <input
                  type="text"
                  placeholder="Ex: Programa de Letramento 2026"
                  value={newProgram.name}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observacoes (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Anotacoes sobre o programa..."
                  value={newProgram.notes}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, notes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewProgram({ profile_id: '', name: '', notes: '' });
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProgram}
                disabled={!newProgram.profile_id || !newProgram.name || creating}
                className="px-5 py-2 text-sm text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Criando...' : 'Criar programa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
