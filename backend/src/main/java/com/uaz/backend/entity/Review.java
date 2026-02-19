package com.uaz.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entité Review - Représente un avis d'étudiant sur un cours
 */
@Entity
@Table(name = "reviews",
        indexes = {
                @Index(name = "idx_reviews_course", columnList = "course_id"),
                @Index(name = "idx_reviews_user", columnList = "user_id"),
                @Index(name = "idx_reviews_created_at", columnList = "created_at"),
                @Index(name = "idx_reviews_moderation", columnList = "moderation_status")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "idx_user_course_review",
                        columnNames = {"user_id", "course_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user", "course", "response"})
@EqualsAndHashCode(of = "reviewId")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Integer reviewId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // Évaluations (notes de 0 à 5)

    @Column(name = "rating_overall", nullable = false, precision = 2, scale = 1)
    private BigDecimal ratingOverall;

    @Column(name = "rating_clarity", precision = 2, scale = 1)
    private BigDecimal ratingClarity;

    @Column(name = "rating_material", precision = 2, scale = 1)
    private BigDecimal ratingMaterial;

    @Column(name = "rating_pedagogy", precision = 2, scale = 1)
    private BigDecimal ratingPedagogy;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "anonymous")
    @Builder.Default
    private Boolean anonymous = true;

    @Column(name = "is_moderated")
    @Builder.Default
    private Boolean isModerated = false;

    @Convert(converter = ModerationStatusConverter.class)
    @Column(name = "moderation_status", length = 20)
    @Builder.Default
    private ModerationStatus moderationStatus = ModerationStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations

    /**
     * Réponse de l'enseignant à cet avis (optionnel)
     */
    @OneToOne(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private ReviewResponse response;

    // Méthodes utilitaires

    /**
     * Retourne le nom de l'auteur de l'avis
     * Retourne "Anonyme" si l'avis est anonyme
     */
    public String getAuthorName() {
        if (Boolean.TRUE.equals(anonymous)) {
            return "Anonyme";
        }
        return user != null ? user.getFullName() : "Utilisateur inconnu";
    }

    /**
     * Vérifie si l'avis est approuvé
     */
    public boolean isApproved() {
        return ModerationStatus.APPROVED.equals(this.moderationStatus);
    }

    /**
     * Vérifie si l'avis est en attente de modération
     */
    public boolean isPending() {
        return ModerationStatus.PENDING.equals(this.moderationStatus);
    }

    /**
     * Vérifie si l'avis est rejeté
     */
    public boolean isRejected() {
        return ModerationStatus.REJECTED.equals(this.moderationStatus);
    }

    /**
     * Approuve l'avis
     */
    public void approve() {
        this.moderationStatus = ModerationStatus.APPROVED;
        this.isModerated = true;
    }

    /**
     * Rejette l'avis
     */
    public void reject() {
        this.moderationStatus = ModerationStatus.REJECTED;
        this.isModerated = true;
    }

    /**
     * Calcule la note moyenne de tous les critères
     */
    public BigDecimal getAverageRating() {
        int count = 1; // rating_overall est toujours présent
        BigDecimal sum = ratingOverall;

        if (ratingClarity != null) {
            sum = sum.add(ratingClarity);
            count++;
        }
        if (ratingMaterial != null) {
            sum = sum.add(ratingMaterial);
            count++;
        }
        if (ratingPedagogy != null) {
            sum = sum.add(ratingPedagogy);
            count++;
        }

        return sum.divide(BigDecimal.valueOf(count), 2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Enum pour le statut de modération
     */
    public enum ModerationStatus {
        PENDING("pending"),
        APPROVED("approved"),
        REJECTED("rejected");

        private final String value;

        ModerationStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static ModerationStatus fromValue(String value) {
            for (ModerationStatus status : ModerationStatus.values()) {
                if (status.value.equalsIgnoreCase(value)) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Invalid moderation status: " + value);
        }
    }
}
