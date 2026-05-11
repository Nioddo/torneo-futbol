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
  best2nd: TeamStanding | null;
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
}: {
  match: Match | undefined;
  isAdmin: boolean;
  isOffline: boolean;
  label: string;
}) {
  if (!match) return null;
  return (
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1.5 px-1">
        {label}
      </p>
      <MatchCard match={match} isAdmin={isAdmin} isOffline={isOffline} />
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
  best2nd,
}: Props) {
  const repechaje = matches.find((m) => m.phase === 'repechaje');
  const semis = matches.filter((m) => m.phase === 'semi');
  const final = matches.find((m) => m.phase === 'final');

  const semi1 = semis[0];
  const semi2 = semis[1];

  // ── Nombres reales según standings actuales ──────────────────────
  const first_A = standingsA[0]?.team;
  const first_B = standingsB[0]?.team;
  const first_C = standingsC[0]?.team;
  const second_C = standingsC[1]?.team;
  const best2ndTeam = best2nd?.team;

  // Ganadores de repechaje y semis (si ya se jugaron)
  const ganRepechaje = (() => {
    if (!repechaje?.played) return undefined;
    const hg = repechaje.home_goals ?? 0;
    const ag = repechaje.away_goals ?? 0;
    const hp = repechaje.home_penalties;
    const ap = repechaje.away_penalties;
    if (hg > ag || (hg === ag && hp != null && ap != null && hp > ap)) return repechaje.home_team;
    return repechaje.away_team;
  })();

  const ganSemi1 = (() => {
    if (!semi1?.played) return undefined;
    const hg = semi1.home_goals ?? 0;
    const ag = semi1.away_goals ?? 0;
    const hp = semi1.home_penalties;
    const ap = semi1.away_penalties;
    if (hg > ag || (hg === ag && hp != null && ap != null && hp > ap)) return semi1.home_team;
    return semi1.away_team;
  })();

  const ganSemi2 = (() => {
    if (!semi2?.played) return undefined;
    const hg = semi2.home_goals ?? 0;
    const ag = semi2.away_goals ?? 0;
    const hp = semi2.home_penalties;
    const ap = semi2.away_penalties;
    if (hg > ag || (hg === ag && hp != null && ap != null && hp > ap)) return semi2.home_team;
    return semi2.away_team;
  })();

  return (
    <div className="space-y-7">

      {/* ── REPECHAJE ─────────────────────────────────────────────── */}
      <PhaseBlock
        label="Repechaje (Play-in)"
        sublabel="El ganador va a Semifinal 1"
        color="bg-orange-500"
      >
        {/* Chips con nombres reales */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
          <TeamChip team={second_C}   label="2º Zona C"        color="bg-orange-400" />
          <TeamChip team={best2ndTeam} label="Mejor 2º (A o B)" color="bg-orange-400" />
        </div>
        <MatchSlot match={repechaje} isAdmin={isAdmin} isOffline={isOffline} label="Partido" />
      </PhaseBlock>

      {/* ── SEMIFINALES ───────────────────────────────────────────── */}
      <PhaseBlock label="Semifinales" color="bg-purple-500">
        {/* Semi 1 */}
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-1">
            Semi 1
          </p>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
            <TeamChip team={first_B}      label="1º Zona B"          color="bg-purple-400" />
            <TeamChip team={ganRepechaje} label="Ganador Repechaje"  color="bg-orange-400" pending={!ganRepechaje} />
          </div>
          <MatchSlot match={semi1} isAdmin={isAdmin} isOffline={isOffline} label="Partido" />
        </div>

        {/* Semi 2 */}
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-1">
            Semi 2
          </p>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 space-y-2 mb-2">
            <TeamChip team={first_C} label="1º Zona C" color="bg-orange-400" />
            <TeamChip team={first_A} label="1º Zona A" color="bg-blue-400" />
          </div>
          <MatchSlot match={semi2} isAdmin={isAdmin} isOffline={isOffline} label="Partido" />
        </div>
      </PhaseBlock>

      {/* ── GRAN FINAL ────────────────────────────────────────────── */}
      <PhaseBlock label="Gran Final 🏆" color="bg-yellow-500">
        <div className="bg-gray-800/50 border border-yellow-700/30 rounded-xl px-4 py-3 space-y-2 mb-2">
          <TeamChip team={ganSemi1} label="Ganador Semi 1" color="bg-yellow-400" pending={!ganSemi1} />
          <TeamChip team={ganSemi2} label="Ganador Semi 2" color="bg-yellow-400" pending={!ganSemi2} />
        </div>
        <MatchSlot match={final} isAdmin={isAdmin} isOffline={isOffline} label="Partido" />
      </PhaseBlock>

      {/* ── Info estructura ───────────────────────────────────────── */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-4 space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Estructura de llaves</p>
        <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">Repechaje:</strong> 2º Zona C vs Mejor 2º (entre 2º Zona A y 2º Zona B)</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">Semi 1:</strong> 1º Zona B vs Ganador Repechaje</span>
          </div>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0" />
            <span><strong className="text-gray-200">Semi 2:</strong> 1º Zona C vs 1º Zona A</span>
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
