'use client';

import { stageLabels, stageColors } from '@/lib/types';

const stages = ['foundations', 'emerging', 'developing', 'conventional'] as const;

interface LiteracyProgressProps {
  currentStage: string;
  onStageClick?: (stage: string) => void;
}

export default function LiteracyProgress({
  currentStage,
  onStageClick,
}: LiteracyProgressProps) {
  const currentIndex = stages.indexOf(
    currentStage as (typeof stages)[number]
  );

  return (
    <div className="flex items-center gap-0 w-full">
      {stages.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={stage} className="flex items-center flex-1">
            <button
              onClick={() => onStageClick?.(stage)}
              className={`flex flex-col items-center gap-2 flex-1 p-3 rounded-xl transition-all ${
                onStageClick ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
              }`}
            >
              {/* Indicador circular */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isCurrent
                      ? 'border-blue-500 text-blue-600 animate-pulse'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
                style={
                  isCurrent
                    ? { backgroundColor: `${stageColors[stage]}20`, borderColor: stageColors[stage] }
                    : isCompleted
                      ? { backgroundColor: '#22c55e', borderColor: '#22c55e' }
                      : {}
                }
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-medium text-center leading-tight ${
                  isCompleted
                    ? 'text-green-600'
                    : isCurrent
                      ? 'text-gray-900 font-bold'
                      : 'text-gray-400'
                }`}
              >
                {stageLabels[stage]}
              </span>

              {/* Badge de status */}
              {isCurrent && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white"
                  style={{ backgroundColor: stageColors[stage] }}
                >
                  Atual
                </span>
              )}
              {isCompleted && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">
                  Concluido
                </span>
              )}
              {isFuture && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-400">
                  Pendente
                </span>
              )}
            </button>

            {/* Conector entre estagios */}
            {index < stages.length - 1 && (
              <div
                className={`h-0.5 w-6 flex-shrink-0 ${
                  index < currentIndex ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
