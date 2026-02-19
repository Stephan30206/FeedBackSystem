import api from './api.jsx';

class ReviewService {
    // Obtenir les avis d'un cours
    getReviewsByCourse(courseId, page = 0, size = 20) {
        return api.get(`/reviews/course/${courseId}`, {
            params: { page, size }
        });
    }

    // Obtenir les avis de l'utilisateur courant
    getMyReviews() {
        return api.get('/reviews/my');
    }

    // Créer un avis
    createReview(reviewData) {
        return api.post('/reviews', reviewData);
    }

    // Mettre à jour un avis
    updateReview(id, reviewData) {
        return api.put(`/reviews/${id}`, reviewData);
    }

    // Supprimer un avis
    deleteReview(id) {
        return api.delete(`/reviews/${id}`);
    }

    // Obtenir les avis en attente de modération (admin)
    getPendingReviews() {
        return api.get('/reviews/pending');
    }

    // Modérer un avis (admin)
    moderateReview(id, status) {
        return api.put(`/reviews/${id}/moderate`, { status });
    }

    // Ajouter une réponse à un avis (teacher)
    addResponse(reviewId, responseText) {
        return api.post(`/reviews/${reviewId}/response`, { responseText });
    }
}

export default new ReviewService();