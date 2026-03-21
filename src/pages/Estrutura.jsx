// src/pages/Estrutura.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Building2, Plus, Trash2, Box, Loader2, AlertCircle } from 'lucide-react';

export function Estrutura() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novaArea, setNovaArea] = useState('');
  
  // Estados para Novo Ativo
  const [novoAtivoNome, setNovoAtivoNome] = useState('');
  const [areaSelecionadaParaAtivo, setAreaSelecionadaParaAtivo] = useState('');

  async function carregarDados() {
    setLoading(true);
    // Busca áreas e seus respectivos ativos (JOIN)
    const { data, error } = await supabase
      .from('areas')
      .select('*, ativos(*)');
    
    if (error) toast.error("Erro ao carregar estrutura.");
    else setAreas(data);
    setLoading(false);
  }

  useEffect(() => { carregarDados(); }, []);

  // --- AÇÕES DE ÁREA ---
  async function handleAddArea(e) {
    e.preventDefault();
    if (!novaArea) return;
    const { error } = await supabase.from('areas').insert([{ nome: novaArea }]);
    if (error) toast.error("Erro ao criar área.");
    else {
      toast.success("Área criada!");
      setNovaArea('');
      carregarDados();
    }
  }

  async function handleExcluirArea(id) {
    if (!confirm("Confirmar exclusão da área? Isso só funcionará se não houver ativos ou moldes nela.")) return;
    const { error } = await supabase.from('areas').delete().eq('id', id);
    if (error) {
      // Erro 23503 = Chave estrangeira (tem algo impedindo)
      if (error.code === '23503') toast.error("Remova todos os ativos e moldes desta área antes de excluí-la.");
      else toast.error("Erro ao excluir.");
    } else {
      toast.success("Área removida.");
      carregarDados();
    }
  }

  // --- AÇÕES DE ATIVO ---
  async function handleAddAtivo(e) {
    e.preventDefault();
    if (!novoAtivoNome || !areaSelecionadaParaAtivo) return toast.error("Preencha o nome e selecione a área.");
    
    const { error } = await supabase.from('ativos').insert([{ 
      nome: novoAtivoNome, 
      area_id: areaSelecionadaParaAtivo 
    }]);

    if (error) toast.error("Erro ao criar ativo.");
    else {
      toast.success("Ativo registrado!");
      setNovoAtivoNome('');
      carregarDados();
    }
  }

  async function handleExcluirAtivo(id) {
    if (!confirm("Excluir este ativo?")) return;
    const { error } = await supabase.from('ativos').delete().eq('id', id);
    if (error) toast.error("Erro ao excluir ativo.");
    else {
      toast.success("Ativo removido.");
      carregarDados();
    }
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Building2 className="text-blue-600" /> Estrutura Física
      </h1>

      {/* SEÇÃO: CRIAR ÁREA E ATIVO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Criar Área */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-sm font-bold uppercase text-slate-500 mb-4">Nova Área</h2>
          <form onSubmit={handleAddArea} className="flex gap-2">
            <input 
              value={novaArea} 
              onChange={e => setNovaArea(e.target.value)}
              placeholder="Ex: TI, Produção..." 
              className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus /></button>
          </form>
        </div>

        {/* Criar Ativo */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-sm font-bold uppercase text-slate-500 mb-4">Novo Ativo (Equipamento)</h2>
          <form onSubmit={handleAddAtivo} className="space-y-3">
            <div className="flex gap-2">
              <input 
                value={novoAtivoNome} 
                onChange={e => setNovoAtivoNome(e.target.value)}
                placeholder="Ex: Servidor, Máquina A..." 
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select 
                value={areaSelecionadaParaAtivo} 
                onChange={e => setAreaSelecionadaParaAtivo(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none"
              >
                <option value="">Área...</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
              <button className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"><Plus /></button>
            </div>
          </form>
        </div>
      </div>

      {/* LISTAGEM DE ÁREAS E SEUS ATIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map(area => (
          <div key={area.id} className="bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <span className="font-bold text-slate-700 dark:text-slate-200 uppercase text-xs tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" /> {area.nome}
              </span>
              <button onClick={() => handleExcluirArea(area.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 space-y-2">
              {area.ativos && area.ativos.length > 0 ? (
                area.ativos.map(ativo => (
                  <div key={ativo.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded-lg group">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Box className="w-3 h-3 text-slate-400" /> {ativo.nome}
                    </span>
                    <button onClick={() => handleExcluirAtivo(ativo.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-400 italic">Nenhum ativo nesta área.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}