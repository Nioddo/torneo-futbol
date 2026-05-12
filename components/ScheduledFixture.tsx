'use client';

import { Match, TeamStanding } from '@/types';
import MatchCard from './MatchCard';

interface SlotEntry {
  cancha: number;
  home: string;
  away: string;
  zone: string;
}
interface ScheduleSlot { time: string; matches: SlotEntry[]; }

// ─────────────────────────────────────────────────────────────────
// FIXTURE — Miércoles 13 · Canchas 1 y 2
// Zona A: Planeta Thcia, Los Sumatorias, Palangana
// Zona B: La mastur, Los +capitos, Angry Kirk
// Zona C: Milanesa, Los Secanucas, 67 Maquinas
// Zona D: El suplantaso, La changuita, Kingnasir
// ─────────────────────────────────────────────────────────────────
const SCHEDULE: ScheduleSlot[] = [
  {
    time: '08:10 – 08:35',
    matches: [
      { cancha: 1, home: 'Planeta Thcia',  away: 'Los Sumatorias', zone: 'A' },
      { cancha: 2, home: 'La mastur',       away: 'Los +capitos',   zone: 'B' },
    ],
  },
  {
    time: '08:35 – 09:00',
    matches: [
      { cancha: 1, home: 'Milanesa',        away: 'Los Secanucas',  zone: 'C' },
      { cancha: 2, home: 'El suplantaso',   away: 'La changuita',   zone: 'D' },
    ],
  },
  {
    time: '09:00 – 09:25',
    matches: [
      { cancha: 1, home: 'Planeta Thcia',  away: 'Palangana',       zone: 'A' },
      { cancha: 2, home: 'La mastur',       away: 'Angry Kirk',     zone: 'B' },
    ],
  },
  {
    time: '09:25 – 09:50',
    matches: [
      { cancha: 1, home: 'Milanesa',        away: '67 Maquinas',    zone: 'C' },
      { cancha: 2, home: 'El suplantaso',   away: 'Kingnasir',      zone: 'D' },
    ],
  },
  {
    time: '09:50 – 10:15',
    matches: [
      { cancha: 1, home: 'Los Sumatorias', away: 'Palangana',       zone: 'A' },
      { cancha: 2, home: 'Los +capitos',   away: 'Angry Kirk',      zone: 'B' },
    ],
  },
  {
    time: '10:15 – 10:40',
    matches: [
      { cancha: 1, home: 'Los Secanucas',  away: '67 Maquinas',     zone: 'C' },
      { cancha: 2, home: 'La changuita',   away: 'Kingnasir',       zone: 'D' },
    ],
  },
];

const ZONE_BADGE: Record<string, string> = {
  A: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  B: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  C: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  D: 'text-green-400 bg-green-500/10 border-green-500/30',
};

function findMatch(pool: Match[], home: string, away: string): Match | undefined {
  return pool.find(
    (m) =>
      (m.home_team === home && m.away_team === away) ||
      (m.home_team === away && m.away_team === home)
  );
}

function getWinner(m: Match | undefined, homeReal?: string, awayReal?: string): string | undefined {
  if (!m?.played) return undefined;
  const hg = m.home_goals ?? 0;
  const ag = m.away_goals ?? 0;
  const hp = m.home_penalties;
  const ap = m.away_penalties;
  const homeWon = hg > ag || (hg === ag && hp != null && ap != null && hp > ap);
  if (homeWon) return homeReal ?? m.home_team;
  return awayReal ?? m.away_team;
}

