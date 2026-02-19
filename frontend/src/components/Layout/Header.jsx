import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, GraduationCap, ShieldCheck, Users, BookOpen, MessageSquare, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isAdmin } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('Déconnexion réussie');
        navigate('/login');
    };

    const navItems = [
        { label: 'Administration', path: '/app/admin', icon: ShieldCheck, adminOnly: true },
        { label: 'Utilisateurs', path: '/app/users', icon: Users, adminOnly: true },
        { label: 'Cours', path: '/app/courses', icon: BookOpen },
        { label: 'Avis', path: '/app/reviews', icon: MessageSquare },
        { label: 'Statistiques', path: '/app/statistics', icon: BarChart2 },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 backdrop-blur-md bg-white/90">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo and title */}
                <Link to="/app/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-[#007AB8] rounded-xl flex items-center justify-center shadow-md shadow-blue-100">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">UAZ Feedback</h1>
                </Link>

                {/* Main Navigation */}
                <nav className="hidden lg:flex items-center gap-2">
                    {navItems.map((item) => (
                        (!item.adminOnly || isAdmin) && (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    location.pathname.startsWith(item.path)
                                        ? 'bg-blue-50 text-[#007AB8] shadow-sm shadow-blue-50/50'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                            >
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    ))}
                </nav>

                {/* User Profile and Logout */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">{user?.fullName || user?.username}</p>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                {user?.role === 'ADMIN' ? 'Administrateur' : user?.role === 'TEACHER' ? 'Enseignant' : 'Étudiant'}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold border-2 border-white shadow-sm overflow-hidden">
                           <img 
                             src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || user?.username)}&background=f1f5f9&color=94a3b8`} 
                             alt="Avatar" 
                             className="w-full h-full object-cover"
                           />
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm font-bold transition-all border border-slate-100"
                    >
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Déconnexion</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
