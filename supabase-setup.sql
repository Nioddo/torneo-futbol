-- ══════════════════════════════════════════════════════════════════════════════
-- SETUP SUPABASE — TORNEO FÚTBOL 8 (versión actualizada)
-- Ejecutar en: supabase.com → tu proyecto → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Eliminar tabla si ya existía (para re-setup limpio)
drop table if exists public.matches;

-- 2. Crear tabla
create table public.matches (
  id             uuid primary key default gen_random_uuid(),
  phase          text not null check (phase in ('group','repechaje','semi','final')),
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

-- ZONA A: Planeta Thcia, Los Sumatorias, Los Secanucas, Palangana (6 partidos)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('group','A', 1, 'Planeta Thcia',  'Los Sumatorias'),
  ('group','A', 2, 'Planeta Thcia',  'Los Secanucas'),
  ('group','A', 3, 'Planeta Thcia',  'Palangana'),
  ('group','A', 4, 'Los Sumatorias', 'Los Secanucas'),
  ('group','A', 5, 'Los Sumatorias', 'Palangana'),
  ('group','A', 6, 'Los Secanucas',  'Palangana');

-- ZONA B: La mastur, Los +capitos, Angry Kirk, 67 Maquinas (6 partidos)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('group','B', 7,  'La mastur',    'Los +capitos'),
  ('group','B', 8,  'La mastur',    'Angry Kirk'),
  ('group','B', 9,  'La mastur',    '67 Maquinas'),
  ('group','B', 10, 'Los +capitos', 'Angry Kirk'),
  ('group','B', 11, 'Los +capitos', '67 Maquinas'),
  ('group','B', 12, 'Angry Kirk',   '67 Maquinas');

-- ZONA C: Milanesa, El suplantaso, La changuita (3 partidos)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('group','C', 13, 'Milanesa',      'El suplantaso'),
  ('group','C', 14, 'Milanesa',      'La changuita'),
  ('group','C', 15, 'El suplantaso', 'La changuita');

-- REPECHAJE: 2º Zona C vs Mejor 2º (A o B)
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('repechaje', null, 16, '2º Zona C', 'Mejor 2º (A o B)');

-- SEMIFINALES
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('semi', null, 17, '1º Zona B', 'Ganador Repechaje'),  -- Semi 1
  ('semi', null, 18, '1º Zona C', '1º Zona A');           -- Semi 2

-- FINAL
insert into public.matches (phase,zone,match_number,home_team,away_team) values
  ('final', null, 19, 'Ganador Semi 1', 'Ganador Semi 2');

-- ══════════════════════════════════════════════════════════════════════════════
