// src/pages/Historico.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ClipboardList, CheckCircle2, Clock, User, Calendar, Search, Loader2 } from 'lucide-react';

export function Historico() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  async function carregarHistorico() {
    setLoading(true);
    const { data, error } = await supabase
      .from('incidentes_reais')
      .select('*, moldes_incidentes(titulo, area_id, areas(nome))')
      .eq('status', 'Finalizado')
      .order('criado_em', { ascending: false });

    if (data) setHistorico(data);
    setLoading(false);
  }

  useEffect(() => { carregarHistorico(); }, []);

  const dadosFiltrados = historico.filter(item => 
    item.moldes_incidentes?.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
    item.operador_nome.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-indigo-500" /> Histórico de Incidentes
        </h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filtrar por título ou operador..." 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dadosFiltrados.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase">Resolvido</span>
                  <h3 className="font-bold text-slate-800 dark:text-white">{item.moldes_incidentes?.titulo}</h3>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(item.criado_em).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><User className="w-4 h-4" /></div>
                  <span>{item.operador_nome}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full"><CheckCircle2 className="w-4 h-4" /></div>
                  <span>{item.moldes_incidentes?.etapas?.length} etapas</span>
                </div>
              </div>

            </div>
          </div>
        ))}

        {dadosFiltrados.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <p className="text-slate-500">Nenhum registro finalizado encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}