'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Trash2,
  Shield,
  Heart,
  GraduationCap,
  Crown,
  X,
} from 'lucide-react';
import Header from '@/components/header';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { CareRelationship, AACProfile } from '@/lib/types';

const RELATIONSHIP_LABELS: Record<string, string> = {
  caregiver: 'Cuidador(a)',
  therapist: 'Terapeuta',
  teacher: 'Professor(a)',
  admin: 'Administrador(a)',
};

const RELATIONSHIP_ICONS: Record<string, typeof Heart> = {
  caregiver: Heart,
  therapist: Shield,
  teacher: GraduationCap,
  admin: Crown,
};

const RELATIONSHIP_COLORS: Record<string, string> = {
  caregiver: 'bg-pink-100 text-pink-700',
  therapist: 'bg-blue-100 text-blue-700',
  teacher: 'bg-green-100 text-green-700',
  admin: 'bg-purple-100 text-purple-700',
};

export default function TeamPage() {
  const { user } = useAuth();
  const [relationships, setRelationships] = useState<CareRelationship[]>([]);
  const [profiles, setProfiles] = useState<AACProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  // Estado do formulário de convite
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteProfileId, setInviteProfileId] = useState('');
  const [inviteType, setInviteType] = useState('therapist');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  useEffect(() => {
    Promise.all([api.getCareRelationships(), api.getProfiles()])
      .then(([rels, profs]) => {
        setRelationships(rels);
        setProfiles(profs);
      })
      .catch(() => {
        setRelationships([]);
        setProfiles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return relationships;
    const q = search.toLowerCase();
    return relationships.filter(
      (r) =>
        r.user_name?.toLowerCase().includes(q) ||
        r.user_email?.toLowerCase().includes(q) ||
        r.profile_name?.toLowerCase().includes(q)
    );
  }, [relationships, search]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteError('');
    setInviteSuccess('');

    try {
      await api.inviteToCare({
        profile_id: inviteProfileId,
        email: inviteEmail,
        relationship_type: inviteType,
        message: inviteMessage || undefined,
      });
      setInviteSuccess('Convite enviado com sucesso!');
      setInviteEmail('');
      setInviteMessage('');

      // Recarregar lista
      const rels = await api.getCareRelationships();
      setRelationships(rels);

      setTimeout(() => {
        setShowInvite(false);
        setInviteSuccess('');
      }, 2000);
    } catch (err) {
      setInviteError(
        err instanceof Error ? err.message : 'Erro ao enviar convite'
      );
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (relationshipId: string) => {
    if (!confirm('Tem certeza que deseja remover este vinculo?')) return;

    try {
      await api.removeCareRelationship(relationshipId);
      setRelationships((prev) => prev.filter((r) => r.id !== relationshipId));
    } catch {
      alert('Erro ao remover vinculo');
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'therapist';

  return (
    <div>
      <Header
        title="Equipe"
        subtitle={`${relationships.length} membros vinculados`}
      />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar membro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Convidar Membro
            </button>
          )}
        </div>

        {/* Modal de Convite */}
        {showInvite && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Convidar Membro
                </h2>
                <button
                  onClick={() => {
                    setShowInvite(false);
                    setInviteError('');
                    setInviteSuccess('');
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInvite} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paciente
                  </label>
                  <select
                    required
                    value={inviteProfileId}
                    onChange={(e) => setInviteProfileId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                  >
                    <option value="">Selecione um paciente</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de vinculo
                  </label>
                  <select
                    value={inviteType}
                    onChange={(e) => setInviteType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                  >
                    {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem (opcional)
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Escreva uma mensagem para o convidado..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary resize-none"
                  />
                </div>

                {inviteError && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">
                    {inviteError}
                  </div>
                )}
                {inviteSuccess && (
                  <div className="p-3 bg-green-50 text-green-700 text-sm rounded-xl">
                    {inviteSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={inviting}
                  className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {inviting ? 'Enviando...' : 'Enviar Convite'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Lista de membros */}
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
              {search
                ? 'Nenhum membro encontrado'
                : 'Nenhum membro vinculado'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {search
                ? 'Tente ajustar os filtros de busca'
                : 'Clique em "Convidar Membro" para comecar'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((rel) => {
              const Icon =
                RELATIONSHIP_ICONS[rel.relationship_type] || Shield;
              const colorClass =
                RELATIONSHIP_COLORS[rel.relationship_type] ||
                'bg-gray-100 text-gray-700';

              return (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-sm font-bold">
                        {rel.user_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {rel.user_name || 'Sem nome'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {rel.user_email || ''}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleRemove(rel.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover vinculo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${colorClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {RELATIONSHIP_LABELS[rel.relationship_type] ||
                        rel.relationship_type}
                    </span>
                  </div>

                  {rel.profile_name && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-xs text-gray-500">
                        Paciente:{' '}
                        <span className="font-medium text-gray-700">
                          {rel.profile_name}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
