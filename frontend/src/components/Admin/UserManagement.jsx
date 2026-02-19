import { useEffect, useState } from 'react';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import { Users, Search, Filter, MoreVertical, Shield, User as UserIcon } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Erreur lors du chargement des utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.updateUserRole(userId, newRole);
            toast.success('Rôle mis à jour');
            loadUsers();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const RoleBadge = ({ role }) => {
        const styles = {
            ADMIN: "bg-red-50 text-red-600 border-red-100",
            TEACHER: "bg-green-50 text-green-600 border-green-100",
            STUDENT: "bg-blue-50 text-blue-600 border-blue-100"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[role] || styles.STUDENT}`}>
                {role === 'ADMIN' ? 'admin' : role === 'TEACHER' ? 'enseignant' : 'student'}
            </span>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <Users className="text-[#007AB8]" /> Gestion des utilisateurs
                    </h1>
                    <p className="text-slate-500 font-medium">Attribuez des rôles et gérez les comptes</p>
                </div>

                <div className="relative group w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007AB8] transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#007AB8] transition-all"
                    />
                </div>
            </div>

            {/* Users List Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Nom</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Rôle actuel</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-400">Changer le rôle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                                        <td className="px-8 py-6"><div className="h-6 bg-slate-100 rounded-full w-20"></div></td>
                                        <td className="px-8 py-6"><div className="h-10 bg-slate-100 rounded-xl w-32"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.userId} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold border-2 border-white shadow-sm overflow-hidden">
                                                    <img 
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=f1f5f9&color=94a3b8`} 
                                                        alt="Avatar" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.fullName || user.username}</p>
                                                    <p className="text-sm text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                                                className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-[#007AB8] focus:border-[#007AB8] block w-40 p-2.5 font-medium transition-all outline-none"
                                            >
                                                <option value="ADMIN">Admin</option>
                                                <option value="TEACHER">Enseignant</option>
                                                <option value="STUDENT">Étudiant</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-8 py-20 text-center">
                                        <Users className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                                        <p className="text-slate-400 font-bold">Aucun utilisateur trouvé</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
