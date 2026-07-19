import { useLeague } from '../context/LeagueContext';

export default function Teams() {
  const { equipos, tabla } = useLeague();

  const posByEquipo = {};
  tabla.forEach((row, i) => { posByEquipo[row.equipoId] = i + 1; });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-bone mb-2">Equipos</h1>
      <p className="text-muted mb-8">Los 16 equipos que disputan la temporada Sin Escape.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {equipos.map(eq => (
          <div key={eq.id} className="rivet-panel rounded-sm p-4 flex flex-col items-center gap-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-display text-xl border-2"
              style={{ backgroundColor: `${eq.color}22`, borderColor: eq.color, color: eq.color }}
            >
              {eq.logo ? (
                <img src={eq.logo} alt={eq.nombre} className="w-full h-full rounded-full object-cover" />
              ) : (
                eq.nombre.replace('Equipo ', '#')
              )}
            </div>
            <div className="text-center">
              <div className="font-semibold text-bone leading-tight">{eq.nombre}</div>
              <div className="font-mono text-[11px] text-muted mt-0.5">Posición #{posByEquipo[eq.id] ?? '-'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
