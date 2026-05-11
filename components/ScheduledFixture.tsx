'use client';

import { Match } from '@/types';
import MatchCard from './MatchCard';

interface SlotEntry {
  cancha: number;
  home: string | null;
  away: string | null;
  zone: string | null;
}
interface ScheduleSlot { time: string; matches: SlotEntry[]; }

// Zona A: Planeta Thcia, Los Sumatorias, Los Secanucas, Palangana
// Zona B: La mastur, Los +capitos, Angry Kirk, 67 Maquinas
// Zona C: Milanesa, El suplantaso, La changuita
const SCHEDULE: ScheduleSlot[] = [
  {
    time: '08:00 – 08:30',
    matches: [
      { cancha: 1, home: 'Planeta Thcia',  away: 'Palangana',     zone: 'A' },
      { cancha: 2, home: 'La mastur',       away: 'Los +capitos',  zone: 'B' },
    ],
  },
  {
    time: '08:30 – 09:00',
    matches: [
      { cancha: 1, home: 'Los Sumatorias', away: 'Los Secanucas', zone: 'A' },
      { cancha: 2, home: 'Angry Kirk',     away: '67 Maquinas',   zone: 'B' },
    ],
  },
  {
    time: '09:00 – 09:30',
    matches: [
      { cancha: 1, home: 'Planeta Thcia',  away: 'Los Sumatorias',zone: 'A' },
      { cancha: 2, home: 'Milanesa',       away: 'La changuita',  zone: 'C' },
    ],
  },
  {
    time: '09:30 – 10:00',
    matches: [
      { cancha: 1, home: 'Palangana',      away: 'Los Secanucas', zone: 'A' },
      { cancha: 2, home: 'La mastur',      away: '67 Maquinas',   zone: 'B' },
    ],
  },
  {
    time: '10:00 – 10:30',
    matches: [
      { cancha: 1, home: 'El suplantaso',  away: 'Milanesa',      zone: 'C' },
      { cancha: 2, home: 'Los +capitos',   away: 'Angry Kirk',    zone: 'B' },
    ],
  },
  {
    time: '10:30 – 11:00',
    matches: [
      { cancha: 1, home: 'Planeta Thcia',  away: 'Los Secanucas', zone: 'A' },
      { cancha: 2, home: 'Los Sumatorias', away: 'Palangana',     zone: 'A' },
    ],
  },
  {
    time: '11:00 – 11:30',
    matches: [
      { cancha: 1, home: 'La mastur',      away: 'Angry Kirk',    zone: 'B' },
      { cancha: 2, home: 'Los +capitos',   away: '67 Maquinas',   zone: 'B' },
    ],
  },
  {
    time: '11:30 – 12:00',
    matches: [
      { cancha: 1, home: 'El suplantaso',  away: 'La changuita',  zone: 'C' },
      { cancha: 2, home: null,             away: null,            zone: null },
    ],
  },
];

const FINALS: (ScheduleSlot & { label: string })[] = [
  {
    time: '12:00 – 12:20',
    label: 'Repechaje',
    matches: [
      { cancha: 1, home: '2º Zona C', away: 'Mejor 2º (A o B)', zone: null },
    ],
  },
  {
    time: '12:20 – 12:55',
    label: 'Semifinales',
    matches: [
      { cancha: 1, home: '1º Zona B', away: 'Ganador Repechaje', zone: null },
      { cancha: 2, home: '1º Zona C', away: '1º Zona A',         zone: null },
    ],
  },
  {
    time: '12:55 – 13:35',
    label: '🏆 Gran Final',
    matches: [
      { cancha: 1, home: 'Ganador Semi 1', away: 'Ganador Semi 2', zone: null },
    ],
  },
];

const ZONE_BADGE: Record<string, string> = {
  A: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  B: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  C: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
};

function findMatch(pool: Match[], home: string | null, away: string | null): Match | undefined {
  if (!home || !away) return undefined;
  return pool.find(
    (m) =>
      (m.home_team === home && m.away_team === away) ||
      (m.home_team === away && m.away_team === home)
  );
}

interface Props { matches: Match[]; isAdmin: boolean; isOffline: boolean; }

