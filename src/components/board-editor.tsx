'use client';

import { useState } from 'react';
import { Save, Eye, EyeOff, Trash2 } from 'lucide-react';
import type { Board, BoardCell, Symbol } from '@/lib/types';
import SymbolPicker from './symbol-picker';

interface BoardEditorProps {
  board: Board;
  onSave: (cells: BoardCell[]) => Promise<void>;
}

interface CellEditorState {
  row: number;
  col: number;
  cell: BoardCell | null;
}

const ACTION_LABELS: Record<BoardCell['action'], string> = {
  speak: 'Falar',
  navigate: 'Navegar',
  modifier: 'Modificador',
};

export default function BoardEditor({ board, onSave }: BoardEditorProps) {
  const [cells, setCells] = useState<BoardCell[]>(board.cells);
  const [editingCell, setEditingCell] = useState<CellEditorState | null>(null);
  const [symbolPickerOpen, setSymbolPickerOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const getCellAt = (row: number, col: number) =>
    cells.find((c) => c.position_row === row && c.position_col === col);

  const grid = Array.from({ length: board.grid_rows }, (_, row) =>
    Array.from({ length: board.grid_cols }, (_, col) => ({
      row,
      col,
      cell: getCellAt(row, col),
    }))
  );

  const handleCellClick = (row: number, col: number) => {
    if (previewMode) return;
    const existing = getCellAt(row, col);
    setEditingCell({ row, col, cell: existing || null });
  };

  const updateEditingCell = (updates: Partial<BoardCell>) => {
    if (!editingCell) return;

    const existingIndex = cells.findIndex(
      (c) =>
        c.position_row === editingCell.row &&
        c.position_col === editingCell.col
    );

    const baseCell: BoardCell = editingCell.cell || {
      id: `temp-${editingCell.row}-${editingCell.col}`,
      board_id: board.id,
      position_row: editingCell.row,
      position_col: editingCell.col,
      symbol_id: null,
      label_override: null,
      action: 'speak',
      action_target: null,
      background_color: '#E0E0E0',
      is_hidden: false,
    };

    const updatedCell = { ...baseCell, ...updates };
    setEditingCell({ ...editingCell, cell: updatedCell });

    if (existingIndex >= 0) {
      const newCells = [...cells];
      newCells[existingIndex] = updatedCell;
      setCells(newCells);
    } else {
      setCells([...cells, updatedCell]);
    }
  };

  const handleSymbolSelect = (symbol: Symbol) => {
    updateEditingCell({
      symbol_id: symbol.id,
      label_override: symbol.label_pt,
      background_color: symbol.fitzgerald_color,
    });
  };

  const deleteCell = () => {
    if (!editingCell) return;
    setCells(
      cells.filter(
        (c) =>
          !(
            c.position_row === editingCell.row &&
            c.position_col === editingCell.col
          )
      )
    );
    setEditingCell(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(cells);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Grid */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{board.name}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              {previewMode ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {previewMode ? 'Editar' : 'Visualizar'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-dark rounded-xl transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>

        <div
          className="grid gap-2 bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          style={{
            gridTemplateColumns: `repeat(${board.grid_cols}, 1fr)`,
          }}
        >
          {grid.flat().map(({ row, col, cell }) => (
            <button
              key={`${row}-${col}`}
              onClick={() => handleCellClick(row, col)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all border-2 ${
                editingCell?.row === row && editingCell?.col === col
                  ? 'border-brand-primary ring-2 ring-brand-primary/30'
                  : 'border-transparent hover:border-gray-300'
              } ${cell?.is_hidden ? 'opacity-30' : ''}`}
              style={{
                backgroundColor: cell?.background_color || '#F3F4F6',
                minHeight: '60px',
              }}
            >
              {cell?.label_override && (
                <span
                  className={`text-center leading-tight px-1 truncate w-full ${
                    cell.background_color && cell.background_color !== '#E0E0E0'
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {cell.label_override}
                </span>
              )}
              {!cell && !previewMode && (
                <span className="text-gray-300 text-lg">+</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Cell editor panel */}
      {editingCell && !previewMode && (
        <div className="lg:w-80 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">
              Celula ({editingCell.row + 1}, {editingCell.col + 1})
            </h3>
            <button
              onClick={() => setEditingCell(null)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Fechar
            </button>
          </div>

          <div className="space-y-4">
            {/* Symbol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Simbolo
              </label>
              <button
                onClick={() => setSymbolPickerOpen(true)}
                className="w-full px-4 py-2.5 text-sm text-left bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {editingCell.cell?.label_override || 'Selecionar simbolo...'}
              </button>
            </div>

            {/* Label override */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto personalizado
              </label>
              <input
                type="text"
                value={editingCell.cell?.label_override || ''}
                onChange={(e) =>
                  updateEditingCell({ label_override: e.target.value })
                }
                placeholder="Ex: Oi"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              />
            </div>

            {/* Action */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acao
              </label>
              <select
                value={editingCell.cell?.action || 'speak'}
                onChange={(e) =>
                  updateEditingCell({
                    action: e.target.value as BoardCell['action'],
                  })
                }
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
              >
                {Object.entries(ACTION_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Background color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor de fundo
              </label>
              <input
                type="color"
                value={editingCell.cell?.background_color || '#E0E0E0'}
                onChange={(e) =>
                  updateEditingCell({ background_color: e.target.value })
                }
                className="w-full h-10 rounded-xl cursor-pointer border border-gray-200"
              />
            </div>

            {/* Hidden toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingCell.cell?.is_hidden || false}
                onChange={(e) =>
                  updateEditingCell({ is_hidden: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm text-gray-700">Ocultar celula</span>
            </label>

            {/* Delete */}
            {editingCell.cell && (
              <button
                onClick={deleteCell}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remover celula
              </button>
            )}
          </div>
        </div>
      )}

      <SymbolPicker
        isOpen={symbolPickerOpen}
        onClose={() => setSymbolPickerOpen(false)}
        onSelect={handleSymbolSelect}
      />
    </div>
  );
}
