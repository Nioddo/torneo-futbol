import { Match, TeamStanding } from '@/types';

// ─── Equipos del torneo ───────────────────────────────────────────────────────
export const ZONE_TEAMS: Record<string, string[]> = {
  A: ['Planeta Thcia', 'Los Sumatorias', 'Palangana'],
  B: ['La mastur', 'Los +capitos', 'Angry Kirk'],
  C: ['Milanesa', 'Los Secanucas', '67 Maquinas'],
  D: ['El suplantaso', 'La changuita', 'Kingnasir'],
};

// ─── Partidos iniciales con IDs locales (para modo offline/sin Supabase) ──────
export function buildLocalMatches(): Match[] {
  return buildInitialMatches().map((m, i) => ({ ...m, id: `local-${i + 1}` }));
}

// ─── Partidos iniciales del torneo ────────────────────────────────────────────
export function buildInitialMatches(): Omit<Match, 'id'>[] {
  const matches: Omit<Match, 'id'>[] = [];
  let n = 1;

  // Fase de grupos: round-robin por zona (A, B, C, D — 3 equipos cada una = 3 partidos por zona)
  for (const [zone, teams] of Object.entries(ZONE_TEAMS)) {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          phase: 'group', zone,
          match_number: n++,
          home_team: teams[i], away_team: teams[j],
          home_goals: null, away_goals: null,
          home_penalties: null, away_penalties: null,
          played: false,
        });
      }
    }
  }

  // Cuartos de Final (C1-C4)
  // C1: 1º Zona A vs 2º Zona B
  matches.push({
    phase: 'quarter', zone: null, match_number: n++,
    home_team: '1º Zona A', away_team: '2º Zona B',
    home_goals: null, away_goals: null,
    home_penalties: null, away_penalties: null,
    played: false,
  });
  // C2: 1º Zona B vs 2º Zona A
  matches.push({
    phase: 'quarter', zone: null, match_number: n++,
    home_team: '1º Zona B', away_team: '2º Zona A',
    home_goals: null, away_goals: null,
    home_penalties: null, away_penalties: null,
    played: false,
  });
  // C3: 1º Zona C vs 2º Zona D
  matches.push({
    phase: 'quarter', zone: null, match_number: n++,
    home_team: '1º Zona C', away_team: '2º Zona D',
    home_goals: null, away_goals: null,
    home_penalties: null, away_penalties: null,
    played: false,
  });
  // C4: 1º Zona D vs 2º Zona C
  matches.push({
    phase: 'quarter', zone: null, match_number: n++,
    home_team: '1º Zona D', away_team: '2º Zona C',
    home_goals: null, away_goals: null,
    home_penalties: null, away_penalties: null,
    played: false,
  });

  // Semifinal 1: Ganador C1 vs Ganador C3
  matches.push({
    phase: 'semi', zone: null, match_number: n++,
    home_team: 'Ganador C1', away_team: 'Ganador C3',
    home_goals: null, away_goals: null,
    home_penalties: null, away_penalties: null,
    played: false,
  });

  // Semifinal 2: Ganador C2 vs Ganador C4
  matches.push({
    phase: 'semi', zone: null, match_number: n++,
    home_team: 'Ganador C2', away_team: 'Ganador C4',
    home_goals: null, away_goals: null,
    home_penalties: null, away_penalties: null,
    played: false,
  });

  // Final
  matches.push({
    phase: 'final', zone: null, match_number: n++,
    home_team: 'Ganador Semi 1', away_team: 'Ganador Semi 2',
    home_goals: null, away_goals: null,
    home_penalties: null, away_penalties: null,
    played: false,
  });

  return matches;
}

// ─── Calcular tabla de posiciones por zona ────────────────────────────────────
export function calcStandings(matches: Match[], zone: string): TeamStanding[] {
  const teams = ZONE_TEAMS[zone] ?? [];
  const table: Record<string, TeamStanding> = {};

  for (const team of teams) {
    table[team] = { team, zone, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
  }

  for (const m of matches) {
    if (m.zone !== zone || !m.played || m.home_goals == null || m.away_goals == null) continue;
    const h = table[m.home_team];
    const a = table[m.away_team];
    if (!h || !a) continue;

    const hg = m.home_goals, ag = m.away_goals;
    h.played++; a.played++;
    h.gf += hg; h.ga += ag;
    a.gf += ag; a.ga += hg;

    if (hg > ag)      { h.won++; h.points += 3; a.lost++; }
    else if (hg < ag) { a.won++; a.points += 3; h.lost++; }
    else              { h.drawn++; a.drawn++; h.points++; a.points++; }
  }

  for (const s of Object.values(table)) s.gd = s.gf - s.ga;
  return Object.values(table).sort(compareStandings);
}

export function compareStandings(a: TeamStanding, b: TeamStanding): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.gd !== a.gd) return b.gd - a.gd;
  return b.gf - a.gf;
}
