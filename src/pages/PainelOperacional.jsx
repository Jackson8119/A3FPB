// src/pages/PainelOperacional.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { PlayCircle, CheckSquare, Activity, CheckCircle2, Loader2 } from 'lucide-react';

export function PainelOperacional() {
  const { user } = useAuth();
  const [incidentesAtivos, setIncidentesAtivos] = useState([]);
  const [moldes, setMoldes] = useState([]);
  const [moldeId, setMoldeId] = useState('');
  const [tempo, setTempo] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  async function carregarDados() {
    const { data: dMoldes } = await supabase.from('moldes_incidentes').select('*');
    if (dMoldes) setMoldes(dMoldes);

    // FILTRO POR ÁREA: Se não for Admin, só vê o que é da sua área ATUAL
    let query = supabase.from('incidentes_reais').select('*, moldes_incidentes(*)').eq('status', 'Em Andamento');
    
    if (user?.perfil !== 'Admin') {
      query = query.eq('area_responsavel_atual', user?.area);
    }

    const { data: ativos } = await query;
    if (ativos) setIncidentesAtivos(ativos);
    setLoading(false);
  }

  useEffect(() => {
    carregarDados();
    const interval = setInterval(() => setTempo(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [user]);

  async function handleIniciar(e) {
    e.preventDefault();
    if (!moldeId) return;

    const molde = moldes.find(m => m.id === parseInt(moldeId));
    const primeiraArea = molde.etapas[0].area_responsavel;

    const { error } = await supabase.from('incidentes_reais').insert([{
      molde_id: moldeId,
      operador_nome: user?.nome,
      etapa_atual_index: 0,
      inicio_etapa_atual: new Date().toISOString(),
      area_responsavel_atual: primeiraArea // Define a área da 1ª etapa
    }]);

    if (!error) { toast.success("Alerta Disparado!"); carregarDados(); }
  }

  async function handleProxima(inc) {
    const proximoIdx = inc.etapa_atual_index + 1;
    const etapas = inc.moldes_incidentes.etapas;

    if (proximoIdx < etapas.length) {
      // PASSAGEM DE BASTÃO PARA A PRÓXIMA ÁREA
      const proximaArea = etapas[proximoIdx].area_responsavel;
      await supabase.from('incidentes_reais').update({
        etapa_atual_index: proximoIdx,
        inicio_etapa_atual: new Date().toISOString(),
        area_responsavel_atual: proximaArea,
        operador_nome: 'Aguardando Operador da ' + proximaArea
      }).eq('id', inc.id);
      toast.success("Enviado para a área: " + proximaArea);
    } else {
      await supabase.from('incidentes_reais').update({ status: 'Finalizado' }).eq('id', inc.id);
      toast.success("Incidente Finalizado!");
    }
    carregarDados();
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black dark:text-white uppercase italic flex items-center gap-2">
        <Activity className="text-red-500" /> Painel da Área: {user?.area || 'Geral'}
      </h1>

      <form onSubmit={handleIniciar} className="p-6 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 flex gap-4">
        <select value={moldeId} onChange={e => setMoldeId(e.target.value)} className="flex-1 p-3 rounded-lg bg-red-50 dark:bg-slate-900 dark:text-white border-red-200 dark:border-slate-700 font-bold">
          <option value="">Selecione a Ocorrência...</option>
          {moldes.map(m => <option key={m.id} value={m.id}>{m.titulo}</option>)}
        </select>
        <button className="bg-red-600 text-white px-8 font-black rounded-lg hover:bg-red-700 flex items-center gap-2"><PlayCircle /> DISPARAR</button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {incidentesAtivos.map(inc => {
          const etapa = inc.moldes_incidentes.etapas[inc.etapa_atual_index];
          const segRestantes = etapa.sla - Math.floor((tempo - new Date(inc.inicio_etapa_atual).getTime()) / 1000);
          
          return (
            <div key={inc.id} className="p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-black text-xl dark:text-white uppercase">{inc.moldes_incidentes.titulo}</h3>
                <div className={`p-2 rounded font-mono font-bold ${segRestantes < 0 ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-900 dark:text-white'}`}>
                  {segRestantes}s
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
                <p className="text-[10px] font-black text-blue-600 uppercase">Aguardando sua área ({user?.area})</p>
                <p className="text-lg font-bold dark:text-slate-200">{etapa.nome}</p>
              </div>
              <button onClick={() => handleProxima(inc)} className="w-full bg-emerald-600 text-white font-black py-4 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2">
                <CheckSquare /> CONCLUIR MINHA ETAPA
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}