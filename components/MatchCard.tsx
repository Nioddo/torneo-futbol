'use client';

import { useState } from 'react';
import { Match } from '@/types';
import { supabase } from '@/lib/supabase';

interface MatchCardProps {
  match: Match;
  isAdmin: boolean;
  isOffline?: boolean;
  onLocalUpdate?: (updated: Match) => void;
  homeTeamOverride?: string;
  awayTeamOverride?: string;
}

export default function MatchCard({ match, isAdmin, isOffline = false, onLocalUpdate, homeTeamOverride, awayTeamOverride }: MatchCardProps) {
  const [localMatch, setLocalMatch] = useState<Match>(match);
  const [homeGoals, setHomeGoals] = useState<string>(
    match.home_goals != null ? String(match.home_goals) : ''
  );
  const [awayGoals, setAwayGoals] = useState<string>(
    match.away_goals != null ? String(match.away_goals) : ''
  );
  const [homePens, setHomePens] = useState<string>(
    match.home_penalties != null ? String(match.home_penalties) : ''
  );
  const [awayPens, setAwayPens] = useState<string>(
    match.away_penalties != null ? String(match.away_penalties) : ''
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const currentMatch = isOffline ? localMatch : match;

  const isDraw =
    currentMatch.phase !== 'group' &&
    homeGoals !== '' &&
    awayGoals !== '' &&
    homeGoals === awayGoals;

  const showPenalties = isDraw && currentMatch.phase !== 'group';

  async function handleSave() {
    if (homeGoals === '' || awayGoals === '') return;
    setSaving(true);

    const payload: Partial<Match> = {
      home_goals: parseInt(homeGoals),
      away_goals: parseInt(awayGoals),
      played: true,
      home_penalties: showPenalties && homePens !== '' ? parseInt(homePens) : null,
      away_penalties: showPenalties && awayPens !== '' ? parseInt(awayPens) : null,
    };

    if (isOffline) {
      const updated = { ...localMatch, ...payload } as Match;
      setLocalMatch(updated);
      onLocalUpdate?.(updated);
    } else {
      await supabase.from('matches').update(payload).eq('id', match.id);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }

    setClearing(true);
    setConfirmClear(false);

    const payload: Partial<Match> = {
      home_goals: null,
      away_goals: null,
      home_penalties: null,
      away_penalties: null,
      played: false,
    };

    if (isOffline) {
      const updated = { ...localMatch, ...payload } as Match;
      setLocalMatch(updated);
      onLocalUpdate?.(updated);
    } else {
      await supabase.from('matches').update(payload).eq('id', match.id);
    }

    setHomeGoals('');
    setAwayGoals('');
    setHomePens('');
    setAwayPens('');
    setClearing(false);
  }

  const hg = currentMatch.home_goals;
  const ag = currentMatch.away_goals;
  const hp = currentMatch.home_penalties;
  const ap = currentMatch.away_penalties;
  const played = isOffline ? localMatch.played : currentMatch.played;

  const homeWon =
    played && hg != null && ag != null &&
    (hg > ag || (hp != null && ap != null && hp > ap));

  const awayWon =
    played && hg != null && ag != null &&
    (ag > hg || (hp != null && ap != null && ap > hp));

  return (
    <div
      className={`rounded-xl border transition-colors ${
        played ? 'bg-gray-800/60 border-gray-700' : 'bg-gray-800/30 border-gray-700/50'
      } overflow-hidden`}
    >
      {/* Resultado */}
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${homeWon ? 'text-green-400' : 'text-gray-200'}`}>
            {homeTeamOverride ?? currentMatch.home_team}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {played ? (
            <>
              <span className={`text-xl font-black w-8 text-center ${homeWon ? 'text-green-400' : 'text-gray-100'}`}>
                {isOffline ? localMatch.home_goals : hg}
              </span>
              <span className="text-gray-500 text-lg font-bold">-</span>
              <span className={`text-xl font-black w-8 text-center ${awayWon ? 'text-green-400' : 'text-gray-100'}`}>
                {isOffline ? localMatch.away_goals : ag}
              </span>
              {hp != null && (
                <span className="text-xs text-yellow-400 ml-1">({hp}-{ap}) pen.</span>
              )}
            </>
          ) : (
            <span className="text-gray-500 text-sm font-medium px-2">vs</span>
          )}
        </div>

        <div className="flex-1 min-w-0 text-right">
          <p className={`text-sm font-semibold truncate ${awayWon ? 'text-green-400' : 'text-gray-200'}`}>
            {awayTeamOverride ?? currentMatch.away_team}
          </p>
        </div>
      </div>

      {/* Panel Admin */}
      {isAdmin && (
        <div className="border-t border-gray-700/60 bg-gray-900/50 px-3 py-3 space-y-2">
          {/* Inputs de goles */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={homeGoals}
              onChange={(e) => setHomeGoals(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-center text-lg font-bold focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <span className="text-gray-500 font-bold shrink-0">—</span>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={awayGoals}
              onChange={(e) => setAwayGoals(e.target.value)}
              placeholder="0"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-center text-lg font-bold focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Penales */}
          {showPenalties && (
            <div className="space-y-1">
              <p className="text-xs text-yellow-400 text-center">⚽ Desempate por penales</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={homePens}
                  onChange={(e) => setHomePens(e.target.value)}
                  placeholder="0"
                  className="w-full bg-yellow-900/30 border border-yellow-700/60 rounded-lg px-3 py-2 text-yellow-300 text-center font-bold focus:outline-none focus:border-yellow-500"
                />
                <span className="text-yellow-600 font-bold shrink-0">pen</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={awayPens}
                  onChange={(e) => setAwayPens(e.target.value)}
                  placeholder="0"
                  className="w-full bg-yellow-900/30 border border-yellow-700/60 rounded-lg px-3 py-2 text-yellow-300 text-center font-bold focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-2">
            {/* Guardar */}
            <button
              onClick={handleSave}
              disabled={saving || homeGoals === '' || awayGoals === ''}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 min-h-[48px] ${
                saved
                  ? 'bg-green-600 text-white'
                  : saving
                  ? 'bg-gray-600 text-gray-400 cursor-wait'
                  : 'bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black'
              }`}
            >
              {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar'}
            </button>

            {/* Borrar resultado */}
            {played && (
              <button
                onClick={handleClear}
                disabled={clearing}
                className={`px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 min-h-[48px] min-w-[80px] ${
                  confirmClear
                    ? 'bg-red-600 text-white animate-pulse'
                    : clearing
                    ? 'bg-gray-700 text-gray-500 cursor-wait'
                    : 'bg-gray-700 hover:bg-red-900/50 text-gray-400 hover:text-red-400 border border-gray-600 hover:border-red-700'
                }`}
              >
                {clearing ? '...' : confirmClear ? '¿Seguro?' : '🗑 Borrar'}
              </button>
            )}
          </div>

          {isOffline && saved && (
            <p className="text-xs text-yellow-500 text-center">⚠ Modo local — no se guarda en la nube</p>
          )}
        </div>
      )}
    </div>
  );
}
