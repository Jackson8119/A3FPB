// src/contexts/ThemeContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';


export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  
  const [theme, setTheme] = useState('light');

  // 2. O Efeito Colateral (useEffect)
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]); 

  // 3. Função para virar a chave
  function toggleTheme() {
    setTheme(temaAnterior => (temaAnterior === 'light' ? 'dark' : 'light'));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeContext);
}