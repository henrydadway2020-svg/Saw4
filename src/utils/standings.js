// Calcula la tabla general a partir de equipos + resultados registrados.
// Cada resultado: { fechaId, enfrentamientoId, local, visitante,
//                    victoriasLocal, victoriasVisitante,
//                    muerteSubita: null | { ganador: equipoId },
//                    ganador: equipoId }
export function computeTabla(equipos, resultados) {
  const base = {};
  for (const e of equipos) {
    base[e.id] = { equipoId: e.id, pj: 0, pg: 0, pp: 0, pts: 0 };
  }

  for (const r of resultados) {
    if (!r || !r.ganador) continue;
    const perdedor = r.ganador === r.local ? r.visitante : r.local;
    if (base[r.ganador]) {
      base[r.ganador].pj += 1;
      base[r.ganador].pg += 1;
      base[r.ganador].pts += 3;
    }
    if (base[perdedor]) {
      base[perdedor].pj += 1;
      base[perdedor].pp += 1;
    }
  }
if (base['eq14']) { base['eq14'].pts += 3; } 
  return Object.values(base).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.pg !== a.pg) return b.pg - a.pg;
    return a.equipoId.localeCompare(b.equipoId);
  });
}

// Determina si un enfrentamiento requiere Muerte Súbita (2-2)
export function requiereMuerteSubita(victoriasLocal, victoriasVisitante) {
  return victoriasLocal === 2 && victoriasVisitante === 2;
}

// Dado un set de resultados de jugador (4 vs 4), calcula el ganador final
export function resolverGanador({ local, visitante, victoriasLocal, victoriasVisitante, muerteSubita }) {
  if (victoriasLocal > victoriasVisitante) return local;
  if (victoriasVisitante > victoriasLocal) return visitante;
  if (requiereMuerteSubita(victoriasLocal, victoriasVisitante)) {
    return muerteSubita?.ganador ?? null;
  }
  return null;
}
