# 🏆 SAW 4 — Sin Escape · Liga TCG Pocket

Aplicación oficial para administrar la liga cerrada de 16 equipos de Pokémon TCG Pocket, con formato todos-contra-todos, 12 fechas temáticas y Muerte Súbita en caso de empate 2-2.

## Cómo funciona el almacenamiento (léelo antes de nada)

No se usa Supabase ni ninguna base de datos externa, tal como se pidió. Los datos viven como **archivos JSON dentro de `src/data/`**:

- `equipos.json`
- `fechas.json`
- `calendario.json`
- `resultados.json`
- `tabla.json`

Como el sitio se publica en Cloudflare Pages **como sitio estático** (sin servidor propio), el navegador no puede escribir directamente sobre esos archivos del repositorio. Por eso el flujo real de trabajo es:

1. El admin entra a `/admin-saw4` y edita equipos, desbloquea fechas o carga resultados. Estos cambios se guardan al instante en el `localStorage` de **su propio navegador**, para poder trabajar cómodo sin perder nada al recargar.
2. Cuando quiere publicar esos cambios para que **todos los visitantes los vean**, va a la pestaña **Publicar** del panel admin y descarga los archivos `.json` actualizados.
3. Reemplaza esos archivos dentro de `src/data/` en tu repositorio de GitHub y haz `commit` + `push`.
4. Cloudflare Pages detecta el push y vuelve a desplegar automáticamente. Ahora el JSON actualizado queda "horneado" en el sitio para todo el mundo.

Esto es una limitación real de no tener backend/base de datos, y es importante que el administrador de la liga lo entienda: **los cambios no se ven en vivo para otros usuarios hasta que se suben a GitHub**. Si en el futuro quieres que los cambios se reflejen para todos en tiempo real sin este paso manual, vas a necesitar sí o sí algún tipo de backend o base de datos (lo cual el requerimiento original descarta).

## Contraseña del panel admin

Por defecto: `saw4sinescape`

Está escrita en `src/context/LeagueContext.jsx` (función `login`). Como es un sitio 100% estático, **esto no es seguridad real** (cualquiera que mire el código fuente del sitio puede verla) — solo evita que un visitante casual entre a editar por error. Si te importa la privacidad de esa contraseña, cámbiala ahí antes de desplegar, y ten en cuenta que solo protege contra el uso casual, no contra alguien que inspeccione el código.

## Estructura del proyecto

```
src/
  data/           JSON con equipos, fechas, calendario, resultados y tabla
  context/        LeagueContext: capa de datos (localStorage + export JSON)
  utils/
    standings.js  Cálculo de la tabla general y resolución de Muerte Súbita
  components/     Navbar, PadlockIcon, etc.
  pages/          Inicio, Equipos, Fechas, Calendario, Resultados, Tabla, Admin
scripts/
  genCalendario.mjs  Generador del fixture (round-robin, método del círculo)
public/
  _redirects      Regla de Cloudflare Pages para que las rutas internas funcionen
```

## Reglas de la temporada (ya cargadas en `fechas.json`)

| # | Nombre | Regla |
|---|--------|-------|
| 1 | Caída de los Ex | Sin Pokémon EX |
| 2 | Guerra de Elementos | Solo Pokémon Agua y Fuego |
| 3 | Sin Recuperación | Sin cartas/Pokémon que curen o den vida |
| 4 | La Maldición de Gengar | Gengar debe ser el Pokémon principal |
| 5 | Batalla de la Diversidad | BO1, sin repetir Pokémon ni energía en el equipo |
| 6 | El Último Guerrero | Solo una familia evolutiva, sin banca |
| 7 | Batalla Sin Apoyo | Sin cartas de apoyo |
| 8 | El Despertar de la Fase 2 | Solo Fase 2, sin Caramelo/Paleta/Helado |
| 9 | El Origen del Entrenador | Solo Pokémon Básicos |
| 10 | La Guardería SAW | Solo Pokémon Baby |
| 11 | La Suerte del Entrenador | Solo ataques de moneda, sin ayudas de lanzamiento |
| 12 | Dominio del Campo SAW | La victoria requiere haber usado un Estadio |

Formato de cada fecha: 16 equipos → 8 enfrentamientos de 4 vs 4 jugadores. Victoria = 3 puntos, derrota = 0. Si el marcador queda 2-2, se activa la ⚡ Muerte Súbita (BO1, un jugador por equipo).

## Desarrollo local

```bash
npm install
npm run dev
```

## Cómo subir a GitHub

```bash
git init
git add .
git commit -m "SAW 4 Sin Escape - liga inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## Cómo desplegar en Cloudflare Pages

1. Entra a dash.cloudflare.com → Workers & Pages → Create application → pestaña Pages → Connect to Git.
2. Selecciona el repositorio que acabas de subir.
3. Configuración de build:
   - Framework preset: Vite
   - Build command: npm run build
   - Build output directory: dist
4. Deploy. Cloudflare te da una URL tipo saw4-liga.pages.dev.
5. A partir de ahí, cada git push a main vuelve a desplegar el sitio automáticamente, incluidos los JSON actualizados que subas desde el panel admin.

## Actualizar el calendario (solo si cambian los 16 equipos)

El fixture ya viene generado sin repetir cruces (scripts/genCalendario.mjs, método del círculo). Si alguna vez necesitas reordenar los equipos de cero, corre:

```bash
node scripts/genCalendario.mjs
```

Esto regenera src/data/calendario.json a partir de los IDs en equipos.json. Cambiar solo nombre/color/logo de un equipo (lo normal desde el panel admin) no requiere regenerar nada, porque el fixture referencia los id de cada equipo, no su nombre.
