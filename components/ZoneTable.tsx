'use client';

import { TeamStanding } from '@/types';

interface ZoneTableProps {
  zone: string;
  standings: TeamStanding[];
  highlightTeams?: string[]; // clasificados
}

export default function ZoneTable({ zone, standings, highlightTeams = [] }: ZoneTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700">
      {/* Header de zona */}
      <div className={`px-4 py-2 font-bold text-sm tracking-wider ${
        zone === 'A' ? 'bg-blue-600/80' :
        zone === 'B' ? 'bg-purple-600/80' :
        zone === 'C' ? 'bg-orange-600/80' :
        'bg-green-600/80'
      }`}>
        ZONA {zone}
      </div>

      {/* Cabecera tabla */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-1 px-3 py-1.5 bg-gray-800/80 text-xs text-gray-400 font-medium border-b border-gray-700">
        <span>Equipo</span>
        <span className="w-7 text-center">PJ</span>
        <span className="w-7 text-center">PTS</span>
        <span className="w-7 text-center">GF</span>
        <span className="w-7 text-center">GC</span>
        <span className="w-7 text-center">DG</span>
      </div>

      {/* Filas */}
      {standings.map((s, idx) => {
        const isClassified = highlightTeams.includes(s.team);
        return (
          <div
            key={s.team}
            className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-1 px-3 py-2.5 border-b border-gray-700/50 last:border-0 items-center ${
              isClassified ? 'bg-green-900/20' : 'bg-gray-800/40'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  idx === 0
                    ? 'bg-yellow-500 text-black'
                    : idx === 1
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {idx + 1}
              </span>
              <span className={`text-sm font-semibold truncate ${isClassified ? 'text-green-300' : 'text-gray-100'}`}>
                {s.team}
              </span>
              {isClassified && (
                <span className="text-green-400 text-xs shrink-0">✓</span>
              )}
            </div>
            <span className="w-7 text-center text-sm text-gray-300">{s.played}</span>
            <span className="w-7 text-center text-sm font-bold text-white">{s.points}</span>
            <span className="w-7 text-center text-sm text-gray-300">{s.gf}</span>
            <span className="w-7 text-center text-sm text-gray-300">{s.ga}</span>
            <span className={`w-7 text-center text-sm font-medium ${s.gd > 0 ? 'text-green-400' : s.gd < 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {s.gd > 0 ? `+${s.gd}` : s.gd}
            </span>
          </div>
        );
      })}
    </div>
  );
}
