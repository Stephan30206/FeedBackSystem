import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import courseService from '../../services/courseService';
import reviewService from '../../services/reviewService';
import toast from 'react-hot-toast';
import { ArrowLeft, Star, Send, CheckCircle } from 'lucide-react';

/**
 * Composant ReviewForm
 * Formulaire pour laisser un avis sur un cours
 */
const ReviewForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        ratingOverall: 0,
        ratingClarity: 0,
        ratingMaterial: 0,
        ratingPedagogy: 0,
        comment: '',
        anonymous: false
    });

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            const response = await courseService.getCourseById(id);
            setCourse(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement du cours:', error);
            toast.error('Erreur lors du chargement du cours');
            navigate('/courses');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCommentChange = (e) => {
        setFormData(prev => ({
            ...prev,
            comment: e.target.value
        }));
    };

    const handleAnonymousChange = (e) => {
        setFormData(prev => ({
            ...prev,
            anonymous: e.target.checked
        }));
    };

    const validateForm = () => {
        if (formData.ratingOverall === 0) {
            toast.error('Veuillez donner une note globale');
            return false;
        }

        if (formData.comment.trim().length < 10) {
            toast.error('Le commentaire doit contenir au moins 10 caractères');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            const reviewData = {
                courseId: parseInt(id),
                ratingOverall: formData.ratingOverall,
                ratingClarity: formData.ratingClarity || null,
                ratingMaterial: formData.ratingMaterial || null,
                ratingPedagogy: formData.ratingPedagogy || null,
                comment: formData.comment.trim(),
                anonymous: formData.anonymous
            };

            await reviewService.createReview(reviewData);

            toast.success('Avis envoyé avec succès! Il sera visible après modération.');
            navigate(`/courses/${id}`);
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Erreur lors de l\'envoi de l\'avis';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = ({ label, value, onChange, required = false }) => {
        const [hover, setHover] = useState(0);

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => onChange(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${
                                    star <= (hover || value)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
            {value > 0 ? `${value}/5` : 'Non noté'}
          </span>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Bouton retour */}
            <button
                onClick={() => navigate(`/courses/${id}`)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour au cours
            </button>

            {/* En-tête */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Évaluer le cours
                </h1>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h2 className="font-semibold text-gray-900 mb-1">{course.name}</h2>
                    <p className="text-sm text-gray-600">{course.code}</p>
                    {course.teacherName && (
                        <p className="text-sm text-gray-600">Enseignant: {course.teacherName}</p>
                    )}
                </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {/* Note globale (obligatoire) */}
                <StarRating
                    label="Note globale"
                    value={formData.ratingOverall}
                    onChange={(value) => handleRatingChange('ratingOverall', value)}
                    required
                />

                <div className="border-t pt-6">
                    <p className="text-sm font-medium text-gray-700 mb-4">
                        Critères détaillés (optionnel)
                    </p>

                    <div className="space-y-4">
                        {/* Clarté */}
                        <StarRating
                            label="Clarté des explications"
                            value={formData.ratingClarity}
                            onChange={(value) => handleRatingChange('ratingClarity', value)}
                        />

                        {/* Matériel */}
                        <StarRating
                            label="Qualité du matériel pédagogique"
                            value={formData.ratingMaterial}
                            onChange={(value) => handleRatingChange('ratingMaterial', value)}
                        />

                        {/* Pédagogie */}
                        <StarRating
                            label="Approche pédagogique"
                            value={formData.ratingPedagogy}
                            onChange={(value) => handleRatingChange('ratingPedagogy', value)}
                        />
                    </div>
                </div>

                {/* Commentaire */}
                <div className="border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Votre commentaire <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={formData.comment}
                        onChange={handleCommentChange}
                        rows={6}
                        placeholder="Partagez votre expérience avec ce cours. Soyez constructif et détaillé (minimum 10 caractères)..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        {formData.comment.length} caractères
                    </p>
                </div>

                {/* Option anonyme */}
                <div className="border-t pt-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={handleAnonymousChange}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
              <span className="text-sm font-medium text-gray-900">
                Publier cet avis de manière anonyme
              </span>
                            <p className="text-xs text-gray-500">
                                Votre nom ne sera pas visible publiquement
                            </p>
                        </div>
                    </label>
                </div>

                {/* Informations importantes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">Avant de soumettre:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Votre avis sera soumis à modération avant publication</li>
                                <li>Soyez constructif et respectueux dans vos commentaires</li>
                                <li>Vous ne pourrez évaluer ce cours qu'une seule fois</li>
                                <li>Votre avis aidera les autres étudiants et l'enseignant</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <div className="flex items-center justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/courses/${id}`)}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        disabled={submitting}
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || formData.ratingOverall === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Envoi en cours...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 mr-2" />
                                Soumettre l'avis
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;