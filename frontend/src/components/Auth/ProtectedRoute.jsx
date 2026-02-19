import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Composant ProtectedRoute
 * Protège les routes qui nécessitent une authentification
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        // Rediriger vers la page de connexion
        return <Navigate to="/login" replace />;
    }

    // Vérifier le rôle si spécifié
    if (requiredRole && user?.role !== requiredRole) {
        // Rediriger vers le dashboard si le rôle ne correspond pas
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;