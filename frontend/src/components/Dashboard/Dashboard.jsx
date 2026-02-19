import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import reviewService from '../../services/reviewService';
import toast from 'react-hot-toast';
import {
    BookOpen,
    MessageSquare,
    TrendingUp,
    Users,
    Star,
    Award,
    Clock,
    ArrowRight
} from 'lucide-react';
import CourseCard from '../Course/CourseCard';

/**
 * Composant Dashboard
 * Page d'accueil principale après connexion
 * Affiche des statistiques et informations selon le rôle
 */
const Dashboard = () => {
    const navigate = useNavigate();
    const { user, isStudent, isTeacher, isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalReviews: 0,
        averageRating: 0,
        recentCourses: []
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Charger les cours récents
            const coursesResponse = await courseService.getAllCourses();
            const courses = coursesResponse.data;

            // Calculer les statistiques
            const totalCourses = courses.length;
            const recentCourses = courses.slice(0, 3);

            // Statistiques globales
            let totalReviews = 0;
            let totalRating = 0;
            let ratedCourses = 0;

            courses.forEach(course => {
                if (course.totalReviews) {
                    totalReviews += course.totalReviews;
                }
                if (course.avgRating) {
                    totalRating += course.avgRating;
                    ratedCourses++;
                }
            });

            const averageRating = ratedCourses > 0 ? (totalRating / ratedCourses).toFixed(1) : 0;

            setStats({
                totalCourses,
                totalReviews,
                averageRating,
                recentCourses
            });
        } catch (error) {
            console.error('Erreur lors du chargement du dashboard:', error);
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    // Cartes de statistiques
    const StatCard = ({ icon: Icon, title, value, subtitle, color, onClick }) => (
        <div
            onClick={onClick}
            className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                onClick ? 'hover:scale-105 transform transition-transform' : ''
            }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête de bienvenue */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Bienvenue, {user?.fullName || user?.username}! 👋
                </h1>
                <p className="text-blue-100">
                    {isStudent && "Consultez les cours et laissez vos avis pour améliorer l'enseignement"}
                    {isTeacher && "Consultez les retours de vos étudiants et améliorez vos cours"}
                    {isAdmin && "Gérez le système et modérez les avis"}
                </p>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={BookOpen}
                    title="Cours Disponibles"
                    value={stats.totalCourses}
                    subtitle="Cours et services"
                    color="bg-blue-500"
                    onClick={() => navigate('/courses')}
                />

                <StatCard
                    icon={MessageSquare}
                    title="Avis Total"
                    value={stats.totalReviews}
                    subtitle="Dans tout le système"
                    color="bg-green-500"
                />

                <StatCard
                    icon={Star}
                    title="Note Moyenne"
                    value={stats.averageRating}
                    subtitle="Sur 5 étoiles"
                    color="bg-yellow-500"
                />

                <StatCard
                    icon={TrendingUp}
                    title="Statistiques"
                    value="Voir"
                    subtitle="Analyses détaillées"
                    color="bg-purple-500"
                    onClick={() => navigate('/statistics')}
                />
            </div>

            {/* Section spécifique au rôle */}
            {isStudent && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Actions Rapides</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/courses')}
                            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Explorer les cours</p>
                                <p className="text-xs text-gray-600">Découvrir tous les cours</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/my-reviews')}
                            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Mes Avis</p>
                                <p className="text-xs text-gray-600">Voir mes évaluations</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/statistics')}
                            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Statistiques</p>
                                <p className="text-xs text-gray-600">Voir les tendances</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {isTeacher && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Mes Cours</h2>
                        <button
                            onClick={() => navigate('/received-reviews')}
                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                            Voir tous les avis
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                    <p className="text-gray-600">
                        Consultez les retours de vos étudiants pour améliorer la qualité de vos enseignements.
                    </p>
                </div>
            )}

            {isAdmin && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Administration</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                            <Users className="w-8 h-8 text-indigo-600 mr-3" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Utilisateurs</p>
                                <p className="text-xs text-gray-600">Gérer les comptes</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/admin/moderation')}
                            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                        >
                            <MessageSquare className="w-8 h-8 text-orange-600 mr-3" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Modération</p>
                                <p className="text-xs text-gray-600">Avis en attente</p>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/statistics')}
                            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                            <Award className="w-8 h-8 text-purple-600 mr-3" />
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Rapports</p>
                                <p className="text-xs text-gray-600">Statistiques globales</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Cours récents */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Cours Récents</h2>
                    <button
                        onClick={() => navigate('/courses')}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                        Voir tous les cours
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                {stats.recentCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.recentCourses.map((course) => (
                            <CourseCard key={course.courseId} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>Aucun cours disponible pour le moment</p>
                    </div>
                )}
            </div>

            {/* Conseils et astuces */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 text-green-600 mt-1" />
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Le saviez-vous?</h3>
                        <p className="text-gray-700">
                            {isStudent && "Vos avis constructifs aident les enseignants à améliorer leurs cours et aident les autres étudiants à faire leur choix."}
                            {isTeacher && "Répondre aux avis des étudiants montre votre engagement et améliore la relation enseignant-étudiant."}
                            {isAdmin && "La modération rapide des avis garantit un environnement respectueux et constructif pour tous."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;