import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, GraduationCap, Eye, EyeOff, Building2, ArrowLeft, ArrowRight } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        role: 'STUDENT',
        department: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password || !formData.fullName || !formData.role) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return false;
        }
        if (formData.role === 'STUDENT' && !formData.department) {
            toast.error('Veuillez sélectionner un département');
            return false;
        }
        if (formData.username.length < 3) {
            toast.error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Adresse email invalide');
            return false;
        }
        if (formData.password.length < 6) {
            toast.error('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const userData = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: formData.role,
                department: formData.department
            };
            await register(userData);
            toast.success('Inscription réussie! Vous pouvez maintenant vous connecter.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error.response?.data);
            // Handle Spring Validation errors or custom message
            const data = error.response?.data;
            let errorMessage = 'Erreur lors de l\'inscription';

            if (data?.message) {
                errorMessage = data.message;
            } else if (data?.errors && typeof data.errors === 'object') {
                errorMessage = Object.values(data.errors).join(', ');
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Logo and Welcome */}
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#007AB8] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                    <GraduationCap className="text-white w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Créer un compte</h2>
                <p className="text-slate-500 font-medium">Rejoignez la communauté UAZ Feedback</p>
            </div>

            {/* Register Container */}
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100">
                        <Link to="/login" className="flex-1 py-4 text-center font-bold text-slate-400 hover:text-slate-600 transition-colors">
                            Connexion
                        </Link>
                        <div className="flex-1 py-4 text-center font-bold text-[#007AB8] border-b-2 border-[#007AB8] bg-slate-50/50">
                            Inscription
                        </div>
                    </div>

                    <div className="p-10">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nom complet</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007AB8] transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        name="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007AB8] transition-all font-medium"
                                        placeholder="Jean Rindra"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Identifiant</label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007AB8] transition-all font-medium"
                                    placeholder="jean.rindra"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email UAZ</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007AB8] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007AB8] transition-all font-medium"
                                        placeholder="nom@uaz.edu"
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Type de profil</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="block w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007AB8] transition-all font-bold appearance-none cursor-pointer"
                                >
                                    <option value="STUDENT">Étudiant</option>
                                    <option value="TEACHER">Enseignant</option>
                                </select>
                            </div>

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Département</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007AB8] transition-colors">
                                        <Building2 size={18} />
                                    </div>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required={formData.role === 'STUDENT'}
                                        className="block w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007AB8] transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="Informatique">Informatique</option>
                                        <option value="Théologie">Théologie</option>
                                        <option value="Gestion">Gestion</option>
                                        <option value="Santé">Santé</option>
                                        <option value="Education">Education</option>
                                    </select>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007AB8] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007AB8] transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Confirmer</label>
                                <input
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007AB8] transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2 pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-100 text-base font-bold text-white bg-[#007AB8] hover:bg-[#006699] focus:outline-none focus:ring-4 focus:ring-blue-50 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <span className="flex items-center gap-2">S'inscrire <ArrowRight size={18} /></span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Back to Home */}
            <Link to="/" className="mt-8 text-sm font-bold text-slate-400 hover:text-[#007AB8] transition-all flex items-center gap-2">
                <ArrowLeft size={16} /> Retour à l'accueil
            </Link>
        </div>
    );
};

export default Register;
