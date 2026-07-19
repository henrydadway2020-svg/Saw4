import fs from 'fs';

const equipos = JSON.parse(fs.readFileSync(new URL('../src/data/equipos.json', import.meta.url)));
const ids = equipos.map(e => e.id);
const n = ids.length; // 16

// Circle method round-robin: fixes ids[0], rotates the rest.
// Produces n-1 rounds (15) with n/2 matches each, no repeats.
let arr = ids.slice(1); // 15 elements that rotate
const rounds = [];

for (let r = 0; r < n - 1; r++) {
  const roundTeams = [ids[0], ...arr];
  const matches = [];
  for (let i = 0; i < n / 2; i++) {
    const local = roundTeams[i];
    const visitante = roundTeams[n - 1 - i];
    // Alternate home/away by round parity for fairness
    if (r % 2 === 0) {
      matches.push({ local, visitante });
    } else {
      matches.push({ local: visitante, visitante: local });
    }
  }
  rounds.push(matches);
  // rotate: move last element of arr to front
  arr = [arr[arr.length - 1], ...arr.slice(0, arr.length - 1)];
}

// We only need 12 fechas per the league format
const fechasCount = 12;
const calendario = rounds.slice(0, fechasCount).map((matches, idx) => ({
  fechaId: idx + 1,
  enfrentamientos: matches.map((m, mi) => ({
    id: `f${idx + 1}-p${mi + 1}`,
    local: m.local,
    visitante: m.visitante,
    resultado: null // se llena vía resultados.json
  }))
}));

fs.writeFileSync(
  new URL('../src/data/calendario.json', import.meta.url),
  JSON.stringify(calendario, null, 2) + '\n'
);

console.log('calendario.json generado con', calendario.length, 'fechas');
