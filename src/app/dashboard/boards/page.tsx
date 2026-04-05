'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Grid3X3, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import BoardPreview from '@/components/board-preview';
import { api } from '@/lib/api';
import type { Board, AACProfile } from '@/lib/types';
import { BOARD_TYPE_LABELS } from '@/lib/types';

export default function BoardsPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [profiles, setProfiles] = useState<AACProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showTemplates, setShowTemplates] = useState(false);

  // Create modal state
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    profile_id: '',
    board_type: 'core' as Board['board_type'],
    grid_rows: 4,
    grid_cols: 5,
    is_template: false,
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getBoards(showTemplates ? { templates_only: true } : undefined),
      api.getProfiles(),
    ])
      .then(([b, p]) => {
        setBoards(b);
        setProfiles(p);
      })
      .catch(() => {
        setBoards([]);
        setProfiles([]);
      })
      .finally(() => setLoading(false));
  }, [showTemplates]);

  const filtered = useMemo(() => {
    return boards.filter((b) => {
      const matchesSearch = b.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType =
        typeFilter === 'all' || b.board_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [boards, search, typeFilter]);

  const openCreateModal = () => {
    setForm({
      name: '',
      profile_id: profiles[0]?.id || '',
      board_type: 'core',
      grid_rows: 4,
      grid_cols: 5,
      is_template: false,
    });
    setError(null);
    setShowModal(true);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      setError('Digite um nome para a prancha');
      return;
    }
    if (!form.is_template && !form.profile_id) {
      setError('Selecione um paciente ou marque como template');
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const newBoard = await api.createBoard({
        name: form.name.trim(),
        board_type: form.board_type,
        grid_rows: form.grid_rows,
        grid_cols: form.grid_cols,
        is_template: form.is_template,
        profile_id: form.is_template ? null : form.profile_id,
        cells: [],
      });
      setShowModal(false);
      router.push(`/dashboard/boards/${newBoard.id}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido';
      setError(`Falha ao criar prancha: ${msg}`);
      setCreating(false);
    }
  };

  return (
    <div>
      <Header
        title="Pranchas"
        subtitle={`${boards.length} pranchas disponiveis`}
      />

      <div className="p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar prancha..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            >
              <option value="all">Todos os tipos</option>
              {Object.entries(BOARD_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showTemplates}
                onChange={(e) => setShowTemplates(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              Apenas templates
            </label>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Prancha
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="aspect-square bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <Grid3X3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              {search || typeFilter !== 'all'
                ? 'Nenhuma prancha encontrada com esses filtros'
                : 'Nenhuma prancha criada ainda'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Clique em &quot;Nova Prancha&quot; para comecar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((board) => (
              <BoardPreview key={board.id} board={board} />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Nova Prancha</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da prancha *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="ex: Rotina da Manha"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                  autoFocus
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_template}
                    onChange={(e) =>
                      setForm({ ...form, is_template: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-brand-primary"
                  />
                  Criar como template (compartilhada)
                </label>
              </div>

              {!form.is_template && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Paciente *
                  </label>
                  <select
                    value={form.profile_id}
                    onChange={(e) =>
                      setForm({ ...form, profile_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                  >
                    <option value="">Selecione um paciente</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {profiles.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Nenhum paciente cadastrado. Crie um perfil primeiro ou marque como template.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={form.board_type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      board_type: e.target.value as Board['board_type'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                >
                  {Object.entries(BOARD_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Linhas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.grid_rows}
                    onChange={(e) =>
                      setForm({ ...form, grid_rows: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Colunas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.grid_cols}
                    onChange={(e) =>
                      setForm({ ...form, grid_cols: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {creating ? 'Criando...' : 'Criar Prancha'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
