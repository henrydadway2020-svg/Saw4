import { Link } from 'react-router-dom';
import { useLeague } from '../context/LeagueContext';
import PadlockIcon from '../components/PadlockIcon';

export default function Home() {
  const { fechas, equipos, resultados } = useLeague();
  const desbloqueadas = fechas.filter(f => f.desbloqueada).length;
  const partidosJugados = resultados.length;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-steel">
        <div className="hazard-tape absolute inset-x-0 top-0 h-2" />
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blood-bright mb-4">
            Liga cerrada · Pokémon TCG Pocket · 16 equipos
          </p>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.9] text-bone">
            SAW 4
          </h1>
          <div className="inline-block -rotate-2 bg-blood px-4 py-1 mt-3 mb-6">
            <span className="font-display text-2xl md:text-3xl tracking-widest text-bone">
              SIN ESCAPE
            </span>
          </div>
          <p className="max-w-xl text-muted text-base md:text-lg">
            Doce fechas. Doce trampas. Cada una permanece sellada hasta que el
            administrador la libera. Todos contra todos, 4 vs 4 por jornada,
            y si el marcador queda 2 a 2, se activa la Muerte Súbita.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/fechas" className="rounded-sm bg-blood px-5 py-2.5 font-semibold text-bone hover:bg-blood-bright transition-colors">
              Ver las fechas
            </Link>
            <Link to="/tabla" className="rounded-sm border border-steel-light px-5 py-2.5 font-semibold text-bone hover:border-hazard hover:text-hazard transition-colors">
              Tabla general
            </Link>
          </div>
        </div>
      </section>

      {/* Chain of locks — signature element */}
      <section className="border-b border-steel bg-panel/40">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl tracking-wide text-bone">Estado de la temporada</h2>
            <span className="font-mono text-xs text-muted">{desbloqueadas} / 12 selladas liberadas</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3">
            {fechas.map((f, i) => (
              <Link
                key={f.id}
                to="/fechas"
                className="animate-chain-in flex flex-col items-center gap-1.5 group"
                style={{ animationDelay: `${i * 40}ms` }}
                title={f.desbloqueada ? f.nombre : 'Fecha bloqueada'}
              >
                <PadlockIcon locked={!f.desbloqueada} className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[10px] text-muted">F{f.id}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Equipos', value: equipos.length },
          { label: 'Fechas totales', value: 12 },
          { label: 'Fechas liberadas', value: desbloqueadas },
          { label: 'Partidos registrados', value: partidosJugados },
        ].map(s => (
          <div key={s.label} className="rivet-panel rounded-sm px-4 py-6 text-center">
            <div className="font-display text-4xl text-hazard">{s.value}</div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
