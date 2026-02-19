package com.uaz.backend.controller;

import com.uaz.backend.dto.*;
import com.uaz.backend.entity.User;
import com.uaz.backend.service.ReviewService;
import com.uaz.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller pour la gestion des avis
 */
@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;

    /**
     * Obtenir les avis d'un cours (avec pagination)
     * GET /api/reviews/course/{courseId}?page=0&size=20
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByCourse(
            @PathVariable Integer courseId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ReviewResponse> reviews = reviewService.getApprovedReviewsByCourse(courseId, pageable);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Obtenir un avis par son ID
     * GET /api/reviews/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getReviewById(@PathVariable Integer id) {
        try {
            ReviewResponse review = reviewService.getReviewById(id);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Avis non trouvé"));
        }
    }

    /**
     * Obtenir les avis de l'utilisateur connecté
     * GET /api/reviews/my
     */
    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ReviewResponse>> getMyReviews(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<ReviewResponse> reviews = reviewService.getReviewsByUser(user.getUserId());
        return ResponseEntity.ok(reviews);
    }

    /**
     * Créer un nouvel avis (Étudiants uniquement)
     * POST /api/reviews
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> createReview(
            @Valid @RequestBody ReviewRequest reviewRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            ReviewResponse review = reviewService.createReview(user.getUserId(), reviewRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur lors de la création de l'avis: " + e.getMessage()));
        }
    }

    /**
     * Mettre à jour un avis (Propriétaire uniquement)
     * PUT /api/reviews/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updateReview(
            @PathVariable Integer id,
            @Valid @RequestBody ReviewRequest reviewRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            ReviewResponse review = reviewService.updateReview(id, user.getUserId(), reviewRequest);
            return ResponseEntity.ok(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la mise à jour: " + e.getMessage()));
        }
    }

    /**
     * Supprimer un avis (Propriétaire ou Admin)
     * DELETE /api/reviews/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Integer id,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            reviewService.deleteReview(id, user.getUserId(), user.getRole());
            return ResponseEntity.ok(new MessageResponse("Avis supprimé avec succès"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la suppression: " + e.getMessage()));
        }
    }

    /**
     * Obtenir les avis en attente de modération (Admin uniquement)
     * GET /api/reviews/pending
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewResponse>> getPendingReviews() {
        List<ReviewResponse> reviews = reviewService.getPendingReviews();
        return ResponseEntity.ok(reviews);
    }

    /**
     * Modérer un avis (Admin uniquement)
     * PUT /api/reviews/{id}/moderate
     */
    @PutMapping("/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> moderateReview(
            @PathVariable Integer id,
            @Valid @RequestBody ModerationRequest moderationRequest) {
        try {
            ReviewResponse review = reviewService.moderateReview(id, moderationRequest.getStatus());
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la modération: " + e.getMessage()));
        }
    }

    /**
     * Obtenir les avis pour les cours d'un enseignant
     * GET /api/reviews/teacher/my
     */
    @GetMapping("/teacher/my")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<ReviewResponse>> getReviewsForTeacher(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<ReviewResponse> reviews = reviewService.getReviewsForTeacher(user.getUserId());
        return ResponseEntity.ok(reviews);
    }

    /**
     * Ajouter une réponse à un avis (Enseignant uniquement)
     * POST /api/reviews/{reviewId}/response
     */
    @PostMapping("/{reviewId}/response")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> addResponse(
            @PathVariable Integer reviewId,
            @Valid @RequestBody ReviewResponseRequest responseRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            reviewService.addTeacherResponse(reviewId, user.getUserId(), responseRequest.getResponseText());
            return ResponseEntity.ok(new MessageResponse("Réponse ajoutée avec succès"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de l'ajout de la réponse: " + e.getMessage()));
        }
    }

    /**
     * Mettre à jour une réponse (Enseignant uniquement)
     * PUT /api/reviews/{reviewId}/response
     */
    @PutMapping("/{reviewId}/response")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateResponse(
            @PathVariable Integer reviewId,
            @Valid @RequestBody ReviewResponseRequest responseRequest,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            reviewService.updateTeacherResponse(reviewId, user.getUserId(), responseRequest.getResponseText());
            return ResponseEntity.ok(new MessageResponse("Réponse mise à jour avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la mise à jour: " + e.getMessage()));
        }
    }

    /**
     * Supprimer une réponse (Enseignant uniquement)
     * DELETE /api/reviews/{reviewId}/response
     */
    @DeleteMapping("/{reviewId}/response")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> deleteResponse(
            @PathVariable Integer reviewId,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            reviewService.deleteTeacherResponse(reviewId, user.getUserId());
            return ResponseEntity.ok(new MessageResponse("Réponse supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la suppression: " + e.getMessage()));
        }
    }

    /**
     * Compter les avis en attente
     * GET /api/reviews/pending/count
     */
    @GetMapping("/pending/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> countPendingReviews() {
        long count = reviewService.countPendingReviews();
        return ResponseEntity.ok(new MessageResponse("Nombre d'avis en attente: " + count, true));
    }

    /**
     * Obtenir les avis récents
     * GET /api/reviews/recent?limit=10
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ReviewResponse>> getRecentReviews(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<ReviewResponse> reviews = reviewService.getRecentApprovedReviews(limit);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Vérifier si l'utilisateur a déjà évalué un cours
     * GET /api/reviews/check?courseId=1
     */
    @GetMapping("/check")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> checkUserReview(
            @RequestParam Integer courseId,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        boolean exists = reviewService.hasUserReviewedCourse(user.getUserId(), courseId);
        return ResponseEntity.ok(new MessageResponse(
                exists ? "Vous avez déjà évalué ce cours" : "Vous n'avez pas encore évalué ce cours",
                !exists
        ));
    }
}
