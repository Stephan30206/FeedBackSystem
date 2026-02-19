import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const AdminModeration = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingReviews();
    }, []);

    const fetchPendingReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reviews/pending');
            setReviews(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (reviewId, status) => {
        try {
            await api.put(`/reviews/${reviewId}/moderate`, { status });
            setReviews(reviews.filter(r => r.reviewId !== reviewId));
        } catch (err) {
            setError('Erreur lors de la modération');
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Modération des Avis</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            {reviews.length === 0 ? (
                <div className="bg-green-100 text-green-700 p-4 rounded">
                    Aucun avis en attente de modération! 🎉
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.reviewId} className="bg-white rounded-lg shadow p-6">
                            <div className="mb-4">
                                <h3 className="font-bold text-lg">{review.courseName}</h3>
                                <p className="text-sm text-gray-600">Par: {review.reviewerName}</p>
                            </div>

                            <p className="text-gray-700 mb-4">{review.comment}</p>

                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex space-x-4">
                                    <div>
                                        <span className="text-sm font-semibold">Overall:</span>
                                        <span className="ml-2">{review.ratingOverall}/5</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handleModerate(review.reviewId, 'APPROVED')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Approuver</span>
                                </button>
                                <button
                                    onClick={() => handleModerate(review.reviewId, 'REJECTED')}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    <XCircle className="w-4 h-4" />
                                    <span>Rejeter</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminModeration;
