// src/contexts/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { hashPassword } from '../lib/crypto';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userSalvo = localStorage.getItem('@SisGestao:user');
    if (userSalvo) setUser(JSON.parse(userSalvo));
    setLoading(false);
  }, []);

  async function login(email, password) {
    const emailTratado = email?.trim().toLowerCase();

    // Admin Master (Configurado no .env)
    if (emailTratado === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase() && 
        password === import.meta.env.VITE_ADMIN_PASSWORD) {
      const admin = { nome: 'Super Admin', email: emailTratado, perfil: 'Admin', area: 'Geral' };
      setUser(admin);
      localStorage.setItem('@SisGestao:user', JSON.stringify(admin));
      return true;
    }

    const { data, error } = await supabase.from('usuarios').select('*').ilike('email', emailTratado).maybeSingle();

    if (data && !error) {
      const senhaDigitadaHash = await hashPassword(password);
      if (data.senha === senhaDigitadaHash) {
        // PEGANDO A ÁREA DO BANCO:
        const usuarioLogado = { nome: data.nome, email: data.email, perfil: data.perfil, area: data.area };
        setUser(usuarioLogado);
        localStorage.setItem('@SisGestao:user', JSON.stringify(usuarioLogado));
        return true;
      }
    }
    return false;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('@SisGestao:user');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);