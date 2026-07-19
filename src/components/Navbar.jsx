import { NavLink } from 'react-router-dom';
import { useLeague } from '../context/LeagueContext';

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/equipos', label: 'Equipos' },
  { to: '/fechas', label: 'Fechas' },
  { to: '/calendario', label: 'Calendario' },
  { to: '/resultados', label: 'Resultados' },
  { to: '/tabla', label: 'Tabla General' },
];

export default function Navbar() {
  const { isAdmin } = useLeague();

  return (
    <header className="sticky top-0 z-40 border-b border-steel bg-void/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-blood-bright text-2xl">🔒</span>
            <span className="font-display text-2xl tracking-wide text-bone leading-none">
              SAW 4 <span className="text-blood-bright">SIN ESCAPE</span>
            </span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors rounded-sm ${
                    isActive ? 'text-hazard bg-panel' : 'text-muted hover:text-bone'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/admin-saw4"
            className={({ isActive }) =>
              `shrink-0 px-3 py-2 text-xs font-bold uppercase tracking-widest border rounded-sm transition-colors ${
                isActive
                  ? 'border-hazard text-hazard'
                  : 'border-steel-light text-muted hover:border-hazard hover:text-hazard'
              }`
            }
          >
            {isAdmin ? '● Admin' : 'Admin'}
          </NavLink>
        </div>

        <nav className="flex md:hidden gap-1 overflow-x-auto pb-2 -mt-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `shrink-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-sm ${
                  isActive ? 'text-hazard bg-panel' : 'text-muted'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
