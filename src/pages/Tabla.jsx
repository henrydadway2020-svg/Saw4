import { useLeague } from '../context/LeagueContext';

export default function Tabla() {
  const { tabla, equipos } = useLeague();
  const equipoById = Object.fromEntries(equipos.map(e => [e.id, e]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-bone mb-2">Tabla General</h1>
      <p className="text-muted mb-8">Victoria = 3 puntos · Derrota = 0 puntos · Ordenada por puntos.</p>

      <div className="rivet-panel rounded-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-steel text-left font-mono text-[11px] uppercase tracking-widest text-muted">
              <th className="px-4 py-3">Pos</th>
              <th className="px-4 py-3">Equipo</th>
              <th className="px-4 py-3 text-center">PJ</th>
              <th className="px-4 py-3 text-center">PG</th>
              <th className="px-4 py-3 text-center">PP</th>
              <th className="px-4 py-3 text-center">PTS</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((row, i) => {
              const eq = equipoById[row.equipoId];
              return (
                <tr key={row.equipoId} className="border-b border-steel/50 last:border-0 hover:bg-void/40">
                  <td className="px-4 py-3 font-mono text-muted">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: eq?.color }} />
                      <span className="text-bone font-medium">{eq?.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-muted">{row.pj}</td>
                  <td className="px-4 py-3 text-center font-mono text-toxin-bright">{row.pg}</td>
                  <td className="px-4 py-3 text-center font-mono text-blood-bright">{row.pp}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-hazard">{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