// ── Slot de fase eliminatoria ────────────────────────────────────
function KnockoutSlot({
  label,
  labelColor,
  borderColor,
  headerBg,
  time,
  matches: slots,
  isAdmin,
  isOffline,
}: {
  label: string;
  labelColor: string;
  borderColor: string;
  headerBg: string;
  time: string;
  matches: { cancha: number; home: string | undefined; away: string | undefined; match: Match | undefined }[];  isAdmin: boolean;
  isOffline: boolean;
}) {
  return (
    <div className={`rounded-xl border overflow-hidden ${borderColor}`}>
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
            <div className="flex items-center justify-between gap-2 mb-2 px-1">
              <span className={`text-xs font-semibold truncate ${s.home ? 'text-gray-200' : 'text-gray-600 italic'}`}>
                {s.home ?? 'A definir…'}
              </span>
              <span className="text-gray-600 text-xs shrink-0 font-bold">vs</span>
              <span className={`text-xs font-semibold truncate text-right ${s.away ? 'text-gray-200' : 'text-gray-600 italic'}`}>
                {s.away ?? 'A definir…'}
              </span>
            </div>
            {s.match ? (
              <MatchCard match={s.match} isAdmin={isAdmin} isOffline={isOffline} homeTeamOverride={s.home} awayTeamOverride={s.away} />
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
  standingsD: TeamStanding[];
}

export default function ScheduledFixture({
  matches,
  isAdmin,
  isOffline,
  standingsA,
  standingsB,
  standingsC,
  standingsD,
}: Props) {
  const groupMatches = matches.filter((m) => m.phase === 'group');
  const quarters     = matches.filter((m) => m.phase === 'quarter');
  const semis        = matches.filter((m) => m.phase === 'semi');
  const finalMatch   = matches.find((m) => m.phase === 'final');

  // Nombres reales desde standings
  const first_A  = standingsA[0]?.team;
  const second_A = standingsA[1]?.team;
  const first_B  = standingsB[0]?.team;
  const second_B = standingsB[1]?.team;
  const first_C  = standingsC[0]?.team;
  const second_C = standingsC[1]?.team;
  const first_D  = standingsD[0]?.team;
  const second_D = standingsD[1]?.team;

  // Ganadores de cuartos
  const ganQ1 = getWinner(quarters[0], first_A, second_B);
  const ganQ2 = getWinner(quarters[1], first_B, second_A);
  const ganQ3 = getWinner(quarters[2], first_C, second_D);
  const ganQ4 = getWinner(quarters[3], first_D, second_C);

  // Ganadores de semis
  const ganSemi1 = getWinner(semis[0], ganQ1, ganQ3);
  const ganSemi2 = getWinner(semis[1], ganQ2, ganQ4);

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
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${ZONE_BADGE[entry.zone]}`}>
                      Zona {entry.zone}
                    </span>
                  </div>
                  {match ? (
                    <MatchCard match={match} isAdmin={isAdmin} isOffline={isOffline} />
                  ) : (
                    <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 px-3 py-3 flex items-center justify-between">
                      <span className="text-sm text-gray-300 font-medium truncate">{entry.home}</span>
                      <span className="text-gray-500 text-sm px-2">vs</span>
                      <span className="text-sm text-gray-300 font-medium truncate text-right">{entry.away}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── FASE ELIMINATORIA ───────────────────────────────────── */}
      <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mt-5 mb-1">
        Fase Eliminatoria · Miércoles 13 de Mayo
      </p>

      {/* CUARTOS — TURNO 1 */}
      <KnockoutSlot
        label="⚔️ Cuartos · Turno 1"
        labelColor="text-cyan-400"
        borderColor="border-cyan-600/30"
        headerBg="bg-cyan-900/20 border-cyan-700/30"
        time="10:45 – 11:20"
        matches={[
          { cancha: 1, home: first_A,  away: second_B, match: quarters[0] },
          { cancha: 2, home: first_B,  away: second_A, match: quarters[1] },
        ]}
        isAdmin={isAdmin}
        isOffline={isOffline}
      />

      {/* CUARTOS — TURNO 2 */}
      <KnockoutSlot
        label="⚔️ Cuartos · Turno 2"
        labelColor="text-cyan-400"
        borderColor="border-cyan-600/30"
        headerBg="bg-cyan-900/20 border-cyan-700/30"
        time="11:20 – 11:55"
        matches={[
          { cancha: 1, home: first_C,  away: second_D, match: quarters[2] },
          { cancha: 2, home: first_D,  away: second_C, match: quarters[3] },
        ]}
        isAdmin={isAdmin}
        isOffline={isOffline}
      />

      {/* SEMIFINALES */}
      <KnockoutSlot
        label="🟣 Semifinales"
        labelColor="text-purple-400"
        borderColor="border-purple-600/30"
        headerBg="bg-purple-900/20 border-purple-700/30"
        time="12:00 – 12:35"
        matches={[
          { cancha: 1, home: ganQ1, away: ganQ3, match: semis[0] },
          { cancha: 2, home: ganQ2, away: ganQ4, match: semis[1] },
        ]}
        isAdmin={isAdmin}
        isOffline={isOffline}
      />

      {/* GRAN FINAL */}
      <KnockoutSlot
        label="🏆 Gran Final"
        labelColor="text-yellow-400"
        borderColor="border-yellow-600/50"
        headerBg="bg-yellow-900/30 border-yellow-700/30"
        time="12:35 – 13:15"
        matches={[
          { cancha: 1, home: ganSemi1, away: ganSemi2, match: finalMatch },
        ]}
        isAdmin={isAdmin}
        isOffline={isOffline}
      />

    </div>
  );
}
