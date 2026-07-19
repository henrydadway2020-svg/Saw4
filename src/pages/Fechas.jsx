import { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import PadlockIcon from '../components/PadlockIcon';

export default function Fechas() {
  const { fechas, calendario, equipos, resultados } = useLeague();
  const [abierta, setAbierta] = useState(null);

  const equipoById = Object.fromEntries(equipos.map(e => [e.id, e]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-bone mb-2">Fechas</h1>
      <p className="text-muted mb-8">
        Cada fecha permanece sellada hasta que el administrador la libera.
        Al abrirse, revela su regla especial, los enfrentamientos y los resultados.
      </p>

      <div className="space-y-4">
        {fechas.map(f => {
          const jornada = calendario.find(c => c.fechaId === f.id);
          const abiertaAqui = abierta === f.id;

          return (
            <div key={f.id} className="rivet-panel rounded-sm overflow-hidden">
              <button
                onClick={() => setAbierta(abiertaAqui ? null : f.id)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                <PadlockIcon locked={!f.desbloqueada} className="w-9 h-9 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    Fecha {String(f.id).padStart(2, '0')}
                  </div>
                  <div className="font-display text-2xl text-bone truncate">
                    {f.desbloqueada ? `${f.emoji} ${f.nombre}` : 'Expediente sellado'}
                  </div>
                </div>
                <span className="font-mono text-xs text-muted">{abiertaAqui ? '−' : '+'}</span>
              </button>

              {abiertaAqui && (
                <div className="border-t border-steel px-4 pb-5 pt-4">
                  {!f.desbloqueada ? (
                    <p className="font-mono text-sm text-muted italic">
                      Esta fecha todavía no ha sido desbloqueada.
                    </p>
                  ) : (
                    <>
                      <div className="mb-5 border-l-2 border-hazard pl-3">
                        <p className="text-bone">{f.regla}</p>
                      </div>

                      <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-2">Enfrentamientos</h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {jornada?.enfrentamientos.map(m => {
                          const res = resultados.find(r => r.enfrentamientoId === m.id);
                          const local = equipoById[m.local];
                          const visitante = equipoById[m.visitante];
                          return (
                            <div key={m.id} className="bg-void/50 rounded-sm px-3 py-2 flex items-center justify-between text-sm">
                              <span className="text-bone truncate">{local?.nombre}</span>
                              <span className="font-mono text-muted mx-2 shrink-0">
                                {res ? `${res.victoriasLocal}-${res.victoriasVisitante}` : 'vs'}
                              </span>
                              <span className="text-bone truncate text-right">{visitante?.nombre}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
