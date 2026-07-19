import { useState } from 'react';
import { useLeague } from '../context/LeagueContext';

export default function Calendario() {
  const { calendario, equipos, resultados, fechas } = useLeague();
  const [fechaSel, setFechaSel] = useState(1);

  const equipoById = Object.fromEntries(equipos.map(e => [e.id, e]));
  const jornada = calendario.find(c => c.fechaId === fechaSel);
  const fechaInfo = fechas.find(f => f.id === fechaSel);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-bone mb-2">Calendario</h1>
      <p className="text-muted mb-8">Fixture completo: todos contra todos, 8 enfrentamientos por fecha, sin repetir cruces.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {calendario.map(c => (
          <button
            key={c.fechaId}
            onClick={() => setFechaSel(c.fechaId)}
            className={`w-11 h-11 rounded-sm font-mono text-sm border transition-colors ${
              fechaSel === c.fechaId
                ? 'bg-blood border-blood text-bone'
                : 'border-steel-light text-muted hover:border-hazard hover:text-hazard'
            }`}
          >
            {String(c.fechaId).padStart(2, '0')}
          </button>
        ))}
      </div>

      {fechaInfo && (
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
          {fechaInfo.desbloqueada ? `${fechaInfo.emoji} ${fechaInfo.nombre}` : '🔒 Fecha bloqueada'}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {jornada?.enfrentamientos.map(m => {
          const local = equipoById[m.local];
          const visitante = equipoById[m.visitante];
          const res = resultados.find(r => r.enfrentamientoId === m.id);

          return (
            <div key={m.id} className="rivet-panel rounded-sm p-4 flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: local?.color }} />
                <span className="text-bone truncate">{local?.nombre}</span>
              </div>
              <div className="font-mono text-sm text-hazard shrink-0 px-2">
                {res ? `${res.victoriasLocal} - ${res.victoriasVisitante}` : 'VS'}
              </div>
              <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
                <span className="text-bone truncate text-right">{visitante?.nombre}</span>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: visitante?.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
