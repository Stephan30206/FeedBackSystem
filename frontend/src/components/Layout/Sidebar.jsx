import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    MessageSquare,
    BarChart3,
    Settings,
    Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Composant Sidebar
 * Menu de navigation latéral avec différentes options selon le rôle
 */
const Sidebar = () => {
    const { isStudent, isTeacher, isAdmin } = useAuth();

    const navLinkClass = ({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg overflow-y-auto">
            <nav className="p-4 space-y-2">
                {/* Dashboard - Pour tous */}
                <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                </NavLink>

                {/* Cours - Pour tous */}
                <NavLink to="/courses" className={navLinkClass}>
                    <BookOpen className="w-5 h-5" />
                    <span>Cours</span>
                </NavLink>

                {/* Mes Avis - Pour étudiants */}
                {isStudent && (
                    <NavLink to="/my-reviews" className={navLinkClass}>
                        <MessageSquare className="w-5 h-5" />
                        <span>Mes Avis</span>
                    </NavLink>
                )}

                {/* Avis Reçus - Pour enseignants */}
                {isTeacher && (
                    <NavLink to="/received-reviews" className={navLinkClass}>
                        <MessageSquare className="w-5 h-5" />
                        <span>Avis Reçus</span>
                    </NavLink>
                )}

                {/* Statistiques - Pour tous */}
                <NavLink to="/statistics" className={navLinkClass}>
                    <BarChart3 className="w-5 h-5" />
                    <span>Statistiques</span>
                </NavLink>

                {/* Gestion Utilisateurs - Admin uniquement */}
                {isAdmin && (
                    <>
                        <div className="border-t my-4"></div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                            Administration
                        </div>

                        <NavLink to="/admin/users" className={navLinkClass}>
                            <Users className="w-5 h-5" />
                            <span>Utilisateurs</span>
                        </NavLink>

                        <NavLink to="/admin/moderation" className={navLinkClass}>
                            <MessageSquare className="w-5 h-5" />
                            <span>Modération</span>
                        </NavLink>

                        <NavLink to="/admin/settings" className={navLinkClass}>
                            <Settings className="w-5 h-5" />
                            <span>Paramètres</span>
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;