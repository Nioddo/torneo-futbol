-- ══════════════════════════════════════════════════════════════════════════════
-- SETUP SUPABASE — TORNEO FÚTBOL 8 (versión actualizada)
-- Ejecutar en: supabase.com → tu proyecto → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Eliminar tabla si ya existía (para re-setup limpio)
drop table if exists public.matches;

-- 2. Crear tabla
create table public.matches (
  id             uuid primary key default gen_random_uuid(),
  phase          text not null check (phase in ('group','quarter','semi','final')),
  zone           text,
  match_number   integer not null,
  home_team      text not null,
  away_team      text not null,
  home_goals     integer,
  away_goals     integer,
  home_penalties integer,
  away_penalties integer,
  played         boolean not null default false,
  created_at     timestamptz default now()
);

-- 3. RLS
alter table public.matches enable row level security;
create policy "Lectura publica"         on public.matches for select using (true);
create policy "Actualizacion via cliente" on public.matches for update using (true) with check (true);

-- 4. Realtime
alter publication supabase_realtime add table public.matches;

-- 5. Insertar partidos ─────────────────────────────────────────────────────────

-- ZONA A: Planeta Thcia, Los Sumatorias, Palangana (3 partidos)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('group','A', 1, 'Planeta Thcia',  'Los Sumatorias'),
  ('group','A', 2, 'Planeta Thcia',  'Palangana'),
  ('group','A', 3, 'Los Sumatorias', 'Palangana');

-- ZONA B: La mastur, Los +capitos, Angry Kirk (3 partidos)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('group','B', 4, 'La mastur',    'Los +capitos'),
  ('group','B', 5, 'La mastur',    'Angry Kirk'),
  ('group','B', 6, 'Los +capitos', 'Angry Kirk');

-- ZONA C: Milanesa, Los Secanucas, 67 Maquinas (3 partidos)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('group','C', 7,  'Milanesa',      'Los Secanucas'),
  ('group','C', 8,  'Milanesa',      '67 Maquinas'),
  ('group','C', 9,  'Los Secanucas', '67 Maquinas');

-- ZONA D: El suplantaso, La changuita, Kingnasir (3 partidos)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('group','D', 10, 'El suplantaso', 'La changuita'),
  ('group','D', 11, 'El suplantaso', 'Kingnasir'),
  ('group','D', 12, 'La changuita',  'Kingnasir');

-- CUARTOS DE FINAL (C1-C4)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('quarter', null, 13, '1º Zona A', '2º Zona B'),  -- C1
  ('quarter', null, 14, '1º Zona B', '2º Zona A'),  -- C2
  ('quarter', null, 15, '1º Zona C', '2º Zona D'),  -- C3
  ('quarter', null, 16, '1º Zona D', '2º Zona C');  -- C4

-- SEMIFINALES
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('semi', null, 17, 'Ganador C1', 'Ganador C3'),  -- Semi 1
  ('semi', null, 18, 'Ganador C2', 'Ganador C4');  -- Semi 2

-- FINAL
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('final', null, 19, 'Ganador Semi 1', 'Ganador Semi 2');

-- ══════════════════════════════════════════════════════════════════════════════
