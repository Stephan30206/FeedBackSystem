package com.uaz.backend.service;

import com.uaz.backend.dto.ReviewRequest;
import com.uaz.backend.dto.ReviewResponse;
import com.uaz.backend.entity.Course;
import com.uaz.backend.entity.Review;
import com.uaz.backend.entity.User;
import com.uaz.backend.repository.CourseRepository;
import com.uaz.backend.repository.ReviewRepository;
import com.uaz.backend.repository.ReviewResponseRepository;
import com.uaz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewResponseRepository reviewResponseRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public Page<ReviewResponse> getApprovedReviewsByCourse(Integer courseId, Pageable pageable) {
        Page<Review> reviews = reviewRepository.findByCourseIdAndModerationStatus(
                courseId,
                Review.ModerationStatus.APPROVED,
                pageable
        );
        return reviews.map(this::convertToDTO);
    }

    /**
     * Obtenir un avis par ID
     */
    public ReviewResponse getReviewById(Integer id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        return convertToDTO(review);
    }

    /**
     * Obtenir les avis d'un utilisateur
     */
    public List<ReviewResponse> getReviewsByUser(Integer userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Créer un nouvel avis
     */
    public ReviewResponse createReview(Integer userId, ReviewRequest request) {
        // Vérifier si l'utilisateur existe
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier si l'utilisateur est un étudiant
        if (!user.getRole().equals(User.UserRole.STUDENT)) {
            throw new IllegalArgumentException("Seuls les étudiants peuvent laisser des avis");
        }

        // Vérifier si le cours existe
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        // Vérifier si l'utilisateur a déjà évalué ce cours
        if (reviewRepository.existsByUserIdAndCourseId(userId, request.getCourseId())) {
            throw new IllegalArgumentException("Vous avez déjà évalué ce cours");
        }

        // Créer l'avis
        Review review = Review.builder()
                .user(user)
                .course(course)
                .ratingOverall(request.getRatingOverall())
                .ratingClarity(request.getRatingClarity())
                .ratingMaterial(request.getRatingMaterial())
                .ratingPedagogy(request.getRatingPedagogy())
                .comment(request.getComment())
                .anonymous(request.getAnonymous() != null ? request.getAnonymous() : false)
                .moderationStatus(Review.ModerationStatus.PENDING)
                .build();

        review = reviewRepository.save(review);
        return convertToDTO(review);
    }

    /**
     * Mettre à jour un avis
     */
    public ReviewResponse updateReview(Integer reviewId, Integer userId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        // Vérifier que l'utilisateur est le propriétaire
        if (!review.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Vous ne pouvez modifier que vos propres avis");
        }

        // Mettre à jour les champs
        review.setRatingOverall(request.getRatingOverall());
        review.setRatingClarity(request.getRatingClarity());
        review.setRatingMaterial(request.getRatingMaterial());
        review.setRatingPedagogy(request.getRatingPedagogy());
        review.setComment(request.getComment());
        review.setAnonymous(request.getAnonymous() != null ? request.getAnonymous() : review.getAnonymous());

        // Remettre en attente de modération après modification
        review.setModerationStatus(Review.ModerationStatus.PENDING);

        review = reviewRepository.save(review);
        return convertToDTO(review);
    }

    /**
     * Supprimer un avis
     */
    public void deleteReview(Integer reviewId, Integer userId, User.UserRole userRole) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        // Vérifier les permissions (propriétaire ou admin)
        if (!review.getUser().getUserId().equals(userId) && !userRole.equals(User.UserRole.ADMIN)) {
            throw new IllegalArgumentException("Vous n'avez pas la permission de supprimer cet avis");
        }

        reviewRepository.delete(review);
    }

    /**
     * Obtenir les avis en attente de modération
     */
    public List<ReviewResponse> getPendingReviews() {
        return reviewRepository.findByModerationStatusOrderByCreatedAtDesc(Review.ModerationStatus.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Modérer un avis
     */
    public ReviewResponse moderateReview(Integer reviewId, String status) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        Review.ModerationStatus moderationStatus;
        try {
            moderationStatus = Review.ModerationStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut de modération invalide: " + status);
        }

        review.setModerationStatus(moderationStatus);
        review = reviewRepository.save(review);

        return convertToDTO(review);
    }

    /**
     * Obtenir les avis pour les cours d'un enseignant
     */
    public List<ReviewResponse> getReviewsForTeacher(Integer teacherId) {
        return reviewRepository.findReviewsForTeacher(teacherId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Ajouter une réponse d'enseignant
     */
    public void addTeacherResponse(Integer reviewId, Integer teacherId, String responseText) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        // Vérifier que l'enseignant enseigne ce cours
        if (review.getCourse().getTeacher() == null ||
                !review.getCourse().getTeacher().getUserId().equals(teacherId)) {
            throw new IllegalArgumentException("Vous ne pouvez répondre qu'aux avis de vos cours");
        }

        // Créer la réponse
        com.uaz.backend.entity.ReviewResponse response = com.uaz.backend.entity.ReviewResponse.builder()
                .review(review)
                .teacher(review.getCourse().getTeacher())
                .responseText(responseText)
                .build();

        reviewResponseRepository.save(response);
    }

    /**
     * Mettre à jour une réponse d'enseignant
     */
    public void updateTeacherResponse(Integer reviewId, Integer teacherId, String responseText) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        com.uaz.backend.entity.ReviewResponse response = reviewResponseRepository.findByReviewId(reviewId)
                .orElseThrow(() -> new RuntimeException("Réponse non trouvée"));

        // Vérifier les permissions
        if (!response.getTeacher().getUserId().equals(teacherId)) {
            throw new IllegalArgumentException("Vous ne pouvez modifier que vos propres réponses");
        }

        response.setResponseText(responseText);
        reviewResponseRepository.save(response);
    }

    /**
     * Supprimer une réponse d'enseignant
     */
    public void deleteTeacherResponse(Integer reviewId, Integer teacherId) {
        com.uaz.backend.entity.ReviewResponse response = reviewResponseRepository.findByReviewId(reviewId)
                .orElseThrow(() -> new RuntimeException("Réponse non trouvée"));

        // Vérifier les permissions
        if (!response.getTeacher().getUserId().equals(teacherId)) {
            throw new IllegalArgumentException("Vous ne pouvez supprimer que vos propres réponses");
        }

        reviewResponseRepository.delete(response);
    }

    /**
     * Compter les avis en attente
     */
    public long countPendingReviews() {
        return reviewRepository.countPendingReviews();
    }

    /**
     * Obtenir les avis récents approuvés
     */
    public List<ReviewResponse> getRecentApprovedReviews(Integer limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return reviewRepository.findRecentApprovedReviews(pageable)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Vérifier si un utilisateur a déjà évalué un cours
     */
    public boolean hasUserReviewedCourse(Integer userId, Integer courseId) {
        return reviewRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    /**
     * Convertir une entité Review en DTO
     */
    private ReviewResponse convertToDTO(Review review) {
        // Récupérer la réponse de l'enseignant si elle existe
        String teacherResponse = null;
        com.uaz.backend.entity.ReviewResponse response =
                reviewResponseRepository.findByReviewId(review.getReviewId()).orElse(null);
        if (response != null) {
            teacherResponse = response.getResponseText();
        }

        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUser().getUserId())
                .courseId(review.getCourse().getCourseId())
                .courseName(review.getCourse().getName())
                .courseCode(review.getCourse().getCode())
                .ratingOverall(review.getRatingOverall())
                .ratingClarity(review.getRatingClarity())
                .ratingMaterial(review.getRatingMaterial())
                .ratingPedagogy(review.getRatingPedagogy())
                .comment(review.getComment())
                .anonymous(review.getAnonymous())
                .reviewerName(review.getAnonymous() ? "Anonyme" : review.getUser().getFullName())
                .moderationStatus(review.getModerationStatus().name())
                .teacherResponse(teacherResponse)
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
