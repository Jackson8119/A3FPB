// src/routes/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// O "children" é a tela que estamos tentando proteger (ex: a Home)
export function PrivateRoute({ children }) {
  // O segurança olha para o quadro de avisos para ver se tem alguém logado
  const { user } = useAuth();

  // Se o "user" estiver vazio (null), o segurança manda a pessoa de volta para a raiz ("/")
  if (!user) {
    return <Navigate to="/" />;
  }

  // Se tiver um usuário logado, o segurança libera a passagem e mostra a tela
  return children;
}