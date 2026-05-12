'use client';

import { Match, TeamStanding } from '@/types';
import MatchCard from './MatchCard';

interface Props {
  matches: Match[];
  isAdmin: boolean;
  isOffline?: boolean;
  standingsA: TeamStanding[];
  standingsB: TeamStanding[];
  standingsC: TeamStanding[];
  standingsD: TeamStanding[];
}

function PhaseBlock({
  label,
  sublabel,
  color,
  children,
}: {
  label: string;
  sublabel?: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`inline-block w-2 h-5 rounded-full ${color}`} />
        <div>
          <h3 className="text-base font-bold text-gray-200 leading-tight">{label}</h3>
          {sublabel && <p className="text-xs text-gray-500">{sublabel}</p>}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function MatchSlot({
  match,
  isAdmin,
  isOffline,
  label,
  homeTeamOverride,
  awayTeamOverride,
}: {
  match: Match | undefined;
  isAdmin: boolean;
  isOffline: boolean;
  label: string;
  homeTeamOverride?: string;
  awayTeamOverride?: string;
}) {
  if (!match) return null;
  return (
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 px-1">
        {label}
      </p>
      <MatchCard match={match} isAdmin={isAdmin} isOffline={isOffline} homeTeamOverride={homeTeamOverride} awayTeamOverride={awayTeamOverride} />
    </div>
  );
}

// Chip de equipo con su estado
function TeamChip({
  team,
  label,
  color,
  pending,
}: {
  team: string | undefined;
  label: string;
  color: string;
  pending?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full shrink-0 ${pending ? 'bg-gray-600' : color}`} />
      <span className="text-xs text-gray-400">{label}:</span>
      {team ? (
        <span className={`text-xs font-bold ${pending ? 'text-gray-500' : 'text-white'}`}>
          {team}
        </span>
      ) : (
        <span className="text-xs text-gray-600 italic">A definir…</span>
      )}
    </div>
  );
}

export default function BracketView({
  matches,
  isAdmin,
  isOffline = false,
  standingsA,
  standingsB,
  standingsC,
  standingsD,
}: Props) {
  const quarters = matches.filter((m) => m.phase === 'quarter');
  const semis    = matches.filter((m) => m.phase === 'semi');
  const final    = matches.find((m) => m.phase === 'final');

  const q1 = quarters[0];
  const q2 = quarters[1];
  const q3 = quarters[2];
  const q4 = quarters[3];
  const semi1 = semis[0];
  const semi2 = semis[1];

  // Nombres reales desde standings
  const first_A  = standingsA[0]?.team;
  const second_A = standingsA[1]?.team;
  const first_B  = standingsB[0]?.team;
  const second_B = standingsB[1]?.team;
  const first_C  = standingsC[0]?.team;
  const second_C = standingsC[1]?.team;
  const first_D  = standingsD[0]?.team;
  const second_D = standingsD[1]?.team;

  function getWinner(m: Match | undefined): string | undefined {
    if (!m?.played) return undefined;
    const hg = m.home_goals ?? 0;
    const ag = m.away_goals ?? 0;
    const hp = m.home_penalties;
    const ap = m.away_penalties;
    if (hg > ag || (hg === ag && hp != null && ap != null && hp > ap)) return m.home_team;
    return m.away_team;
  }

  const ganQ1    = getWinner(q1);
  const ganQ2    = getWinner(q2);
  const ganQ3    = getWinner(q3);
  const ganQ4    = getWinner(q4);
  const ganSemi1 = getWinner(semi1);
  const ganSemi2 = getWinner(semi2);

  return (
    <div className="space-y-7">

      {/* ── CUARTOS DE FINAL ─────────────────────────────────────── */}
      <PhaseBlock label="Cuartos de Final" sublabel="Turno 1 · 10:45 – 11:20" color="bg-cyan-500">
        {/* C1 */}
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-1">C1 · Cancha 1</p>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
            <TeamChip team={first_A}  label="1º Zona A" color="bg-blue-400" />
            <TeamChip team={second_B} label="2º Zona B" color="bg-purple-400" pending={!second_B} />
          </div>
          <MatchSlot match={q1} isAdmin={isAdmin} isOffline={isOffline} label="Partido" />
        </div>
        {/* C2 */}
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-1">C2 · Cancha 2</p>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
            <TeamChip team={first_B}  label="1º Zona B" color="bg-purple-400" />
            <TeamChip team={second_A} label="2º Zona A" color="bg-blue-400" pending={!second_A} />
          </div>
          <MatchSlot match={q2} isAdmin={isAdmin} isOffline={isOffline} label="Partido" />
        </div>
      </PhaseBlock>

      <PhaseBlock label="Cuartos de Final" sublabel="Turno 2 · 11:20 – 11:55" color="bg-cyan-500">
        {/* C3 */}
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-1">C3 · Cancha 1</p>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
            <TeamChip team={first_C}  label="1º Zona C" color="bg-orange-400" />
            <TeamChip team={second_D} label="2º Zona D" color="bg-green-400" pending={!second_D} />
          </div>
          <MatchSlot match={q3} isAdmin={isAdmin} isOffline={isOffline} label="Partido" />
        </div>
        {/* C4 */}
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-1">C4 · Cancha 2</p>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
            <TeamChip team={first_D}  label="1º Zona D" color="bg-green-400" />
            <TeamChip team={second_C} label="2º Zona C" color="bg-orange-400" pending={!second_C} />
          </div>
          <MatchSlot match={q4} isAdmin={isAdmin} isOffline={isOffline} label="Partido" />
        </div>
      </PhaseBlock>

      {/* ── SEMIFINALES ───────────────────────────────────────────── */}
      <PhaseBlock label="Semifinales" sublabel="12:00 – 12:35" color="bg-purple-500">
        {/* Semi 1 */}
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-1">Semi 1 · Cancha 1</p>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
            <TeamChip team={ganQ1} label="Ganador C1" color="bg-cyan-400" pending={!ganQ1} />
            <TeamChip team={ganQ3} label="Ganador C3" color="bg-cyan-400" pending={!ganQ3} />
          </div>
          <MatchSlot match={semi1} isAdmin={isAdmin} isOffline={isOffline} label="Partido" homeTeamOverride={ganQ1} awayTeamOverride={ganQ3} />
        </div>
        {/* Semi 2 */}
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-1">Semi 2 · Cancha 2</p>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
            <TeamChip team={ganQ2} label="Ganador C2" color="bg-cyan-400" pending={!ganQ2} />
            <TeamChip team={ganQ4} label="Ganador C4" color="bg-cyan-400" pending={!ganQ4} />
          </div>
          <MatchSlot match={semi2} isAdmin={isAdmin} isOffline={isOffline} label="Partido" homeTeamOverride={ganQ2} awayTeamOverride={ganQ4} />
        </div>
      </PhaseBlock>

      {/* ── GRAN FINAL ────────────────────────────────────────────── */}
      <PhaseBlock label="Gran Final 🏆" sublabel="12:35 – 13:15" color="bg-yellow-500">
        <div className="bg-gray-800/50 border border-yellow-700/30 rounded-xl px-4 py-3 space-y-2 mb-2">
          <TeamChip team={ganSemi1} label="Ganador Semi 1" color="bg-yellow-400" pending={!ganSemi1} />
          <TeamChip team={ganSemi2} label="Ganador Semi 2" color="bg-yellow-400" pending={!ganSemi2} />
        </div>
        <MatchSlot match={final} isAdmin={isAdmin} isOffline={isOffline} label="Partido" homeTeamOverride={ganSemi1} awayTeamOverride={ganSemi2} />
      </PhaseBlock>

      {/* ── Info estructura ───────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-4 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estructura de llaves</p>
        <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">C1:</strong> 1º Zona A vs 2º Zona B</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">C2:</strong> 1º Zona B vs 2º Zona A</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">C3:</strong> 1º Zona C vs 2º Zona D</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">C4:</strong> 1º Zona D vs 2º Zona C</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">Semi 1:</strong> Ganador C1 vs Ganador C3</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">Semi 2:</strong> Ganador C2 vs Ganador C4</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">Final:</strong> Ganador Semi 1 vs Ganador Semi 2</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 pt-1">Desempate: Puntos → Dif. de Goles → Goles a Favor</p>
      </div>

    </div>
  );
}
