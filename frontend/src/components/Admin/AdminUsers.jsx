import { useEffect, useState } from 'react';
import { Trash2, Shield, UserX } from 'lucide-react';
import api from '../../services/api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
            try {
                await api.delete(`/users/${userId}`);
                setUsers(users.filter(u => u.userId !== userId));
            } catch (err) {
                setError('Erreur lors de la suppression');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Gestion des Utilisateurs</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Nom</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Rôle</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Statut</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId} className="border-t hover:bg-gray-50">
                                <td className="px-6 py-4">{user.fullName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                        user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {user.role === 'admin' ? 'Admin' :
                                         user.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={user.isActive ? 'text-green-600' : 'text-red-600'}>
                                        {user.isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => handleDeleteUser(user.userId)}
                                        className="text-red-600 hover:text-red-800 inline-flex"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
