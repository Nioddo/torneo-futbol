'use client';

import { useEffect, useState, useCallback } from 'react';
import { Match } from '@/types';
import { supabase } from '@/lib/supabase';
  import { calcStandings, buildLocalMatches } from '@/lib/tournament';
import PinModal from '@/components/PinModal';
import ZoneTable from '@/components/ZoneTable';
import BracketView from '@/components/BracketView';
import TournamentInfo from '@/components/TournamentInfo';
import ScheduledFixture from '@/components/ScheduledFixture';
import { Lock, LockOpen, Trophy, RefreshCw, WifiOff } from 'lucide-react';

type Tab = 'fixture' | 'standings' | 'bracket' | 'info';

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('fixture');
  const [isOffline, setIsOffline] = useState(false);

  const fetchMatches = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_number', { ascending: true });

      if (!error && data && data.length > 0) {
        setMatches(data as Match[]);
        setIsOffline(false);
      } else {
        // Sin Supabase configurado → usar datos locales del torneo
        setMatches(buildLocalMatches());
        setIsOffline(true);
      }
    } catch {
      setMatches(buildLocalMatches());
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();

    // Solo suscribir Realtime si no estamos en modo offline
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    if (supabaseUrl.includes('supabase.co') && !supabaseUrl.includes('TU-PROJECT-ID')) {
      const channel = supabase
        .channel('matches-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, (payload) => {
          setMatches((prev) => {
            if (payload.eventType === 'UPDATE') {
              return prev.map((m) => m.id === (payload.new as Match).id ? (payload.new as Match) : m);
            }
            if (payload.eventType === 'INSERT') return [...prev, payload.new as Match];
            return prev;
          });
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [fetchMatches]);

  const standingsA = calcStandings(matches, 'A');
  const standingsB = calcStandings(matches, 'B');
  const standingsC = calcStandings(matches, 'C');
  const standingsD = calcStandings(matches, 'D');

  // Clasificados a cuartos: top 2 de cada zona (8 equipos)
  const classified: string[] = [
    standingsA[0]?.team, standingsA[1]?.team,
    standingsB[0]?.team, standingsB[1]?.team,
    standingsC[0]?.team, standingsC[1]?.team,
    standingsD[0]?.team, standingsD[1]?.team,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <div>
              <h1 className="text-sm font-black leading-tight text-white">TORNEO FÚTBOL 8</h1>
              <p className="text-xs text-gray-400">2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading && <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" />}
            {isOffline && !loading && (
              <span title="Modo local — sin Supabase">
                <WifiOff className="w-4 h-4 text-yellow-500" />
              </span>
            )}
            {isAdmin && (
              <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            )}
            <button
              onClick={() => (isAdmin ? setIsAdmin(false) : setShowPinModal(true))}
              className="p-2 rounded-xl hover:bg-gray-800 transition-colors active:scale-95"
              title={isAdmin ? 'Salir del modo admin' : 'Acceso administrador'}
            >
              {isAdmin ? (
                <LockOpen className="w-5 h-5 text-green-400" />
              ) : (
                <Lock className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Banner modo local */}
      {isOffline && !loading && (
        <div className="bg-yellow-900/30 border-b border-yellow-700/40 px-4 py-2">
          <p className="text-xs text-yellow-400 text-center max-w-lg mx-auto">
            ⚡ Modo local — Los resultados no se guardan. Configurá Supabase en <code className="bg-yellow-900/50 px-1 rounded">.env.local</code> para persistencia.
          </p>
        </div>
      )}

      <div className="sticky top-[57px] z-30 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-lg mx-auto flex">
          {([
            { id: 'fixture', label: 'Fixture' },
            { id: 'standings', label: 'Posiciones' },
            { id: 'bracket', label: 'Finales' },
            { id: 'info', label: 'Info' },
          ] as { id: Tab; label: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-green-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-4 pb-24 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-8 h-8 text-gray-600 animate-spin" />
            <p className="text-gray-500">Cargando torneo...</p>
          </div>
        ) : (
          <>
            {activeTab === 'fixture' && (
              <ScheduledFixture
                matches={matches}
                isAdmin={isAdmin}
                isOffline={isOffline}
                standingsA={standingsA}
                standingsB={standingsB}
                standingsC={standingsC}
                standingsD={standingsD}
              />
            )}

            {activeTab === 'standings' && (
              <div className="space-y-4">
                <ZoneTable zone="A" standings={standingsA} highlightTeams={classified} />
                <ZoneTable zone="B" standings={standingsB} highlightTeams={classified} />
                <ZoneTable zone="C" standings={standingsC} highlightTeams={classified} />
                <ZoneTable zone="D" standings={standingsD} highlightTeams={classified} />
                <p className="text-xs text-gray-500 text-center pt-2">✓ = Clasificado a Cuartos de Final (top 2 de cada zona)</p>
              </div>
            )}

            {activeTab === 'bracket' && (
              <BracketView
                matches={matches}
                isAdmin={isAdmin}
                isOffline={isOffline}
                standingsA={standingsA}
                standingsB={standingsB}
                standingsC={standingsC}
                standingsD={standingsD}
              />
            )}

            {activeTab === 'info' && <TournamentInfo />}
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 py-2">
        <p className="text-center text-xs text-gray-600">Torneo Fútbol 8 · 2026</p>
      </footer>

      {showPinModal && (
        <PinModal
          onSuccess={() => { setIsAdmin(true); setShowPinModal(false); }}
          onClose={() => setShowPinModal(false)}
        />
      )}
    </div>
  );
}
