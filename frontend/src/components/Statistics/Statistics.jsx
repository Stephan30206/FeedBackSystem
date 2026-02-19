import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import toast from 'react-hot-toast';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    TrendingUp,
    Award,
    BookOpen,
    Users,
    Star,
    BarChart3
} from 'lucide-react';

/**
 * Composant Statistics
 * Page de statistiques et analyses détaillées
 */
const Statistics = () => {
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        overview: {
            totalCourses: 0,
            totalReviews: 0,
            averageRating: 0,
            totalStudents: 0
        },
        topCourses: [],
        departmentStats: [],
        ratingDistribution: [],
        monthlyTrends: []
    });

    // Couleurs pour les graphiques
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            setLoading(true);

            // Charger tous les cours
            const coursesResponse = await courseService.getAllCourses();
            const courses = coursesResponse.data;

            // Calculer les statistiques globales
            const overview = calculateOverview(courses);
            const topCourses = getTopCourses(courses, 5);
            const departmentStats = calculateDepartmentStats(courses);
            const ratingDistribution = calculateRatingDistribution(courses);

            setStats({
                overview,
                topCourses,
                departmentStats,
                ratingDistribution,
                monthlyTrends: [] // À implémenter avec des données réelles
            });
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
            toast.error('Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
        }
    };

    const calculateOverview = (courses) => {
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

        return {
            totalCourses: courses.length,
            totalReviews,
            averageRating: ratedCourses > 0 ? (totalRating / ratedCourses).toFixed(2) : 0,
            totalStudents: 0 // À calculer depuis l'API
        };
    };

    const getTopCourses = (courses, limit) => {
        return courses
            .filter(c => c.avgRating && c.totalReviews > 0)
            .sort((a, b) => {
                // Trier par note puis par nombre d'avis
                if (b.avgRating === a.avgRating) {
                    return b.totalReviews - a.totalReviews;
                }
                return b.avgRating - a.avgRating;
            })
            .slice(0, limit)
            .map(c => ({
                name: c.name.length > 30 ? c.name.substring(0, 30) + '...' : c.name,
                rating: c.avgRating,
                reviews: c.totalReviews,
                code: c.code
            }));
    };

    const calculateDepartmentStats = (courses) => {
        const deptMap = {};

        courses.forEach(course => {
            const dept = course.department || 'Autre';
            if (!deptMap[dept]) {
                deptMap[dept] = {
                    name: dept,
                    courses: 0,
                    totalReviews: 0,
                    totalRating: 0,
                    ratedCourses: 0
                };
            }

            deptMap[dept].courses++;
            if (course.totalReviews) {
                deptMap[dept].totalReviews += course.totalReviews;
            }
            if (course.avgRating) {
                deptMap[dept].totalRating += course.avgRating;
                deptMap[dept].ratedCourses++;
            }
        });

        return Object.values(deptMap).map(dept => ({
            name: dept.name,
            courses: dept.courses,
            reviews: dept.totalReviews,
            avgRating: dept.ratedCourses > 0
                ? (dept.totalRating / dept.ratedCourses).toFixed(2)
                : 0
        }));
    };

    const calculateRatingDistribution = (courses) => {
        const distribution = {
            '5 étoiles': 0,
            '4-5 étoiles': 0,
            '3-4 étoiles': 0,
            '2-3 étoiles': 0,
            '0-2 étoiles': 0
        };

        courses.forEach(course => {
            if (course.avgRating) {
                const rating = course.avgRating;
                if (rating === 5) distribution['5 étoiles']++;
                else if (rating >= 4) distribution['4-5 étoiles']++;
                else if (rating >= 3) distribution['3-4 étoiles']++;
                else if (rating >= 2) distribution['2-3 étoiles']++;
                else distribution['0-2 étoiles']++;
            }
        });

        return Object.entries(distribution).map(([name, value]) => ({
            name,
            value
        }));
    };

    const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
        <div className="bg-white rounded-lg shadow-md p-6">
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
                    <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques</h1>
                <p className="text-gray-600">
                    Vue d'ensemble des performances et tendances
                </p>
            </div>

            {/* Cartes de statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={BookOpen}
                    title="Total Cours"
                    value={stats.overview.totalCourses}
                    subtitle="Cours et services"
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Users}
                    title="Total Avis"
                    value={stats.overview.totalReviews}
                    subtitle="Évaluations soumises"
                    color="bg-green-500"
                />
                <StatCard
                    icon={Star}
                    title="Note Moyenne"
                    value={stats.overview.averageRating}
                    subtitle="Sur 5 étoiles"
                    color="bg-yellow-500"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Satisfaction"
                    value={`${(stats.overview.averageRating * 20).toFixed(0)}%`}
                    subtitle="Taux de satisfaction"
                    color="bg-purple-500"
                />
            </div>

            {/* Top 5 des cours */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                    <Award className="w-6 h-6 text-yellow-500 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">
                        Top 5 des Cours les Mieux Notés
                    </h2>
                </div>

                {stats.topCourses.length > 0 ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topCourses} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 5]} />
                                <YAxis type="category" dataKey="code" width={80} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                                                    <p className="font-semibold text-gray-900">{data.name}</p>
                                                    <p className="text-sm text-gray-600">Code: {data.code}</p>
                                                    <p className="text-sm text-blue-600">Note: {data.rating}/5</p>
                                                    <p className="text-sm text-gray-600">{data.reviews} avis</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="rating" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-12">
                        Pas encore de données disponibles
                    </p>
                )}
            </div>

            {/* Graphiques côte à côte */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribution des notes */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-6">
                        <BarChart3 className="w-6 h-6 text-blue-500 mr-2" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Distribution des Notes
                        </h2>
                    </div>

                    {stats.ratingDistribution.some(d => d.value > 0) ? (
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.ratingDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {stats.ratingDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-12">
                            Pas encore de données disponibles
                        </p>
                    )}
                </div>

                {/* Statistiques par département */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-6">
                        <BookOpen className="w-6 h-6 text-green-500 mr-2" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Statistiques par Département
                        </h2>
                    </div>

                    {stats.departmentStats.length > 0 ? (
                        <div className="space-y-4">
                            {stats.departmentStats.map((dept, index) => (
                                <div key={index} className="border-b pb-3 last:border-b-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-gray-900">{dept.name}</span>
                                        <span className="text-sm text-gray-600">
                      {dept.courses} cours
                    </span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {dept.avgRating}/5
                    </span>
                                        <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                                            {dept.reviews} avis
                    </span>
                                    </div>
                                    {/* Barre de progression */}
                                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${(dept.avgRating / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-12">
                            Pas encore de données disponibles
                        </p>
                    )}
                </div>
            </div>

            {/* Informations complémentaires */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📊 À propos de ces statistiques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <h4 className="font-medium mb-1">Sources des données</h4>
                        <p className="text-gray-600">
                            Les statistiques sont calculées en temps réel à partir des avis approuvés par les modérateurs.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Mises à jour</h4>
                        <p className="text-gray-600">
                            Les données sont actualisées automatiquement après chaque nouvel avis approuvé.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;