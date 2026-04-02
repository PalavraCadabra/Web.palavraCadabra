'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Grid3X3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import BoardPreview from '@/components/board-preview';
import { api } from '@/lib/api';
import type { Board } from '@/lib/types';
import { BOARD_TYPE_LABELS } from '@/lib/types';

export default function BoardsPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api
      .getBoards(showTemplates ? { templates_only: true } : undefined)
      .then((b) => setBoards(b))
      .catch(() => setBoards([]))
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

  const handleCreate = async () => {
    setCreating(true);
    try {
      const newBoard = await api.createBoard({
        name: 'Nova Prancha',
        board_type: 'core',
        grid_rows: 4,
        grid_cols: 4,
        is_template: false,
        cells: [],
      });
      router.push(`/dashboard/boards/${newBoard.id}`);
    } catch {
      setCreating(false);
    }
  };

  return (
    <div>
      <Header
        title="Pranchas"
        subtitle={`${boards.length} pranchas disponíveis`}
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
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-dark text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {creating ? 'Criando...' : 'Nova Prancha'}
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
    </div>
  );
}
