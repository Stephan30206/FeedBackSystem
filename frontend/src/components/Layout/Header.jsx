import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * Composant Header
 * Barre de navigation supérieure avec logo, notifications et profil utilisateur
 */
const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('Déconnexion réussie');
        navigate('/login');
    };

    const getRoleBadge = (role) => {
        const badges = {
            STUDENT: { text: 'Étudiant', color: 'bg-blue-100 text-blue-800' },
            TEACHER: { text: 'Enseignant', color: 'bg-green-100 text-green-800' },
            ADMIN: { text: 'Admin', color: 'bg-purple-100 text-purple-800' },
        };
        return badges[role] || badges.STUDENT;
    };

    const badge = getRoleBadge(user?.role);

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo et titre */}
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">U</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">UAZ Feedback</h1>
                        <p className="text-xs text-gray-500">Système de feedback étudiant</p>
                    </div>
                </div>

                {/* Actions utilisateur */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Profil utilisateur */}
                    <div className="flex items-center space-x-3 border-l pl-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">{user?.fullName || user?.username}</p>
                            <span className={`text-xs px-2 py-0.5 rounded ${badge.color}`}>
                {badge.text}
              </span>
                        </div>

                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-600" />
                        </div>

                        {/* Bouton déconnexion */}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Se déconnecter"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;