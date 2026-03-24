// src/pages/Login.jsx
import { useState } from 'react'; // Importamos o useState para o loading
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { Loader2, Moon, Sun } from 'lucide-react'; // Ícone de carregamento

const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido.").min(1, "O e-mail é obrigatório."),
  password: z.string().min(1, "A senha é obrigatória.") // Removi o min(6) aqui para não travar o Admin Master se a senha for menor
});

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // 1. Tornamos a função assíncrona (async)
  async function handleLogin(data) {
    setIsLoading(true);
    
    try {
      // 2. Usamos o AWAIT para esperar a resposta do Supabase
      const sucesso = await login(data.email, data.password);

      if (sucesso) {
        toast.success("Acesso autorizado!");
        navigate('/dashboard'); 
      } else {
        // 3. Notificação flutuante SEM recarregar a página
        toast.error("E-mail ou senha incorretos.", {
          duration: 4000,
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 px-4">
      <button 
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight italic">
            SisGestão
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Controle de Incidentes e Operações
          </p>
        </div>

        {/* O handleSubmit do react-hook-form já faz o preventDefault automaticamente */}
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="seu@email.com"
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white`}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1.5 block font-medium">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border ${errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none dark:text-white`}
            />
            {errors.password && <span className="text-red-500 text-xs mt-1.5 block font-medium">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Validando...
              </>
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Acesso restrito a colaboradores autorizados.
          </p>
        </div>
      </div>
    </div>
  );
}