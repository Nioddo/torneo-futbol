'use client';

import { Match } from '@/types';
import MatchCard from './MatchCard';

interface Props {
  matches: Match[];
  isAdmin: boolean;
  isOffline?: boolean;
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

export default function BracketView({ matches, isAdmin, isOffline = false }: Props) {
  const repechaje = matches.find((m) => m.phase === 'repechaje');
  const semis = matches.filter((m) => m.phase === 'semi');
  const final = matches.find((m) => m.phase === 'final');

  const semi1 = semis[0]; // 1º B vs Ganador Repechaje
  const semi2 = semis[1]; // 1º C vs 1º A

  return (
    <div className="space-y-7">

      {/* Repechaje */}
      <PhaseBlock
        label="Repechaje (Play-in)"
        sublabel="El ganador va a Semifinal 1"
        color="bg-orange-500"
      >
        <MatchSlot match={repechaje} isAdmin={isAdmin} isOffline={isOffline} label="Repechaje" />
      </PhaseBlock>

      {/* Semifinales */}
      <PhaseBlock label="Semifinales" color="bg-purple-500">
        <MatchSlot match={semi1} isAdmin={isAdmin} isOffline={isOffline} label="Semi 1 — 1º Zona B vs Ganador Repechaje" />
        <MatchSlot match={semi2} isAdmin={isAdmin} isOffline={isOffline} label="Semi 2 — 1º Zona C vs 1º Zona A" />
      </PhaseBlock>

      {/* Final */}
      <PhaseBlock label="Gran Final 🏆" color="bg-yellow-500">
        {final ? (
          <MatchSlot match={final} isAdmin={isAdmin} isOffline={isOffline} label="Final" />
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">A definir luego de las semis</p>
        )}
      </PhaseBlock>

      {/* Explicación del cuadro */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/40 p-4 space-y-3">
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
        <p className="text-xs text-gray-500 pt-1">
          Desempate: Puntos → Dif. de Goles → Goles a Favor
        </p>
      </div>
    </div>
  );
}
