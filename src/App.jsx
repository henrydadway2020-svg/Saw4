import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Fechas from './pages/Fechas';
import Calendario from './pages/Calendario';
import Resultados from './pages/Resultados';
import Tabla from './pages/Tabla';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipos" element={<Teams />} />
          <Route path="/fechas" element={<Fechas />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/tabla" element={<Tabla />} />
          <Route path="/admin-saw4" element={<Admin />} />
        </Routes>
      </main>
      <footer className="border-t border-steel py-6 text-center">
        <p className="font-mono text-[11px] text-muted-2">
          🏆 SAW 4 — SIN ESCAPE · Liga TCG Pocket · Datos almacenados en JSON dentro del repositorio
        </p>
      </footer>
    </div>
  );
}
