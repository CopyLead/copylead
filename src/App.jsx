import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ComprarPage from './pages/ComprarPage';
import FluxoAutenticacaoPage from './pages/FluxoAutenticacaoPage';
import ExtensaoPage from './pages/ExtensaoPage';

export default function App() {
  return (
    <div>
      <header className="topbar">
        <h1>CopyLP</h1>
        <nav>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/comprar">Comprar</NavLink>
          <NavLink to="/fluxo-auth">Fluxo de autenticação</NavLink>
          <NavLink to="/extensao">Extensão</NavLink>
        </nav>
      </header>

      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/comprar" element={<ComprarPage />} />
          <Route path="/fluxo-auth" element={<FluxoAutenticacaoPage />} />
          <Route path="/extensao" element={<ExtensaoPage />} />
        </Routes>
      </main>
    </div>
  );
}
