'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { api } from '@/lib/api';
import type { Symbol } from '@/lib/types';
import { GRAMMATICAL_CLASS_LABELS } from '@/lib/types';

interface SymbolPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (symbol: Symbol) => void;
}

const categories = [
  'Todos',
  'pronoun',
  'verb',
  'adjective',
  'noun',
  'social_phrase',
  'misc',
  'question',
];

export default function SymbolPicker({
  isOpen,
  onClose,
  onSelect,
}: SymbolPickerProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSymbols = useCallback(async () => {
    setLoading(true);
    try {
      const params: { search?: string; category?: string; limit: number } = {
        limit: 50,
      };
      if (search) params.search = search;
      if (category !== 'Todos') params.category = category;
      const result = await api.getSymbols(params);
      setSymbols(result);
    } catch {
      setSymbols([]);
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(fetchSymbols, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fetchSymbols]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Selecionar Simbolo
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & filters */}
        <div className="px-6 py-3 space-y-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar simbolos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-brand-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'Todos'
                  ? 'Todos'
                  : GRAMMATICAL_CLASS_LABELS[
                      cat as keyof typeof GRAMMATICAL_CLASS_LABELS
                    ]}
              </button>
            ))}
          </div>
        </div>

        {/* Symbol grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
            </div>
          ) : symbols.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Nenhum simbolo encontrado</p>
              <p className="text-xs mt-1">
                Tente buscar com outros termos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {symbols.map((symbol) => (
                <button
                  key={symbol.id}
                  onClick={() => {
                    onSelect(symbol);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:bg-brand-surface transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                    style={{ backgroundColor: symbol.fitzgerald_color }}
                  >
                    {symbol.image_url ? (
                      <Image
                        src={symbol.image_url}
                        alt={symbol.label_pt}
                        width={40}
                        height={40}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      symbol.label_pt.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-[10px] text-gray-600 text-center leading-tight truncate w-full">
                    {symbol.label_pt}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