export default function ScheduledFixture({ matches, isAdmin, isOffline }: Props) {
  const groupMatches = matches.filter((m) => m.phase === 'group');
  const knockoutMatches = matches.filter((m) => m.phase !== 'group');

  return (
    <div className="space-y-3">

      {/* ── Fase de Grupos ──────────────────────────────────────── */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
        Fase de Grupos · 2 canchas simultáneas · Miércoles 13 de Mayo
      </p>

      {SCHEDULE.map((slot) => (
        <div key={slot.time} className="rounded-xl border border-gray-700 overflow-hidden">
          <div className="bg-gray-800 px-3 py-2 flex items-center gap-2 border-b border-gray-700/60">
            <span className="text-sm">🕐</span>
            <span className="text-xs font-bold text-gray-200">{slot.time}</span>
          </div>
          <div className="divide-y divide-gray-700/50">
            {slot.matches.map((entry) => {
              const match = findMatch(groupMatches, entry.home, entry.away);
              return (
                <div key={entry.cancha} className="px-3 py-2.5 bg-gray-800/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-500">Cancha {entry.cancha}</span>
                    {entry.zone && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${ZONE_BADGE[entry.zone]}`}>
                        Zona {entry.zone}
                      </span>
                    )}
                  </div>
                  {match ? (
                    <MatchCard match={match} isAdmin={isAdmin} isOffline={isOffline} />
                  ) : entry.home ? (
                    <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 px-3 py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-300 font-medium truncate">{entry.home}</span>
                      <span className="text-gray-500 text-sm px-2">vs</span>
                      <span className="text-sm text-gray-300 font-medium truncate text-right">{entry.away}</span>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 px-3 py-2.5">
                      <span className="text-xs text-gray-600 italic">Libre — preparar planillas</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Fase Final ──────────────────────────────────────────── */}
      <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mt-5 mb-1">
        Fase Final · Eliminación directa
      </p>

      {FINALS.map((slot) => {
        const isFinal = slot.label.includes('Final');
        const isRepechaje = slot.label === 'Repechaje';
        const borderColor = isFinal
          ? 'border-yellow-600/50'
          : isRepechaje
          ? 'border-orange-600/40'
          : 'border-purple-600/30';
        const headerBg = isFinal
          ? 'bg-yellow-900/30 border-yellow-700/30'
          : isRepechaje
          ? 'bg-orange-900/20 border-orange-700/30'
          : 'bg-purple-900/20 border-purple-700/30';
        const labelColor = isFinal
          ? 'text-yellow-400'
          : isRepechaje
          ? 'text-orange-400'
          : 'text-purple-400';

        return (
          <div key={slot.time} className={`rounded-xl border overflow-hidden ${borderColor}`}>
            <div className={`px-3 py-2 flex items-center justify-between border-b ${headerBg}`}>
              <span className="text-xs font-bold text-gray-300">🕐 {slot.time}</span>
              <span className={`text-xs font-bold ${labelColor}`}>{slot.label}</span>
            </div>
            <div className={`divide-y ${isRepechaje ? 'divide-orange-900/30' : isFinal ? 'divide-yellow-900/30' : 'divide-purple-900/30'}`}>
              {slot.matches.map((entry) => {
                const match = findMatch(knockoutMatches, entry.home, entry.away);
                return (
                  <div key={entry.cancha} className={`px-3 py-2.5 ${isFinal ? 'bg-yellow-900/10' : isRepechaje ? 'bg-orange-900/10' : 'bg-purple-900/10'}`}>
                    {slot.matches.length > 1 && (
                      <p className="text-xs font-bold text-gray-500 mb-2">Cancha {entry.cancha}</p>
                    )}
                    {match ? (
                      <MatchCard match={match} isAdmin={isAdmin} isOffline={isOffline} />
                    ) : (
                      <div className={`rounded-xl border px-3 py-3 flex items-center justify-between ${isFinal ? 'border-yellow-700/30 bg-yellow-900/10' : isRepechaje ? 'border-orange-700/30 bg-orange-900/10' : 'border-purple-700/30 bg-purple-900/10'}`}>
                        <span className="text-sm text-gray-300/70 font-medium truncate">{entry.home}</span>
                        <span className="text-gray-600 text-sm px-2">vs</span>
                        <span className="text-sm text-gray-300/70 font-medium truncate text-right">{entry.away}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
