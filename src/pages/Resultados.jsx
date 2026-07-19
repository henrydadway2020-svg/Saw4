import { useLeague } from '../context/LeagueContext';
import { Link } from 'react-router-dom';

export default function Resultados() {
  const { resultados, equipos, calendario, fechas } = useLeague();
  const equipoById = Object.fromEntries(equipos.map(e => [e.id, e]));

  const enriquecidos = resultados
    .map(r => {
      const jornada = calendario.find(c => c.enfrentamientos.some(e => e.id === r.enfrentamientoId));
      return { ...r, jornadaId: jornada?.fechaId };
    })
    .sort((a, b) => (b.jornadaId ?? 0) - (a.jornadaId ?? 0));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h1 className="font-display text-4xl text-bone">Resultados</h1>
        <Link to="/admin-saw4" className="font-mono text-xs text-muted hover:text-hazard border border-steel-light hover:border-hazard rounded-sm px-3 py-1.5">
          Registrar resultado →
        </Link>
      </div>
      <p className="text-muted mb-8">Historial de todos los enfrentamientos jugados.</p>

      {enriquecidos.length === 0 ? (
        <div className="rivet-panel rounded-sm p-8 text-center text-muted font-mono text-sm">
          Todavía no se registraron resultados.
        </div>
      ) : (
        <div className="space-y-2">
          {enriquecidos.map(r => {
            const local = equipoById[r.local];
            const visitante = equipoById[r.visitante];
            const ganador = equipoById[r.ganador];
            const fechaInfo = fechas.find(f => f.id === r.jornadaId);
            return (
              <div key={r.enfrentamientoId} className="rivet-panel rounded-sm p-4 flex items-center gap-3 flex-wrap">
                <span className="font-mono text-[11px] text-muted w-16 shrink-0">
                  F{String(r.jornadaId ?? '?').padStart(2, '0')}
                </span>
                <div className="flex-1 flex items-center gap-2 min-w-[140px]">
                  <span className={local?.id === r.ganador ? 'text-hazard font-semibold' : 'text-bone'}>{local?.nombre}</span>
                </div>
                <div className="font-mono text-sm text-bone px-2 shrink-0">
                  {r.victoriasLocal} - {r.victoriasVisitante}
                  {r.muerteSubita && <span className="text-blood-bright ml-1">⚡MS</span>}
                </div>
                <div className="flex-1 flex items-center justify-end gap-2 min-w-[140px] text-right">
                  <span className={visitante?.id === r.ganador ? 'text-hazard font-semibold' : 'text-bone'}>{visitante?.nombre}</span>
                </div>
                <span className="font-mono text-[11px] text-toxin-bright w-full sm:w-auto sm:ml-2">
                  🏆 {ganador?.nombre}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
