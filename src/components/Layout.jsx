// src/components/Layout.jsx
import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, Users, Building2, LogOut, Sun, Moon, 
  MoreVertical, AlertTriangle, Activity, ClipboardList 
} from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const fecharMenu = () => setIsSidebarOpen(false);

  // Classe base para os links da sidebar para evitar repetição
  const linkClass = (path) => `
    flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200
    ${isActive(path) 
      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm' 
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
    }
  `;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      
      {/* OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={fecharMenu}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Building2 className="w-6 h-6" />
            <h2 className="text-xl font-bold tracking-tight">SisGestão</h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          
          {/* LINK UNIVERSAL */}
          <Link to="/dashboard" onClick={fecharMenu} className={linkClass('/dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          
          {/* BLOCO ADMIN */}
          {user?.perfil === 'Admin' && (
            <>
              <Link to="/usuarios" onClick={fecharMenu} className={linkClass('/usuarios')}>
                <Users className="w-5 h-5" /> Usuários
              </Link>
              <Link to="/estrutura" onClick={fecharMenu} className={linkClass('/estrutura')}>
                <Building2 className="w-5 h-5" /> Estrutura
              </Link>
            </>
          )}

          {/* BLOCO GERENCIADOR */}
          {user?.perfil === 'Gerenciador' && (
            <>
              <Link to="/config-incidentes" onClick={fecharMenu} className={linkClass('/config-incidentes')}>
                <AlertTriangle className="w-5 h-5" /> Configurar Moldes
              </Link>
              <Link to="/historico" onClick={fecharMenu} className={linkClass('/historico')}>
                <ClipboardList className="w-5 h-5" /> Histórico
              </Link>
            </>
          )}

          {/* BLOCO OPERACIONAL */}
          {user?.perfil === 'Operacional' && (
            <Link to="/operacional" onClick={fecharMenu} className={linkClass('/operacional')}>
              <Activity className="w-5 h-5" /> Painel Operacional
            </Link>
          )}

        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
        <header className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <MoreVertical className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500 dark:text-slate-400 leading-tight italic">Olá, {user?.nome}</span>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{user?.perfil}</span>
            </div>
          </div>
          <button onClick={toggleTheme} className="p-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-all">
            {theme === 'light' ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}