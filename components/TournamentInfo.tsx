'use client';

const ZONES = [
  {
    zone: 'A', color: 'bg-blue-600/80',
    teams: [
      { name: 'Planeta Thcia',   year: '2º' },
      { name: 'Los Sumatorias',  year: '2º' },
      { name: 'Los Secanucas',   year: '2º' },
      { name: 'Palangana',       year: '1º' },
    ],
  },
  {
    zone: 'B', color: 'bg-purple-600/80',
    teams: [
      { name: 'La mastur',   year: '3º' },
      { name: 'Los +capitos', year: '1º' },
      { name: 'Angry Kirk',  year: '2º' },
      { name: '67 Maquinas', year: '1º' },
    ],
  },
  {
    zone: 'C', color: 'bg-orange-600/80',
    teams: [
      { name: 'Milanesa',       year: '3º' },
      { name: 'El suplantaso',  year: '3º' },
      { name: 'La changuita',   year: '1º' },
    ],
  },
];

export default function TournamentInfo() {
  return (
    <div className="space-y-6 pb-4">

      {/* ── Organización de grupos ────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Organización de Grupos · Cursos Mezclados
        </h2>
        <div className="space-y-3">
          {ZONES.map(({ zone, color, teams }) => (
            <div key={zone} className="rounded-xl overflow-hidden border border-gray-700">
              <div className={`px-4 py-2 text-sm font-bold ${color}`}>Zona {zone}</div>
              <div className="divide-y divide-gray-700/50">
                {teams.map((t) => (
                  <div key={t.name} className="flex items-center justify-between px-4 py-2.5 bg-gray-800/40">
                    <span className="text-sm text-gray-200 font-medium">{t.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-700/60 px-2 py-0.5 rounded-full">{t.year} año</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formato y clasificación ───────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          ⚽ Formato y Clasificación
        </h2>
        <div className="rounded-xl border border-gray-700 bg-gray-800/40 divide-y divide-gray-700/60">

          <div className="px-4 py-3 flex gap-3">
            <span className="text-green-400 text-lg shrink-0">🏅</span>
            <div>
              <p className="text-sm font-semibold text-white">Clasificados directos a Semifinales</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                <span className="text-blue-300 font-medium">1º Zona A</span>,{' '}
                <span className="text-purple-300 font-medium">1º Zona B</span> y{' '}
                <span className="text-orange-300 font-medium">1º Zona C</span>.
              </p>
            </div>
          </div>

          <div className="px-4 py-3 flex gap-3">
            <span className="text-orange-400 text-lg shrink-0">⚡</span>
            <div>
              <p className="text-sm font-semibold text-white">Repechaje (Play-in) — 4º cupo</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                <span className="text-orange-300 font-medium">2º Zona C</span> vs{' '}
                <span className="text-white font-medium">Mejor 2º</span> entre 2º Zona A y 2º Zona B
                (mejor estadística: pts → dif. goles → goles a favor).
                <br />El ganador va a <strong className="text-gray-200">Semifinal 1</strong>.
              </p>
            </div>
          </div>

          <div className="px-4 py-3 flex gap-3">
            <span className="text-purple-400 text-lg shrink-0">🔀</span>
            <div>
              <p className="text-sm font-semibold text-white">Cruces de Semifinales (protegidos)</p>
              <div className="text-xs text-gray-400 mt-1 space-y-1">
                <p>· <strong className="text-gray-200">Semi 1:</strong> 1º Zona B vs Ganador Repechaje</p>
                <p>· <strong className="text-gray-200">Semi 2:</strong> 1º Zona C vs 1º Zona A</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 flex gap-3">
            <span className="text-blue-400 text-lg shrink-0">⏱</span>
            <div>
              <p className="text-sm font-semibold text-white">Tiempos — Fase de Grupos</p>
              <p className="text-xs text-gray-400 mt-0.5">
                2 × <strong className="text-gray-200">12 min</strong> + 3 min entretiempo + 3 min recambio
                <span className="text-gray-600"> (bloques de 30 min)</span>
              </p>
            </div>
          </div>

          <div className="px-4 py-3 flex gap-3">
            <span className="text-yellow-400 text-lg shrink-0">⏱</span>
            <div>
              <p className="text-sm font-semibold text-white">Tiempos — Fase Final</p>
              <p className="text-xs text-gray-400 mt-0.5">
                2 × <strong className="text-gray-200">11 min</strong> + 3 min entretiempo + 10 min penales
                <span className="text-gray-600"> (bloques de 35–40 min)</span>
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
