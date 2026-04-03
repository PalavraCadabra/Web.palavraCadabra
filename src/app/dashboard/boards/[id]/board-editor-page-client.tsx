'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Header from '@/components/header';
import BoardEditor from '@/components/board-editor';
import { api } from '@/lib/api';
import type { Board, BoardCell } from '@/lib/types';

export default function BoardEditorPageClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api
      .getBoard(id)
      .then((b) => setBoard(b))
      .catch(() => setBoard(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = useCallback(
    async (cells: BoardCell[]) => {
      if (!board) return;

      // Update board with new cells by syncing each cell
      // For simplicity, we update the board itself
      const updated = await api.updateBoard(board.id, {
        ...board,
        cells,
      });
      setBoard(updated);
    },
    [board]
  );

  const handleDelete = async () => {
    if (!board) return;
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a prancha "${board.name}"? Esta acao nao pode ser desfeita.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.deleteBoard(board.id);
      router.push('/dashboard/boards');
    } catch {
      setDeleting(false);
    }
  };

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

  if (!board) {
    return (
      <div>
        <Header title="Prancha nao encontrada" />
        <div className="p-6 text-center">
          <p className="text-gray-500">Esta prancha nao foi encontrada.</p>
          <button
            onClick={() => router.push('/dashboard/boards')}
            className="mt-4 text-brand-primary hover:underline text-sm"
          >
            Voltar para pranchas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={`Editar: ${board.name}`} subtitle="Editor de prancha" />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard/boards')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para pranchas
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Excluindo...' : 'Excluir prancha'}
          </button>
        </div>

        <BoardEditor board={board} onSave={handleSave} />
      </div>
    </div>
  );
}
