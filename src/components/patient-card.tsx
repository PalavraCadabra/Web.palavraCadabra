'use client';

import Link from 'next/link';
import { ChevronRight, Activity } from 'lucide-react';
import type { AACProfile } from '@/lib/types';
import { COMMUNICATION_LEVEL_LABELS } from '@/lib/types';

interface PatientCardProps {
  profile: AACProfile;
  lastSession?: string;
}

const levelColors: Record<AACProfile['communication_level'], string> = {
  pre_symbolic: 'bg-red-100 text-red-700',
  symbolic: 'bg-orange-100 text-orange-700',
  emerging_language: 'bg-blue-100 text-blue-700',
  contextual_language: 'bg-green-100 text-green-700',
};

export default function PatientCard({ profile, lastSession }: PatientCardProps) {
  return (
    <Link href={`/dashboard/patients/${profile.id}`}>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-primary/20 transition-all cursor-pointer group">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-surface text-brand-primary flex items-center justify-center text-lg font-bold">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-primary transition-colors">
                {profile.name}
              </h3>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium ${
                  levelColors[profile.communication_level]
                }`}
              >
                {COMMUNICATION_LEVEL_LABELS[profile.communication_level]}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-primary transition-colors" />
        </div>
        {lastSession && (
          <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Ultima sessao: {lastSession}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
