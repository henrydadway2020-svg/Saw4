import { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { requiereMuerteSubita, resolverGanador } from '../utils/standings';
import PadlockIcon from '../components/PadlockIcon';

function LoginGate({ onSuccess }) {
  const { login } = useLeague();
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (login(pass)) {
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="rivet-panel rounded-sm p-8 text-center">
        <PadlockIcon locked className="w-12 h-12 mx-auto mb-4" />
        <h1 className="font-display text-3xl text-bone mb-2">Panel Administrador</h1>
        <p className="text-muted text-sm mb-6">Acceso restringido a la organización de SAW 4.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false); }}
            placeholder="Contraseña"
            className="w-full bg-void border border-steel-light rounded-sm px-4 py-2.5 text-bone font-mono focus:outline-none focus:border-hazard"
          />
          {error && <p className="text-blood-bright text-xs font-mono">Contraseña incorrecta.</p>}
          <button type="submit" className="w-full bg-blood hover:bg-blood-bright transition-colors rounded-sm py-2.5 font-semibold text-bone">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function SeccionEquipos() {
  const { equipos, updateEquipo } = useLeague();
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {equipos.map(eq => (
        <div key={eq.id} className="rivet-panel rounded-sm p-4 space-y-2">
          <input
            value={eq.nombre}
            onChange={e => updateEquipo(eq.id, { nombre: e.target.value })}
            className="w-full bg-void border border-steel-light rounded-sm px-2 py-1.5 text-bone text-sm font-semibold focus:outline-none focus:border-hazard"
          />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={eq.color}
              onChange={e => updateEquipo(eq.id, { color: e.target.value })}
              className="w-9 h-9 bg-void border border-steel-light rounded-sm cursor-pointer"
            />
            <input
              value={eq.logo}
              onChange={e => updateEquipo(eq.id, { logo: e.target.value })}
              placeholder="URL del logo (opcional)"
              className="flex-1 min-w-0 bg-void border border-steel-light rounded-sm px-2 py-1.5 text-xs text-muted font-mono focus:outline-none focus:border-hazard"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SeccionFechas() {
  const { fechas, toggleFecha } = useLeague();
  return (
    <div className="space-y-2">
      {fechas.map(f => (
        <div key={f.id} className="rivet-panel rounded-sm p-4 flex items-center gap-4">
          <PadlockIcon locked={!f.desbloqueada} className="w-8 h-8 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted">Fecha {String(f.id).padStart(2, '0')}</div>
            <div className="text-bone font-medium truncate">{f.emoji} {f.nombre}</div>
          </div>
          <button
            onClick={() => toggleFecha(f.id, !f.desbloqueada)}
            className={`shrink-0 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide transition-colors ${
              f.desbloqueada
                ? 'border border-blood text-blood-bright hover:bg-blood hover:text-bone'
                : 'bg-toxin text-void hover:bg-toxin-bright'
            }`}
          >
            {f.desbloqueada ? 'Bloquear' : 'Desbloquear'}
          </button>
        </div>
      ))}
    </div>
  );
}

function FormResultado({ enfrentamiento, resultadoActual, equipoById, fechaId }) {
  const { upsertResultado, deleteResultado } = useLeague();
  const [vLocal, setVLocal] = useState(resultadoActual?.victoriasLocal ?? 0);
  const [vVisitante, setVVisitante] = useState(resultadoActual?.victoriasVisitante ?? 0);
  const [msGanador, setMsGanador] = useState(resultadoActual?.muerteSubita?.ganador ?? '');

  const local = equipoById[enfrentamiento.local];
  const visitante = equipoById[enfrentamiento.visitante];
  const necesitaMS = requiereMuerteSubita(Number(vLocal), Number(vVisitante));

  function handleGuardar() {
    const vl = Number(vLocal);
    const vv = Number(vVisitante);
    const muerteSubita = necesitaMS ? { ganador: msGanador || null } : null;
    const ganador = resolverGanador({
      local: enfrentamiento.local,
      visitante: enfrentamiento.visitante,
      victoriasLocal: vl,
      victoriasVisitante: vv,
      muerteSubita,
    });

    if (!ganador) {
      alert(necesitaMS ? 'Selecciona el ganador de la Muerte Súbita.' : 'El resultado no define un ganador válido.');
      return;
    }

    upsertResultado({
      fechaId,
      enfrentamientoId: enfrentamiento.id,
      local: enfrentamiento.local,
      visitante: enfrentamiento.visitante,
      victoriasLocal: vl,
      victoriasVisitante: vv,
      muerteSubita,
      ganador,
    });
  }

  return (
    <div className="rivet-panel rounded-sm p-4">
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <span className="text-bone font-medium">{local?.nombre}</span>
        <span className="font-mono text-xs text-muted">vs</span>
        <span className="text-bone font-medium text-right">{visitante?.nombre}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number" min="0" max="4" value={vLocal}
          onChange={e => setVLocal(e.target.value)}
          className="w-16 bg-void border border-steel-light rounded-sm px-2 py-1.5 text-center font-mono text-bone focus:outline-none focus:border-hazard"
        />
        <span className="font-mono text-muted">-</span>
        <input
          type="number" min="0" max="4" value={vVisitante}
          onChange={e => setVVisitante(e.target.value)}
          className="w-16 bg-void border border-steel-light rounded-sm px-2 py-1.5 text-center font-mono text-bone focus:outline-none focus:border-hazard"
        />

        {necesitaMS && (
          <select
            value={msGanador}
            onChange={e => setMsGanador(e.target.value)}
            className="flex-1 bg-void border border-blood rounded-sm px-2 py-1.5 text-sm text-hazard font-mono focus:outline-none"
          >
            <option value="">⚡ Ganador Muerte Súbita</option>
            <option value={enfrentamiento.local}>{local?.nombre}</option>
            <option value={enfrentamiento.visitante}>{visitante?.nombre}</option>
          </select>
        )}

        <div className="flex-1" />
        <button onClick={handleGuardar} className="px-4 py-1.5 rounded-sm bg-blood hover:bg-blood-bright text-bone text-xs font-bold uppercase tracking-wide transition-colors">
          Guardar
        </button>
        {resultadoActual && (
          <button onClick={() => deleteResultado(enfrentamiento.id)} className="px-3 py-1.5 rounded-sm border border-steel-light text-muted hover:border-blood hover:text-blood-bright text-xs font-bold uppercase tracking-wide transition-colors">
            Borrar
          </button>
        )}
      </div>
    </div>
  );
}

function SeccionResultados() {
  const { calendario, resultados, equipos, fechas } = useLeague();
  const [fechaSel, setFechaSel] = useState(1);
  const equipoById = Object.fromEntries(equipos.map(e => [e.id, e]));
  const jornada = calendario.find(c => c.fechaId === fechaSel);
  const fechaInfo = fechas.find(f => f.id === fechaSel);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {calendario.map(c => (
          <button
            key={c.fechaId}
            onClick={() => setFechaSel(c.fechaId)}
            className={`w-10 h-10 rounded-sm font-mono text-sm border transition-colors ${
              fechaSel === c.fechaId ? 'bg-blood border-blood text-bone' : 'border-steel-light text-muted hover:border-hazard hover:text-hazard'
            }`}
          >
            {String(c.fechaId).padStart(2, '0')}
          </button>
        ))}
      </div>
      {!fechaInfo?.desbloqueada && (
        <p className="font-mono text-xs text-hazard mb-3">⚠ Esta fecha sigue bloqueada para el público, pero puedes cargar resultados igual.</p>
      )}
      <div className="space-y-3">
        {jornada?.enfrentamientos.map(m => (
          <FormResultado
            key={m.id}
            enfrentamiento={m}
            resultadoActual={resultados.find(r => r.enfrentamientoId === m.id)}
            equipoById={equipoById}
            fechaId={fechaSel}
          />
        ))}
      </div>
    </div>
  );
}

function SeccionExportar() {
  const { exportJSON, resetToSeed, logout } = useLeague();
  const archivos = ['equipos', 'fechas', 'resultados', 'tabla'];

  return (
    <div className="rivet-panel rounded-sm p-6 space-y-5">
      <div>
        <h3 className="font-display text-xl text-bone mb-1">Publicar cambios</h3>
        <p className="text-muted text-sm">
          Esta app no usa base de datos externa. Tus cambios se guardan en este navegador.
          Para publicarlos en la web oficial: descarga cada archivo actualizado y reemplázalo
          dentro de <code className="font-mono text-hazard">src/data/</code> en tu repositorio de GitHub,
          luego súbelo (commit + push). Cloudflare Pages redesplegará automáticamente.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {archivos.map(name => (
          <button
            key={name}
            onClick={() => exportJSON(name)}
            className="px-4 py-2 rounded-sm border border-steel-light text-bone hover:border-hazard hover:text-hazard text-sm font-mono transition-colors"
          >
            ⬇ {name}.json
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 pt-4 border-t border-steel">
        <button
          onClick={() => { if (confirm('¿Restablecer todos los datos locales a los valores originales?')) resetToSeed(); }}
          className="px-4 py-2 rounded-sm border border-blood text-blood-bright hover:bg-blood hover:text-bone text-xs font-bold uppercase tracking-wide transition-colors"
        >
          Restablecer datos locales
        </button>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-sm border border-steel-light text-muted hover:text-bone text-xs font-bold uppercase tracking-wide transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'equipos', label: 'Equipos' },
  { id: 'fechas', label: 'Fechas' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'publicar', label: 'Publicar' },
];

export default function Admin() {
  const { isAdmin } = useLeague();
  const [tab, setTab] = useState('fechas');
  const [, force] = useState(0);

  if (!isAdmin) {
    return <LoginGate onSuccess={() => force(x => x + 1)} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl text-bone mb-2">Panel Administrador</h1>
      <p className="text-muted mb-8">/admin-saw4 · Gestión completa de la liga.</p>

      <div className="flex gap-1 mb-8 border-b border-steel overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id ? 'border-hazard text-hazard' : 'border-transparent text-muted hover:text-bone'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'equipos' && <SeccionEquipos />}
      {tab === 'fechas' && <SeccionFechas />}
      {tab === 'resultados' && <SeccionResultados />}
      {tab === 'publicar' && <SeccionExportar />}
    </div>
  );
}
