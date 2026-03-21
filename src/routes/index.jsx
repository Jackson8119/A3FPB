// src/routes/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Usuarios } from '../pages/Usuarios';
import { Estrutura } from '../pages/Estrutura';
import { ConfigIncidentes } from '../pages/ConfigIncidentes'; 
import { Layout } from '../components/Layout';
import { PrivateRoute } from './PrivateRoute';
import { PainelOperacional } from '../pages/PainelOperacional';
import { Historico } from '../pages/Historico';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Login />} />
        
        {/* Rotas Protegidas (Todas dentro do PrivateRoute e Layout) */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/estrutura" element={<Estrutura />} />
          <Route path="/operacional" element={<PainelOperacional />} />
          <Route path="/config-incidentes" element={<ConfigIncidentes />} />
          
        
          <Route path="/historico" element={<Historico />} />
          
          <Route path="/home" element={<Navigate to="/dashboard" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}