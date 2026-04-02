'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Users } from 'lucide-react';
import Header from '@/components/header';
import PatientCard from '@/components/patient-card';
import { api } from '@/lib/api';
import type { AACProfile } from '@/lib/types';
import { COMMUNICATION_LEVEL_LABELS } from '@/lib/types';

export default function PatientsPage() {
  const [profiles, setProfiles] = useState<AACProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  useEffect(() => {
    api
      .getProfiles()
      .then((p) => setProfiles(p))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesLevel =
        levelFilter === 'all' || p.communication_level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [profiles, search, levelFilter]);

  return (
    <div>
      <Header
        title="Pacientes"
        subtitle={`${profiles.length} pacientes cadastrados`}
      />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar paciente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            >
              <option value="all">Todos os niveis</option>
              {Object.entries(COMMUNICATION_LEVEL_LABELS).map(
                ([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                )
              )}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            Adicionar Paciente
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              {search || levelFilter !== 'all'
                ? 'Nenhum paciente encontrado com esses filtros'
                : 'Nenhum paciente cadastrado'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {search || levelFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Clique em "Adicionar Paciente" para comecar'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((profile) => (
              <PatientCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
