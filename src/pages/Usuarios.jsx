// src/pages/Usuarios.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { hashPassword } from '../lib/crypto';
import toast from 'react-hot-toast';
import { UserPlus, Trash2, ShieldAlert, ShieldCheck, User, Pencil, X, Loader2, Building } from 'lucide-react';

export function Usuarios() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [areasDisponiveis, setAreasDisponiveis] = useState([]);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 1. CARREGAR DADOS (USUÁRIOS E ÁREAS)
  async function carregarDados() {
    setLoading(true);
    
    // Busca áreas para preencher o select de cadastro
    const { data: dAreas } = await supabase.from('areas').select('*').order('nome');
    if (dAreas) setAreasDisponiveis(dAreas);

    // Busca usuários
    const { data: dUsers, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome', { ascending: true });

    if (error) toast.error("Erro ao carregar usuários.");
    else setListaUsuarios(dUsers);
    
    setLoading(false);
  }

  useEffect(() => { carregarDados(); }, []);

  // 2. SALVAR OU ATUALIZAR
  async function handleSalvarUsuario(data) {
    const emailLimpo = data.email.trim().toLowerCase();

    let senhaFinal = null;
    if (data.senha) {
      senhaFinal = await hashPassword(data.senha);
    }

    const payload = { 
      nome: data.nome, 
      email: emailLimpo, 
      perfil: data.perfil, 
      area: data.area, // NOVO CAMPO SALVO NO BANCO
      ...(senhaFinal && { senha: senhaFinal })
    };

    if (usuarioEmEdicao) {
      const { error } = await supabase.from('usuarios').update(payload).eq('id', usuarioEmEdicao);
      if (error) return toast.error("Erro ao atualizar.");
      toast.success("Usuário atualizado!");
    } else {
      const { error } = await supabase.from('usuarios').insert([payload]);
      if (error) return toast.error("E-mail já cadastrado!");
      toast.success("Usuário criado com sucesso!");
    }
    
    setUsuarioEmEdicao(null);
    reset();
    carregarDados();
  }

  async function handleExcluirUsuario(id) {
    if (!confirm("Remover este usuário definitivamente?")) return;
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (!error) {
      toast.success("Usuário removido.");
      carregarDados();
    }
  }

  function handleEditarClick(usuario) {
    setUsuarioEmEdicao(usuario.id);
    reset({ 
        nome: usuario.nome, 
        email: usuario.email, 
        perfil: usuario.perfil,
        area: usuario.area || '',
        senha: '' 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight italic">Gestão de Colaboradores</h1>

      {/* FORMULÁRIO DE CADASTRO */}
      <div className={`p-6 rounded-xl shadow-sm border transition-all ${usuarioEmEdicao ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                {usuarioEmEdicao ? <Pencil className="w-5 h-5 text-amber-600" /> : <UserPlus className="w-5 h-5 text-blue-600" />}
                {usuarioEmEdicao ? "Alterar Permissões" : "Novo Acesso ao Sistema"}
            </h2>
            {usuarioEmEdicao && (
                <button onClick={() => { setUsuarioEmEdicao(null); reset(); }} className="text-xs font-black text-red-500 hover:underline">CANCELAR</button>
            )}
        </div>
        
        <form onSubmit={handleSubmit(handleSalvarUsuario)} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
            <input {...register("nome", {required: true})} placeholder="Ex: João Silva" className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">E-mail</label>
            <input {...register("email", {required: true})} placeholder="email@empresa.com" className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Senha</label>
            <input {...register("senha", {required: !usuarioEmEdicao})} type="password" placeholder={usuarioEmEdicao ? "Nova (opc)" : "Senha"} className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Perfil</label>
            <select {...register("perfil", {required: true})} className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Nível...</option>
              <option value="Admin">Admin</option>
              <option value="Gerenciador">Gerenciador</option>
              <option value="Operacional">Operacional</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Área de Atuação</label>
            <select {...register("area", {required: true})} className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Vincular Área...</option>
              <option value="Geral">Geral / Todos</option>
              {areasDisponiveis.map(a => <option key={a.id} value={a.nome}>{a.nome}</option>)}
            </select>
          </div>

          <button type="submit" className={`py-2 rounded-lg font-black text-white shadow-md transition-all ${usuarioEmEdicao ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {usuarioEmEdicao ? 'ATUALIZAR' : 'CADASTRAR'}
          </button>
        </form>
      </div>

      {/* LISTAGEM */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="p-4 text-xs font-black uppercase text-slate-500">Colaborador</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500">Área</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500">Acesso</th>
              <th className="p-4 text-xs font-black uppercase text-slate-500 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {listaUsuarios.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold dark:text-white">{u.nome}</span>
                    <span className="text-[11px] text-slate-400">{u.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <Building className="w-3.5 h-3.5 text-slate-400" /> {u.area || 'Não Definida'}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${u.perfil === 'Admin' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`}>
                    {u.perfil}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => handleEditarClick(u)} className="text-slate-400 hover:text-amber-500 transition-colors"><Pencil className="w-5 h-5" /></button>
                  <button onClick={() => handleExcluirUsuario(u.id)} className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}