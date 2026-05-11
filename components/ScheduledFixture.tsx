'use client';

import { Match, TeamStanding } from '@/types';
import MatchCard from './MatchCard';

interface SlotEntry {
  cancha: number;
  home: string | null;
  away: string | null;
  zone: string | null;
}
interface ScheduleSlot { time: string; matches: SlotEntry[]; }

const SCHEDULE: ScheduleSlot[] = [
  {
    time: '08:00 – 08:30',
    matches: [
      { cancha: 1, home: 'Planeta Thcia',  away: 'Palangana',      zone: 'A' },
      { cancha: 2, home: 'La mastur',       away: 'Los +capitos',   zone: 'B' },
    ],
  },
  {
    time: '08:30 – 09:00',
    matches: [
      { cancha: 1, home: 'Los Sumatorias', away: 'Los Secanucas',  zone: 'A' },
      { cancha: 2, home: 'Angry Kirk',     away: '67 Maquinas',    zone: 'B' },
    ],
  },
  {
    time: '09:00 – 09:30',
    matches: [
      { cancha: 1, home: 'Planeta Thcia',  away: 'Los Sumatorias', zone: 'A' },
      { cancha: 2, home: 'Milanesa',       away: 'La changuita',   zone: 'C' },
    ],
  },
  {
    time: '09:30 – 10:00',
    matches: [
      { cancha: 1, home: 'Palangana',      away: 'Los Secanucas',  zone: 'A' },
      { cancha: 2, home: 'La mastur',      away: '67 Maquinas',    zone: 'B' },
    ],
  },
  {
    time: '10:00 – 10:30',
    matches: [
      { cancha: 1, home: 'El suplantaso',  away: 'Milanesa',       zone: 'C' },
      { cancha: 2, home: 'Los +capitos',   away: 'Angry Kirk',     zone: 'B' },
    ],
  },
  {
    time: '10:30 – 11:00',
    matches: [
      { cancha: 1, home: 'Planeta Thcia',  away: 'Los Secanucas',  zone: 'A' },
      { cancha: 2, home: 'Los Sumatorias', away: 'Palangana',      zone: 'A' },
    ],
  },
  {
    time: '11:00 – 11:30',
    matches: [
      { cancha: 1, home: 'La mastur',      away: 'Angry Kirk',     zone: 'B' },
      { cancha: 2, home: 'Los +capitos',   away: '67 Maquinas',    zone: 'B' },
    ],
  },
  {
    time: '11:30 – 12:00',
    matches: [
      { cancha: 1, home: 'El suplantaso',  away: 'La changuita',   zone: 'C' },
      { cancha: 2, home: null,             away: null,             zone: null },
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

function getWinner(m: Match | undefined): string | undefined {
  if (!m?.played) return undefined;
  const hg = m.home_goals ?? 0;
  const ag = m.away_goals ?? 0;
  const hp = m.home_penalties;
  const ap = m.away_penalties;
  if (hg > ag || (hg === ag && hp != null && ap != null && hp > ap)) return m.home_team;
  return m.away_team;
}

// Muestra el matchup de una fase final con nombres reales o placeholders
function KnockoutSlot({
  label,
  labelColor,
  borderColor,
  headerBg,
  time,
  cancha1Home,
  cancha1Away,
  cancha2Home,
  cancha2Away,
  match1,
  match2,
  isAdmin,
  isOffline,
}: {
  label: string;
  labelColor: string;
  borderColor: string;
  headerBg: string;
  time: string;
  cancha1Home: string | undefined;
  cancha1Away: string | undefined;
  cancha2Home?: string | undefined;
  cancha2Away?: string | undefined;
  match1: Match | undefined;
  match2?: Match | undefined;
  isAdmin: boolean;
  isOffline: boolean;
}) {
  const slots = [
    { cancha: 1, home: cancha1Home, away: cancha1Away, match: match1 },
    ...(cancha2Home !== undefined
      ? [{ cancha: 2, home: cancha2Home, away: cancha2Away, match: match2 }]
      : []),
  ];

  return (
    <div className={`rounded-xl border overflow-hidden ${borderColor}`}>
      {/* Header */}
      <div className={`px-3 py-2 flex items-center justify-between border-b ${headerBg}`}>
        <span className="text-xs font-bold text-gray-300">🕐 {time}</span>
        <span className={`text-xs font-bold ${labelColor}`}>{label}</span>
      </div>

      <div className="divide-y divide-gray-700/30">
        {slots.map((s) => (
          <div key={s.cancha} className="px-3 py-2.5 bg-gray-800/20">
            {slots.length > 1 && (
              <p className="text-xs font-bold text-gray-600 mb-2">Cancha {s.cancha}</p>
            )}

            {/* Matchup preview — siempre visible */}
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <span className={`text-xs font-semibold truncate ${s.home ? 'text-gray-200' : 'text-gray-600 italic'}`}>
                {s.home ?? 'A definir…'}
              </span>
              <span className="text-gray-600 text-xs shrink-0 font-bold">vs</span>
              <span className={`text-xs font-semibold truncate text-right ${s.away ? 'text-gray-200' : 'text-gray-600 italic'}`}>
                {s.away ?? 'A definir…'}
              </span>
            </div>

            {/* Tarjeta del partido (si existe en DB) */}
            {s.match ? (
              <MatchCard match={s.match} isAdmin={isAdmin} isOffline={isOffline} />
            ) : (
              <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 px-3 py-2 text-center">
                <span className="text-xs text-gray-600 italic">Partido no disponible aún</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  matches: Match[];
  isAdmin: boolean;
  isOffline: boolean;
  standingsA: TeamStanding[];
  standingsB: TeamStanding[];
  standingsC: TeamStanding[];
  best2nd: TeamStanding | null;
}

export default function ScheduledFixture({
  matches,
  isAdmin,
  isOffline,
  standingsA,
  standingsB,
  standingsC,
  best2nd,
}: Props) {
  const groupMatches = matches.filter((m) => m.phase === 'group');
  const repechajeMatch = matches.find((m) => m.phase === 'repechaje');
  const semis = matches.filter((m) => m.phase === 'semi');
  const finalMatch = matches.find((m) => m.phase === 'final');

  // ── Nombres reales desde standings ────────────────────────────────
  const first_A   = standingsA[0]?.team;
  const first_B   = standingsB[0]?.team;
  const first_C   = standingsC[0]?.team;
  const second_C  = standingsC[1]?.team;
  const best2ndTeam = best2nd?.team;

  const ganRepechaje = getWinner(repechajeMatch);
  const ganSemi1     = getWinner(semis[0]);
  const ganSemi2     = getWinner(semis[1]);

  return (
    <div className="space-y-3">

      {/* ── FASE DE GRUPOS ──────────────────────────────────────── */}
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

      {/* ── FASE FINAL ──────────────────────────────────────────── */}
      <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mt-5 mb-1">
        Fase Final · Eliminación directa
      </p>

      {/* REPECHAJE */}
      <KnockoutSlot
        label="⚡ Repechaje"
        labelColor="text-orange-400"
        borderColor="border-orange-600/40"
        headerBg="bg-orange-900/20 border-orange-700/30"
        time="12:00 – 12:20"
        cancha1Home={second_C}
        cancha1Away={best2ndTeam}
        match1={repechajeMatch}
        isAdmin={isAdmin}
        isOffline={isOffline}
      />

      {/* SEMIFINALES */}
      <KnockoutSlot
        label="🟣 Semifinales"
        labelColor="text-purple-400"
        borderColor="border-purple-600/30"
        headerBg="bg-purple-900/20 border-purple-700/30"
        time="12:20 – 12:55"
        cancha1Home={first_B}
        cancha1Away={ganRepechaje}
        cancha2Home={first_C}
        cancha2Away={first_A}
        match1={semis[0]}
        match2={semis[1]}
        isAdmin={isAdmin}
        isOffline={isOffline}
      />

      {/* GRAN FINAL */}
      <KnockoutSlot
        label="🏆 Gran Final"
        labelColor="text-yellow-400"
        borderColor="border-yellow-600/50"
        headerBg="bg-yellow-900/30 border-yellow-700/30"
        time="12:55 – 13:35"
        cancha1Home={ganSemi1}
        cancha1Away={ganSemi2}
        match1={finalMatch}
        isAdmin={isAdmin}
        isOffline={isOffline}
      />

    </div>
  );
}
