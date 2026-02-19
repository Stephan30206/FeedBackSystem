import { useEffect, useState } from 'react';
import { Trash2, Edit2, Star } from 'lucide-react';
import api from '../../services/api';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const fetchMyReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reviews/my');
            setReviews(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avis?')) {
            try {
                await api.delete(`/reviews/${reviewId}`);
                setReviews(reviews.filter(r => r.reviewId !== reviewId));
            } catch (err) {
                setError('Erreur lors de la suppression');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Mes Avis</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            {reviews.length === 0 ? (
                <div className="bg-blue-100 text-blue-700 p-4 rounded">
                    Vous n'avez pas encore laissé d'avis
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.reviewId} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{review.courseName}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(Math.round(review.ratingOverall))].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleDelete(review.reviewId)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-3">{review.comment}</p>

                            <div className="bg-gray-50 rounded p-3 mb-3">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="font-semibold">Globalité:</span>
                                        <span className="ml-2">{review.ratingOverall}/5</span>
                                    </div>
                                    {review.ratingClarity && (
                                        <div>
                                            <span className="font-semibold">Clarté:</span>
                                            <span className="ml-2">{review.ratingClarity}/5</span>
                                        </div>
                                    )}
                                    {review.ratingMaterial && (
                                        <div>
                                            <span className="font-semibold">Matériel:</span>
                                            <span className="ml-2">{review.ratingMaterial}/5</span>
                                        </div>
                                    )}
                                    {review.ratingPedagogy && (
                                        <div>
                                            <span className="font-semibold">Pédagogie:</span>
                                            <span className="ml-2">{review.ratingPedagogy}/5</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded text-xs font-medium ${
                                    review.moderationStatus === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    review.moderationStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {review.moderationStatus === 'APPROVED' ? 'Approuvé' :
                                     review.moderationStatus === 'REJECTED' ? 'Rejeté' : 'En attente'}
                                </span>
                                {review.anonymous && <span className="text-xs text-gray-500">Anonyme</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviews;
