// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'; // IMPORTAÇÃO CORRIGIDA AQUI
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Loader2 } from 'lucide-react';

// Importação das suas páginas
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Usuarios } from './pages/Usuarios';
import { Estrutura } from './pages/Estrutura';
import { PainelOperacional } from './pages/PainelOperacional';
import { Historico } from './pages/Historico'; // Certifique-se que este arquivo existe
import { ConfigIncidentes } from './pages/ConfigIncidentes'; // Certifique-se que este arquivo existe

// COMPONENTE DE ROTA PRIVADA COM FILTRO DE PERFIL
function PrivateRoute({ children, perfisPermitidos }) {
  const { user, loading } = useAuth();

  // 1. Enquanto carrega a sessão do localStorage
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }

  // 2. Se não estiver logado, manda para o Login
  if (!user) return <Navigate to="/login" />;

  // 3. Se o perfil logado não estiver na lista de permitidos para esta rota
  if (perfisPermitidos && !perfisPermitidos.includes(user.perfil)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* ROTA PÚBLICA */}
      <Route path="/login" element={<Login />} />

      {/* ROTAS PROTEGIDAS PELO LAYOUT */}
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        
        {/* Redirecionamento inicial */}
        <Route index element={<Navigate to="/dashboard" />} />
        
        {/* Dashboard: Todos os logados acessam */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Painel Operacional: Admin e Operacional acessam */}
        <Route path="operacional" element={
          <PrivateRoute perfisPermitidos={['Admin', 'Operacional']}>
            <PainelOperacional />
          </PrivateRoute>
        } />

        {/* Gerenciamento: Admin e Gerenciador acessam */}
        <Route path="config-incidentes" element={
          <PrivateRoute perfisPermitidos={['Admin', 'Gerenciador']}>
            <ConfigIncidentes />
          </PrivateRoute>
        } />

        <Route path="historico" element={
          <PrivateRoute perfisPermitidos={['Admin', 'Gerenciador']}>
            <Historico />
          </PrivateRoute>
        } />

        {/* Administrativo: Apenas Admin acessa */}
        <Route path="usuarios" element={
          <PrivateRoute perfisPermitidos={['Admin']}><Usuarios /></PrivateRoute>
        } />
        
        <Route path="estrutura" element={
          <PrivateRoute perfisPermitidos={['Admin']}><Estrutura /></PrivateRoute>
        } />

      </Route>

      {/* ROTA DE FUGA: Se digitar errado ou tentar acessar proibido, volta pro Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}