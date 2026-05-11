export type Phase = 'group' | 'repechaje' | 'semi' | 'final';

export interface Match {
  id: string;
  phase: Phase;
  zone: string | null; // 'A', 'B', 'C' — solo para fase de grupos
  match_number: number;
  home_team: string;
  away_team: string;
  home_goals: number | null;
  away_goals: number | null;
  home_penalties: number | null;
  away_penalties: number | null;
  played: boolean;
}

export interface TeamStanding {
  team: string;
  zone: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}
