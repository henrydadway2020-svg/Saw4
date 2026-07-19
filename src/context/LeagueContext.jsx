import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import equiposSeed from '../data/equipos.json';
import fechasSeed from '../data/fechas.json';
import calendarioSeed from '../data/calendario.json';
import resultadosSeed from '../data/resultados.json';
import { computeTabla } from '../utils/standings';

const LeagueContext = createContext(null);

// Claves de almacenamiento local (capa de edición del admin sobre los JSON base)
const LS_KEYS = {
  equipos: 'saw4_equipos',
  fechas: 'saw4_fechas',
  resultados: 'saw4_resultados',
  admin: 'saw4_admin_auth',
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('No se pudo guardar en localStorage', e);
  }
}

export function LeagueProvider({ children }) {
  const [equipos, setEquipos] = useState(() => loadFromStorage(LS_KEYS.equipos, equiposSeed));
  const [fechas, setFechas] = useState(() => loadFromStorage(LS_KEYS.fechas, fechasSeed));
  const [resultados, setResultados] = useState(() => loadFromStorage(LS_KEYS.resultados, resultadosSeed));
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(LS_KEYS.admin) === '1');

  const calendario = calendarioSeed; // el fixture de enfrentamientos es estructural, no se edita

  useEffect(() => { saveToStorage(LS_KEYS.equipos, equipos); }, [equipos]);
  useEffect(() => { saveToStorage(LS_KEYS.fechas, fechas); }, [fechas]);
  useEffect(() => { saveToStorage(LS_KEYS.resultados, resultados); }, [resultados]);

  const tabla = useMemo(() => computeTabla(equipos, resultados), [equipos, resultados]);

  const login = useCallback((password) => {
    // Acceso simple del panel admin. No es un sistema de seguridad real:
    // al no haber backend, cualquier verificación vive en el propio navegador.
    if (password === 'saw4sinescape') {
      sessionStorage.setItem(LS_KEYS.admin, '1');
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(LS_KEYS.admin);
    setIsAdmin(false);
  }, []);

  const updateEquipo = useCallback((id, patch) => {
    setEquipos(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const toggleFecha = useCallback((id, desbloqueada) => {
    setFechas(prev => prev.map(f => (f.id === id ? { ...f, desbloqueada } : f)));
  }, []);

  const upsertResultado = useCallback((resultado) => {
    setResultados(prev => {
      const idx = prev.findIndex(r => r.enfrentamientoId === resultado.enfrentamientoId);
      if (idx === -1) return [...prev, resultado];
      const copy = [...prev];
      copy[idx] = resultado;
      return copy;
    });
  }, []);

  const deleteResultado = useCallback((enfrentamientoId) => {
    setResultados(prev => prev.filter(r => r.enfrentamientoId !== enfrentamientoId));
  }, []);

  const resetToSeed = useCallback(() => {
    setEquipos(equiposSeed);
    setFechas(fechasSeed);
    setResultados(resultadosSeed);
  }, []);

  const exportJSON = useCallback((name) => {
    const map = { equipos, fechas, resultados, tabla };
    const data = map[name];
    const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [equipos, fechas, resultados, tabla]);

  const value = {
    equipos, fechas, calendario, resultados, tabla,
    isAdmin, login, logout,
    updateEquipo, toggleFecha, upsertResultado, deleteResultado,
    resetToSeed, exportJSON,
  };

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
}

export function useLeague() {
  const ctx = useContext(LeagueContext);
  if (!ctx) throw new Error('useLeague debe usarse dentro de <LeagueProvider>');
  return ctx;
}
