import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import reviewService from '../../services/reviewService';
import toast from 'react-hot-toast';
import {
    MessageSquare,
    BookOpen,
    Users,
    TrendingUp,
    Star,
    Award,
    Settings,
    ChevronRight,
    Search
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, isStudent, isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [myReviewsCount, setMyReviewsCount] = useState(0);
    const [stats, setStats] = useState({
        avisSoumis: 0,
        coursServices: 0,
        mesAvis: 0,
        noteMoyenne: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, [user]);

    const loadDashboardData = async () => {
        if (!user) return;
        try {
            setLoading(true);
            
            // 1. Get filtered courses for user
            const coursesRes = await courseService.getCoursesForUser(user.userId);
            const userCourses = coursesRes.data;
            setCourses(userCourses);

            // 2. Get user's own reviews
            let userReviews = [];
            try {
                const reviewsRes = await reviewService.getMyReviews();
                userReviews = reviewsRes.data;
                setMyReviewsCount(userReviews.length);
            } catch (e) {
                console.error("Error loading user reviews", e);
            }

            // 3. Calculate Stats
            const totalReviewsSystem = userCourses.reduce((acc, c) => acc + (c.totalReviews || 0), 0);
            const avgRatingSystem = userCourses.length > 0 
                ? (userCourses.reduce((acc, c) => acc + (c.avgRating || 0), 0) / userCourses.filter(c => c.avgRating).length || 0).toFixed(1)
                : 0;

            setStats({
                avisSoumis: totalReviewsSystem,
                coursServices: userCourses.length,
                mesAvis: userReviews.length,
                noteMoyenne: avgRatingSystem
            });

        } catch (error) {
            console.error('Erreur dashboard:', error);
            toast.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                <p className="text-sm font-medium text-slate-500">{label}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AB8] mb-4"></div>
                <p className="text-slate-500 font-medium">Chargement de votre tableau de bord...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
                <p className="text-slate-500 font-medium">Vue d'ensemble du système de feedback</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={MessageSquare} 
                    label="Avis soumis" 
                    value={stats.avisSoumis} 
                    color="bg-blue-50 text-blue-600" 
                />
                <StatCard 
                    icon={BookOpen} 
                    label="Cours & Services" 
                    value={stats.coursServices} 
                    color="bg-yellow-50 text-yellow-600" 
                />
                <StatCard 
                    icon={Users} 
                    label="Mes avis" 
                    value={stats.mesAvis} 
                    color="bg-cyan-50 text-cyan-600" 
                />
                <StatCard 
                    icon={TrendingUp} 
                    label="Note moyenne" 
                    value={stats.noteMoyenne} 
                    color="bg-indigo-50 text-indigo-600" 
                />
            </div>

            {/* Content Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Cours populaires</h2>
                    <button 
                        onClick={() => navigate('/app/courses')}
                        className="text-sm font-bold text-[#007AB8] flex items-center gap-1 hover:underline"
                    >
                        Tout voir <ChevronRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, 6).map((course) => (
                        <div 
                            key={course.courseId}
                            onClick={() => navigate(`/app/courses/${course.courseId}`)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#007AB8] group-hover:bg-[#007AB8] group-hover:text-white transition-colors">
                                    {course.type === 'service' ? <Settings size={22} /> : <BookOpen size={22} />}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                    course.type === 'service' 
                                        ? 'bg-slate-800 text-white' 
                                        : 'bg-[#007AB8] text-white'
                                }`}>
                                    {course.type === 'service' ? 'Service' : 'Cours'}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#007AB8] transition-colors line-clamp-1">
                                {course.name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                                {course.teacherName || 'Responsable'} 
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                {course.department || 'Général'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star 
                                            key={s} 
                                            size={16} 
                                            className={s <= Math.round(course.avgRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Users size={16} />
                                    <span className="text-xs font-bold">{course.totalReviews || 0} avis</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {courses.length === 0 && (
                        <div className="col-span-full py-20 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <BookOpen size={48} className="mb-4 opacity-20" />
                            <p className="font-bold">Aucun cours trouvé dans votre domaine</p>
                            <p className="text-sm">Contactez l'administration si cela semble être une erreur.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
