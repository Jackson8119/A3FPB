// src/pages/ConfigIncidentes.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Save, Plus, Trash2, Pencil, X, ListOrdered, AlertCircle } from 'lucide-react';

export function ConfigIncidentes() {
  const [areas, setAreas] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [listaMoldes, setListaMoldes] = useState([]);
  const [moldeEmEdicao, setMoldeEmEdicao] = useState(null);
  
  const [etapas, setEtapas] = useState([{ nome: '', sla: '', area_responsavel: '' }]);
  const [formData, setFormData] = useState({ titulo: '', prioridade: 'Média', impacto: 'Médio', area_id: '', ativo_id: '' });

  async function carregarDados() {
    const { data: dAreas } = await supabase.from('areas').select('*');
    const { data: dAtivos } = await supabase.from('ativos').select('*');
    // Traz os moldes já com o nome da área e ativo vinculados (se houver)
    const { data: dMoldes } = await supabase.from('moldes_incidentes').select('*, areas(nome), ativos(nome)').order('id', { ascending: false });

    if (dAreas) setAreas(dAreas);
    if (dAtivos) setAtivos(dAtivos);
    if (dMoldes) setListaMoldes(dMoldes);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const addEtapa = () => setEtapas([...etapas, { nome: '', sla: '', area_responsavel: '' }]);
  
  const updateEtapa = (index, field, value) => {
    const novas = [...etapas];
    novas[index][field] = value;
    setEtapas(novas);
  };

  const removerEtapa = (index) => {
    if (etapas.length === 1) return toast.error("O incidente precisa ter pelo menos 1 etapa.");
    const novas = etapas.filter((_, i) => i !== index);
    setEtapas(novas);
  };

  function cancelarEdicao() {
    setMoldeEmEdicao(null);
    setFormData({ titulo: '', prioridade: 'Média', impacto: 'Médio', area_id: '', ativo_id: '' });
    setEtapas([{ nome: '', sla: '', area_responsavel: '' }]);
  }

  function handleEditarClick(molde) {
    setMoldeEmEdicao(molde.id);
    setFormData({ 
      titulo: molde.titulo, 
      prioridade: molde.prioridade, 
      impacto: molde.impacto, 
      area_id: molde.area_id || '', 
      ativo_id: molde.ativo_id || '' 
    });
    setEtapas(molde.etapas);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleExcluirMolde(id) {
    if (!confirm("Atenção: Excluir este molde pode afetar o histórico de incidentes reais. Deseja continuar?")) return;
    
    const { error } = await supabase.from('moldes_incidentes').delete().eq('id', id);
    if (error) {
      if (error.code === '23503') toast.error("Erro: Existem incidentes registrados usando este molde.");
      else toast.error("Erro ao excluir o molde.");
      console.error(error);
    } else {
      toast.success("Molde removido com sucesso!");
      carregarDados();
    }
  }

  async function handleSalvar(e) {
    e.preventDefault();
    if (!formData.titulo) return toast.error("O título é obrigatório.");

    const payload = {
      titulo: formData.titulo,
      prioridade: formData.prioridade,
      impacto: formData.impacto,
      area_id: formData.area_id ? parseInt(formData.area_id) : null,
      ativo_id: formData.ativo_id ? parseInt(formData.ativo_id) : null,
      etapas: etapas
    };

    if (moldeEmEdicao) {
      const { error } = await supabase.from('moldes_incidentes').update(payload).eq('id', moldeEmEdicao);
      if (error) {
        console.error(error);
        toast.error("Erro ao atualizar molde.");
      } else {
        toast.success("Molde atualizado!");
        cancelarEdicao();
        carregarDados();
      }
    } else {
      const { error } = await supabase.from('moldes_incidentes').insert([payload]);
      if (error) {
        console.error(error);
        toast.error("Erro ao criar molde.");
      } else {
        toast.success("Novo molde configurado!");
        cancelarEdicao();
        carregarDados();
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold dark:text-white uppercase tracking-tighter italic">Configurar Fluxos de Ocorrências</h1>
      
      {/* FORMULÁRIO DE CRIAÇÃO / EDIÇÃO */}
      <form onSubmit={handleSalvar} className={`p-6 rounded-xl border shadow-sm space-y-4 transition-all ${moldeEmEdicao ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-black dark:text-white uppercase flex items-center gap-2">
            {moldeEmEdicao ? <Pencil className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
            {moldeEmEdicao ? "Editando Molde Existente" : "Criar Novo Molde"}
          </h2>
          {moldeEmEdicao && (
            <button type="button" onClick={cancelarEdicao} className="text-red-500 text-xs font-bold uppercase hover:underline flex items-center gap-1"><X className="w-4 h-4"/> Cancelar</button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            placeholder="Título do Molde (Ex: Falha no Servidor)" 
            value={formData.titulo}
            onChange={e => setFormData({...formData, titulo: e.target.value})}
            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
          />
          <select 
            value={formData.area_id}
            onChange={e => setFormData({...formData, area_id: e.target.value})}
            className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
          >
            <option value="">Vincular a uma Área (Opcional)</option>
            {areas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <ListOrdered className="w-4 h-4" /> Definição das Etapas (Workflow)
          </h3>
          
          {etapas.map((etapa, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 items-center relative group">
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs font-black">#{index + 1}</span>
              <input 
                placeholder="Ação (Ex: Avaliar Dano)" 
                value={etapa.nome} 
                onChange={e => updateEtapa(index, 'nome', e.target.value)} 
                className="flex-1 p-2 text-sm rounded bg-white dark:bg-slate-800 border dark:border-slate-600 dark:text-white outline-none focus:ring-1 focus:ring-blue-500" 
              />
              <input 
                type="number" 
                placeholder="SLA (Segundos)" 
                value={etapa.sla} 
                onChange={e => updateEtapa(index, 'sla', e.target.value)} 
                className="w-full md:w-32 p-2 text-sm rounded bg-white dark:bg-slate-800 border dark:border-slate-600 dark:text-white outline-none focus:ring-1 focus:ring-blue-500" 
              />
              <select 
                value={etapa.area_responsavel} 
                onChange={e => updateEtapa(index, 'area_responsavel', e.target.value)} 
                className="w-full md:w-48 p-2 text-sm rounded bg-white dark:bg-slate-800 border dark:border-slate-600 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Área Responsável</option>
                {areas.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)}
              </select>
              <button type="button" onClick={() => removerEtapa(index)} className="text-red-400 hover:text-red-600 p-2 opacity-50 hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <button type="button" onClick={addEtapa} className="text-blue-500 text-xs font-bold flex items-center gap-1 hover:underline mt-2">
            <Plus className="w-4 h-4"/> Adicionar Próxima Etapa
          </button>
        </div>

        <button type="submit" className={`w-full py-4 text-white font-black rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${moldeEmEdicao ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
          <Save className="w-5 h-5"/> {moldeEmEdicao ? 'ATUALIZAR MOLDE' : 'SALVAR NOVO MOLDE'}
        </button>
      </form>

      {/* LISTAGEM DOS MOLDES EXISTENTES */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Moldes Cadastrados</h2>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {listaMoldes.length === 0 ? (
            <p className="p-8 text-center text-slate-400 italic">Nenhum molde configurado ainda.</p>
          ) : (
            listaMoldes.map(molde => (
              <div key={molde.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase">{molde.titulo}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-bold text-blue-500">{molde.etapas.length} Etapas</span> cadastradas • Área vinculada: <span className="italic">{molde.areas?.nome || 'Geral'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleEditarClick(molde)} className="px-3 py-1.5 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg text-xs font-black uppercase flex items-center gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button onClick={() => handleExcluirMolde(molde.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}