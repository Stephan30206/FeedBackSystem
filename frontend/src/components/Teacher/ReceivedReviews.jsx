import { useEffect, useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import api from '../../services/api';

const ReceivedReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseText, setResponseText] = useState({});

    useEffect(() => {
        fetchTeacherReviews();
    }, []);

    const fetchTeacherReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/reviews/teacher/my');
            setReviews(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReplyClick = (reviewId) => {
        setResponseText({ ...responseText, [reviewId]: '' });
    };

    const handleReply = async (reviewId) => {
        if (!responseText[reviewId]?.trim()) {
            alert('Veuillez entrer une réponse');
            return;
        }

        try {
            await api.post(`/reviews/${reviewId}/response`, {
                responseText: responseText[reviewId]
            });
            setResponseText({ ...responseText, [reviewId]: '' });
            fetchTeacherReviews();
        } catch (err) {
            setError('Erreur lors de l\'envoi de la réponse');
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Avis Reçus</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            {reviews.length === 0 ? (
                <div className="bg-blue-100 text-blue-700 p-4 rounded">
                    Aucun avis reçu pour vos cours
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review.reviewId} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{review.courseName}</h3>
                                    <p className="text-sm text-gray-600">
                                        Par: {review.reviewerName} • {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {[...Array(Math.round(review.ratingOverall))].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 mb-4">{review.comment}</p>

                            {review.teacherResponse ? (
                                <div className="bg-blue-50 rounded p-4 mb-4">
                                    <p className="text-sm font-semibold text-blue-900 mb-2">Votre réponse:</p>
                                    <p className="text-gray-700">{review.teacherResponse}</p>
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded p-4 mb-4">
                                    {responseText[review.reviewId] !== undefined ? (
                                        <div>
                                            <textarea
                                                value={responseText[review.reviewId]}
                                                onChange={(e) => setResponseText({
                                                    ...responseText,
                                                    [review.reviewId]: e.target.value
                                                })}
                                                placeholder="Écrivez votre réponse..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                                                rows="3"
                                            />
                                            <button
                                                onClick={() => handleReply(review.reviewId)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Envoyer la réponse
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleReplyClick(review.reviewId)}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            <span>Répondre</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReceivedReviews;
