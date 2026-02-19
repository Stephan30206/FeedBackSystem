import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import reviewService from '../../services/reviewService';
import toast from 'react-hot-toast';
import {
    ArrowLeft,
    Star,
    BookOpen,
    Users,
    Calendar,
    User,
    MessageSquare,
    Plus,
    TrendingUp,
    Settings,
    CheckCircle2,
    Clock
} from 'lucide-react';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isStudent } = useAuth();

    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasUserReview, setHasUserReview] = useState(false);

    useEffect(() => {
        loadCourseData();
    }, [id, user]);

    const loadCourseData = async () => {
        try {
            setLoading(true);
            const courseResponse = await courseService.getCourseById(id);
            setCourse(courseResponse.data);

            const reviewsResponse = await reviewService.getReviewsByCourse(id);
            const reviewsData = reviewsResponse.data.content || reviewsResponse.data;
            setReviews(reviewsData);

            try {
                const statsResponse = await courseService.getCourseStatistics(id);
                setStats(statsResponse.data);
            } catch (error) {
                console.log('Stats unavailable');
            }

            if (isStudent && user) {
                setHasUserReview(reviewsData.some(r => r.userId === user.userId));
            }
        } catch (error) {
            console.error('Error loading course:', error);
            toast.error('Erreur lors du chargement du cours');
            navigate('/app/courses');
        } finally {
            setLoading(false);
        }
    };

    const RatingStars = ({ rating, size = 18 }) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                    key={s} 
                    size={size} 
                    className={s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                />
            ))}
        </div>
    );

    const ReviewCard = ({ review }) => (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 font-bold overflow-hidden">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewerName || 'Etudiant')}&background=f8fafc&color=94a3b8`} 
                            alt="Reviewer" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{review.anonymous ? 'Anonyme' : review.reviewerName || 'Étudiant'}</p>
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                            <Clock size={12} />
                            {new Date(review.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <RatingStars rating={review.ratingOverall} />
                    <span className="text-xs font-bold text-slate-400">{review.ratingOverall.toFixed(1)} / 5</span>
                </div>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-2xl grid grid-cols-3 gap-4 border border-slate-50">
                <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Clarté</p>
                    <p className="text-sm font-bold text-[#007AB8]">{review.ratingClarity || '-'}/5</p>
                </div>
                <div className="text-center border-x border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Matériel</p>
                    <p className="text-sm font-bold text-[#007AB8]">{review.ratingMaterial || '-'}/5</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pédagogie</p>
                    <p className="text-sm font-bold text-[#007AB8]">{review.ratingPedagogy || '-'}/5</p>
                </div>
            </div>

            <p className="text-slate-600 leading-relaxed italic">"{review.comment}"</p>

            {review.teacherResponse && (
                <div className="mt-6 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-[#007AB8] flex-shrink-0">
                        <MessageSquare size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-900 mb-1 uppercase tracking-widest">Réponse de l'enseignant</p>
                        <p className="text-sm text-blue-700 leading-relaxed">{review.teacherResponse}</p>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AB8] mb-4"></div>
                <p className="text-slate-500 font-medium">Chargement des détails...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back Button */}
            <button
                onClick={() => navigate('/app/courses')}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-all group"
            >
                <div className="p-2 bg-white rounded-xl border border-slate-100 group-hover:bg-slate-50 transition-colors">
                    <ArrowLeft size={18} />
                </div>
                Retour au catalogue
            </button>

            {/* Course Header Hero */}
            <div className="relative bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/10">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(0,122,184,0.3),transparent)]"></div>
                </div>

                <div className="relative p-12 flex flex-col lg:flex-row gap-10 items-start lg:items-center">
                    <div className="flex-1 space-y-6">
                        <div className="flex flex-wrap gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                course.type === 'service' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-[#007AB8] text-white'
                            }`}>
                                {course.type === 'service' ? 'Service' : 'Cours'}
                            </span>
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/60 border border-white/10">
                                {course.code}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                            {course.name}
                        </h1>

                        <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
                            {course.description || "Aucune description détaillée n'est disponible pour ce cours actuellement."}
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                            {course.teacherName && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60"><User size={16} /></div>
                                    <span className="text-sm font-bold text-white/80">{course.teacherName}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60"><BookOpen size={16} /></div>
                                <span className="text-sm font-bold text-white/80">{course.department || 'Général'}</span>
                            </div>
                            {course.credits && (
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60"><TrendingUp size={16} /></div>
                                    <span className="text-sm font-bold text-white/80">{course.credits} Crédits</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Score Card */}
                    <div className="w-full lg:w-auto bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] text-center flex flex-col items-center">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-2">Note moyenne</p>
                        <div className="text-7xl font-black text-white mb-4">
                            {course.avgRating ? course.avgRating.toFixed(1) : '-.-'}
                        </div>
                        <div className="mb-4">
                            <RatingStars rating={course.avgRating || 0} size={24} />
                        </div>
                        <div className="flex items-center gap-2 text-white/40 font-bold text-sm">
                            <Users size={16} />
                            <span>{course.totalReviews || 0} avis étudiants</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Stats & Actions */}
                <div className="lg:col-span-1 space-y-10">
                    {/* Action Card */}
                    {isStudent && (
                        <div className="bg-[#007AB8] p-8 rounded-[32px] text-white space-y-6 shadow-xl shadow-blue-900/10">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner">
                                <Plus size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Partagez votre avis</h3>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    Votre retour est précieux pour améliorer la qualité de l'enseignement à l'UAZ.
                                </p>
                            </div>
                            {!hasUserReview ? (
                                <button
                                    onClick={() => navigate(`/app/courses/${id}/review`)}
                                    className="w-full py-4 bg-white text-[#007AB8] rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg"
                                >
                                    Donner mon avis
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 py-4 px-6 bg-white/10 rounded-2xl border border-white/20 text-sm font-bold">
                                    <CheckCircle2 size={20} className="text-blue-200" />
                                    Avis déjà soumis
                                </div>
                            )}
                        </div>
                    )}

                    {/* Detailed Stats */}
                    {stats && (
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp size={20} className="text-[#007AB8]" /> Détails
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: "Clarté", val: stats.avgRatingClarity },
                                    { label: "Matériel", val: stats.avgRatingMaterial },
                                    { label: "Pédagogie", val: stats.avgRatingPedagogy }
                                ].map((s, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-slate-500">{s.label}</span>
                                            <span className="text-slate-900">{s.val ? s.val.toFixed(1) : '-.-'}/5</span>
                                        </div>
                                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#007AB8] rounded-full transition-all duration-1000"
                                                style={{ width: `${(s.val || 0) * 20}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Reviews List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Avis étudiants <span className="text-slate-300 ml-2">{reviews.length}</span>
                        </h2>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <ReviewCard key={review.reviewId} review={review} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 bg-white rounded-[32px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-6">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun avis publié</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                Soyez le premier à partager votre expérience pour ce {course.type === 'service' ? 'service' : 'cours'}.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
