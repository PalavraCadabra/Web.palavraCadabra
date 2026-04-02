'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import Header from '@/components/header';
import StatsCard from '@/components/stats-card';
import PatientCard from '@/components/patient-card';
import { api } from '@/lib/api';
import type { AACProfile } from '@/lib/types';

export default function DashboardHome() {
  const [profiles, setProfiles] = useState<AACProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProfiles()
      .then((p) => setProfiles(p))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  const recentProfiles = profiles.slice(0, 4);

  return (
    <div>
      <Header
        title="Visao Geral"
        subtitle="Bem-vindo ao painel do terapeuta"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de pacientes"
            value={profiles.length}
            icon={Users}
            trend={{ value: 12, label: 'vs. mes anterior' }}
            color="bg-brand-primary"
          />
          <StatsCard
            title="Sessoes hoje"
            value={3}
            icon={Calendar}
            subtitle="2 agendadas"
            color="bg-brand-secondary"
          />
          <StatsCard
            title="Simbolos usados (semana)"
            value={847}
            icon={MessageSquare}
            trend={{ value: 8, label: 'vs. semana anterior' }}
            color="bg-fitz-verb"
          />
          <StatsCard
            title="Taxa comunicativa media"
            value="4.2/min"
            icon={TrendingUp}
            trend={{ value: 15, label: 'vs. mes anterior' }}
            color="bg-fitz-adjective"
          />
        </div>

        {/* Recent patients */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Pacientes recentes
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
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
          ) : recentProfiles.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum paciente cadastrado ainda</p>
              <p className="text-sm text-gray-400 mt-1">
                Adicione pacientes na aba Pacientes
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentProfiles.map((profile) => (
                <PatientCard
                  key={profile.id}
                  profile={profile}
                  lastSession="Hoje, 14:30"
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Acoes rapidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/patients"
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-primary/20 transition-all group"
            >
              <Users className="w-8 h-8 text-brand-primary mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                Gerenciar Pacientes
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Adicionar, editar e acompanhar pacientes
              </p>
            </Link>
            <Link
              href="/dashboard/boards"
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-primary/20 transition-all group"
            >
              <MessageSquare className="w-8 h-8 text-brand-secondary mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                Criar Pranchas
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Montar pranchas de comunicacao personalizadas
              </p>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-primary/20 transition-all group"
            >
              <TrendingUp className="w-8 h-8 text-fitz-verb mb-2" />
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                Ver Analytics
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Relatorios de progresso e uso
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
