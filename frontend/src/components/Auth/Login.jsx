import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { ArrowLeft ,Lock, Mail, GraduationCap, Eye, EyeOff, ShieldCheck, User as UserIcon } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.username, formData.password);
            toast.success('Connexion réussie!');
            navigate('/app/dashboard');
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                'Erreur de connexion. Vérifiez vos identifiants.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const TestAccount = ({ role, user, pass, icon: Icon, color }) => (
        <div 
            onClick={() => setFormData({ username: user, password: pass })}
            className={`p-3 rounded-xl border border-slate-100 bg-white hover:border-${color}-200 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:scale-110 transition-transform`}>
                    <Icon size={16} />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{role}</p>
                    <p className="text-xs font-bold text-slate-700">{user}</p>
                </div>
            </div>
            <div className="text-[10px] font-bold text-slate-300 group-hover:text-slate-500 transition-colors">
                cliquer pour remplir
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Logo and Welcome */}
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-[#007AB8] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                    <GraduationCap className="text-white w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Bienvenue sur UAZ Feedback</h2>
                <p className="text-slate-500 font-medium">Connectez-vous pour accéder à votre espace académique</p>
            </div>

            {/* Login Container */}
            <div className="max-w-md w-full space-y-8">
                {/* Login Card */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100">
                        <div className="flex-1 py-4 text-center font-bold text-[#007AB8] border-b-2 border-[#007AB8] bg-slate-50/50">
                            Connexion
                        </div>
                        <Link to="/register" className="flex-1 py-4 text-center font-bold text-slate-400 hover:text-slate-600 transition-colors">
                            Inscription
                        </Link>
                    </div>

                    <div className="p-10">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Accès personnel</h3>
                            <p className="text-sm text-slate-500 font-medium">Entrez vos identifiants fournis par l'UAZ</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username/Email */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2">
                                    Nom d'utilisateur
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007AB8] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#007AB8] transition-all font-medium"
                                        placeholder="nom@uaz.edu"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                                    Mot de passe
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007AB8] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        id="password"
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

                            {/* Submit Button */}
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
                                    "Se connecter"
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Test Credentials Card */}
                <div className="bg-slate-100/50 p-6 rounded-[32px] border border-slate-200/50 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={16} className="text-[#007AB8]" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Comptes de test (Mode Démo)</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        <TestAccount role="Administrateur" user="admin" pass="password123" icon={ShieldCheck} color="blue" />
                        <TestAccount role="Enseignant" user="prof.dupont" pass="password123" icon={UserIcon} color="green" />
                        <TestAccount role="Étudiant" user="etudiant1" pass="password123" icon={GraduationCap} color="indigo" />
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

export default Login;
