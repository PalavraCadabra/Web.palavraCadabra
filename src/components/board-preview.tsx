'use client';

import Link from 'next/link';
import type { Board } from '@/lib/types';

interface BoardPreviewProps {
  board: Board;
  linkToEditor?: boolean;
}

export default function BoardPreview({
  board,
  linkToEditor = true,
}: BoardPreviewProps) {
  const grid = Array.from({ length: board.grid_rows }, (_, row) =>
    Array.from({ length: board.grid_cols }, (_, col) => {
      return board.cells.find(
        (c) => c.position_row === row && c.position_col === col
      );
    })
  );

  const content = (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-sm font-semibold text-gray-900 mb-2 truncate">
        {board.name}
      </h3>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${board.grid_cols}, 1fr)`,
          gridTemplateRows: `repeat(${board.grid_rows}, 1fr)`,
        }}
      >
        {grid.flat().map((cell, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-lg flex items-center justify-center text-[8px] text-white font-medium overflow-hidden"
            style={{
              backgroundColor: cell?.background_color || '#E0E0E0',
              minHeight: '20px',
            }}
          >
            {cell?.label_override ? (
              <span className="truncate px-0.5">
                {cell.label_override}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">
          {board.grid_rows}x{board.grid_cols}
        </span>
        <span className="text-xs text-gray-400">
          {board.cells.length} celulas
        </span>
      </div>
    </div>
  );

  if (linkToEditor) {
    return <Link href={`/dashboard/boards/${board.id}`}>{content}</Link>;
  }

  return content;
}
