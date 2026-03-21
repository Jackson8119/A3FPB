// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, Building2, Activity, Info, ChevronDown, ChevronUp, CheckCircle2, 
  FileText, Flame, Layers, PlayCircle, Clock, CheckSquare, Loader2 
} from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Memória para os números das KPIs
  const [stats, setStats] = useState({
    usuarios: 0,
    areas: 0,
    ativos: 0,
    moldes: 0,
    criticos: 0,
    etapas: 0,
    incidentesAtivos: 0,
    slaEstourado: 0,
    resolvidosHoje: 0
  });

  async function carregarKpis() {
    setLoading(true);
    
    // 1. Contagens para o ADMIN
    const { count: countUsers } = await supabase.from('usuarios').select('*', { count: 'exact', head: true });
    const { count: countAreas } = await supabase.from('areas').select('*', { count: 'exact', head: true });
    const { count: countAtivos } = await supabase.from('ativos').select('*', { count: 'exact', head: true });

    // 2. Contagens para o GERENCIADOR
    const { data: moldes } = await supabase.from('moldes_incidentes').select('impacto, etapas');
    const totalMoldes = moldes?.length || 0;
    const totalCriticos = moldes?.filter(m => m.impacto === 'Alto').length || 0;
    const totalEtapas = moldes?.reduce((acc, m) => acc + (m.etapas?.length || 0), 0) || 0;

    // 3. Contagens para o OPERACIONAL
    const { data: incidentes } = await supabase.from('incidentes_reais').select('*');
    const ativos = incidentes?.filter(i => i.status === 'Em Andamento').length || 0;
    const resolvidos = incidentes?.filter(i => i.status === 'Finalizado').length || 0;

    setStats({
      usuarios: countUsers || 0,
      areas: countAreas || 0,
      ativos: countAtivos || 0,
      moldes: totalMoldes,
      criticos: totalCriticos,
      etapas: totalEtapas,
      incidentesAtivos: ativos,
      slaEstourado: 0, // Lógica de SLA futuro
      resolvidosHoje: resolvidos
    });

    setLoading(false);
  }

  useEffect(() => {
    carregarKpis();
  }, []);

  const getDescricaoCargo = (perfil) => {
    const descricoes = {
      Admin: "Você é o arquiteto. Gerencie usuários e a base física da empresa.",
      Gerenciador: "Você é o maestro. Configure fluxos, SLAs e monitore a eficiência.",
      Operacional: "Você é o motor. Registre ocorrências e cumpra os tempos estabelecidos."
    };
    return descricoes[perfil] || "Bem-vindo ao sistema.";
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Visão Geral</h1>

      {/* Guia de Funções (Colapsável) */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl overflow-hidden">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-900 dark:text-blue-300 text-sm">Guia do Perfil: {user?.perfil}</span>
          </div>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>
        {isExpanded && <div className="p-4 border-t border-blue-100 dark:border-blue-800/50 text-sm text-slate-600 dark:text-slate-300">{getDescricaoCargo(user?.perfil)}</div>}
      </div>

      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Indicadores Reais (Live)
      </h2>
      
      {/* GRID DE KPIs DINÂMICO POR PERFIL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* VISÃO ADMIN */}
        {user?.perfil === 'Admin' && (
          <>
            <KpiCard icon={<Users />} label="Usuários no Banco" value={stats.usuarios} color="purple" />
            <KpiCard icon={<Building2 />} label="Áreas Mapeadas" value={stats.areas} color="emerald" />
            <KpiCard icon={<Activity />} label="Ativos Registrados" value={stats.ativos} color="blue" />
          </>
        )}

        {/* VISÃO GERENCIADOR */}
        {user?.perfil === 'Gerenciador' && (
          <>
            <KpiCard icon={<FileText />} label="Moldes no Banco" value={stats.moldes} color="blue" />
            <KpiCard icon={<Flame />} label="Processos Críticos" value={stats.criticos} color="orange" />
            <KpiCard icon={<Layers />} label="Total de Etapas" value={stats.etapas} color="indigo" />
          </>
        )}

        {/* VISÃO OPERACIONAL */}
        {user?.perfil === 'Operacional' && (
          <>
            <KpiCard icon={<PlayCircle />} label="Incidentes Ativos" value={stats.incidentesAtivos} color="amber" />
            <KpiCard icon={<Clock />} label="Tempo de Resposta" value="Live" color="red" />
            <KpiCard icon={<CheckSquare />} label="Resolvidos (Total)" value={stats.resolvidosHoje} color="emerald" />
          </>
        )}
      </div>
    </div>
  );
}

// Sub-componente para os cards (para o código não ficar gigante)
function KpiCard({ icon, label, value, color }) {
  const colors = {
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</h3>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
      </div>
    </div>
  );
}