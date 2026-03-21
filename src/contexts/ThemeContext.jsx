// src/contexts/ThemeContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

// 1. Criamos o quadro de avisos do Tema
export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // O tema padrão começa como 'light' (claro)
  const [theme, setTheme] = useState('light');

  // 2. O Efeito Colateral (useEffect)
  // Toda vez que a variável 'theme' mudar, o React vai rodar esse código abaixo
  useEffect(() => {
    // Pegamos a tag <html> do nosso site
    const root = window.document.documentElement;
    
    // Se o tema for escuro, colocamos a classe 'dark' no <html>. Se não, tiramos.
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]); // O array [theme] diz: "React, fique de olho nessa variável"

  // 3. Função para virar a chave
  function toggleTheme() {
    // Se for claro, vira escuro. Se for escuro, vira claro.
    setTheme(temaAnterior => (temaAnterior === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Nosso atalho para usar nas telas
export function useTheme() {
  return useContext(ThemeContext);
}