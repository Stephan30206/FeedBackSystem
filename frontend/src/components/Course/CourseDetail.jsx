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
    TrendingUp
} from 'lucide-react';

/**
 * Composant CourseDetail
 * Page de détails d'un cours avec ses avis
 */
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
    }, [id]);

    const loadCourseData = async () => {
        try {
            setLoading(true);

            // Charger le cours
            const courseResponse = await courseService.getCourseById(id);
            setCourse(courseResponse.data);

            // Charger les avis
            const reviewsResponse = await reviewService.getReviewsByCourse(id);
            setReviews(reviewsResponse.data.content || reviewsResponse.data);

            // Charger les statistiques
            try {
                const statsResponse = await courseService.getCourseStatistics(id);
                setStats(statsResponse.data);
            } catch (error) {
                console.log('Statistiques non disponibles');
            }

            // Vérifier si l'utilisateur a déjà laissé un avis
            if (isStudent) {
                const userReviews = reviewsResponse.data.content || reviewsResponse.data;
                const userHasReviewed = userReviews.some(
                    review => review.userId === user.userId
                );
                setHasUserReview(userHasReviewed);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du cours:', error);
            toast.error('Erreur lors du chargement du cours');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                );
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <Star key={i} className="w-5 h-5 fill-yellow-200 text-yellow-400" />
                );
            } else {
                stars.push(
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                );
            }
        }
        return stars;
    };

    const ReviewCard = ({ review }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* En-tête de l'avis */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">
                            {review.anonymous ? 'Anonyme' : review.reviewerName || 'Étudiant'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-1">
                    {renderStars(review.ratingOverall)}
                    <span className="ml-1 text-sm font-semibold text-gray-700">
            {review.ratingOverall.toFixed(1)}
          </span>
                </div>
            </div>

            {/* Notes détaillées */}
            {(review.ratingClarity || review.ratingMaterial || review.ratingPedagogy) && (
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                    {review.ratingClarity && (
                        <div className="bg-blue-50 px-2 py-1 rounded">
                            <span className="text-gray-600">Clarté: </span>
                            <span className="font-semibold text-blue-700">{review.ratingClarity}/5</span>
                        </div>
                    )}
                    {review.ratingMaterial && (
                        <div className="bg-green-50 px-2 py-1 rounded">
                            <span className="text-gray-600">Matériel: </span>
                            <span className="font-semibold text-green-700">{review.ratingMaterial}/5</span>
                        </div>
                    )}
                    {review.ratingPedagogy && (
                        <div className="bg-purple-50 px-2 py-1 rounded">
                            <span className="text-gray-600">Pédagogie: </span>
                            <span className="font-semibold text-purple-700">{review.ratingPedagogy}/5</span>
                        </div>
                    )}
                </div>
            )}

            {/* Commentaire */}
            {review.comment && (
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            )}

            {/* Réponse de l'enseignant */}
            {review.teacherResponse && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-xs font-semibold text-blue-800 mb-1">
                        Réponse de l'enseignant:
                    </p>
                    <p className="text-sm text-gray-700">{review.teacherResponse}</p>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du cours...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Cours non trouvé</p>
                <button
                    onClick={() => navigate('/courses')}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                >
                    Retour aux cours
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Bouton retour */}
            <button
                onClick={() => navigate('/courses')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour aux cours
            </button>

            {/* En-tête du cours */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.type === 'course'
                      ? 'bg-blue-500 bg-opacity-50'
                      : 'bg-green-500 bg-opacity-50'
              }`}>
                {course.type === 'course' ? 'Cours' : 'Service'}
              </span>
                            <span className="text-blue-100">{course.code}</span>
                        </div>

                        <h1 className="text-3xl font-bold mb-3">{course.name}</h1>

                        <p className="text-blue-100 mb-4 max-w-3xl">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm">
                            {course.teacherName && (
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    <span>{course.teacherName}</span>
                                </div>
                            )}
                            {course.department && (
                                <div className="flex items-center">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    <span>{course.department}</span>
                                </div>
                            )}
                            {course.semester && (
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{course.semester}</span>
                                </div>
                            )}
                            {course.credits && (
                                <div className="flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    <span>{course.credits} crédits</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Carte de notation */}
                    <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center min-w-[200px]">
                        <div className="text-5xl font-bold mb-2">
                            {course.avgRating ? course.avgRating.toFixed(1) : 'N/A'}
                        </div>
                        <div className="flex items-center justify-center mb-2">
                            {course.avgRating ? renderStars(course.avgRating) : (
                                <span className="text-sm">Pas encore noté</span>
                            )}
                        </div>
                        <div className="flex items-center justify-center text-sm">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{course.totalReviews || 0} avis</span>
                        </div>
                    </div>
                </div>

                {/* Bouton pour laisser un avis (étudiants uniquement) */}
                {isStudent && (
                    <div className="mt-6">
                        {!hasUserReview ? (
                            <button
                                onClick={() => navigate(`/courses/${id}/review`)}
                                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Laisser un avis
                            </button>
                        ) : (
                            <div className="bg-green-500 bg-opacity-30 px-4 py-2 rounded-lg inline-flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Vous avez déjà évalué ce cours
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Statistiques détaillées */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Note Globale</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {stats.avgRatingOverall?.toFixed(1) || 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Clarté</p>
                        <p className="text-2xl font-bold text-green-600">
                            {stats.avgRatingClarity?.toFixed(1) || 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Matériel</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {stats.avgRatingMaterial?.toFixed(1) || 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Pédagogie</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {stats.avgRatingPedagogy?.toFixed(1) || 'N/A'}
                        </p>
                    </div>
                </div>
            )}

            {/* Liste des avis */}
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Avis des étudiants ({reviews.length})
                    </h2>
                </div>

                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReviewCard key={review.reviewId} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 text-lg">Aucun avis pour le moment</p>
                        {isStudent && !hasUserReview && (
                            <button
                                onClick={() => navigate(`/courses/${id}/review`)}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Soyez le premier à donner votre avis
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetail;