package com.uaz.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entité CourseStatistics - Cache des statistiques d'un cours
 * Cette table est mise à jour automatiquement par des triggers et fonctions PL/pgSQL
 */
@Entity
@Table(name = "course_statistics",
        uniqueConstraints = {
                @UniqueConstraint(name = "idx_course_stats_course",
                        columnNames = "course_id")
        },
        indexes = {
                @Index(name = "idx_stats_rating_reviews",
                        columnList = "avg_rating_overall, total_reviews")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "course")
@EqualsAndHashCode(of = "statId")
public class CourseStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stat_id")
    private Integer statId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "avg_rating_overall", precision = 3, scale = 2)
    private BigDecimal avgRatingOverall;

    @Column(name = "avg_rating_clarity", precision = 3, scale = 2)
    private BigDecimal avgRatingClarity;

    @Column(name = "avg_rating_material", precision = 3, scale = 2)
    private BigDecimal avgRatingMaterial;

    @Column(name = "avg_rating_pedagogy", precision = 3, scale = 2)
    private BigDecimal avgRatingPedagogy;

    @Column(name = "total_reviews")
    @Builder.Default
    private Integer totalReviews = 0;

    @UpdateTimestamp
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    /**
     * Calcule la moyenne générale de toutes les notes
     */
    public BigDecimal getOverallAverage() {
        int count = 0;
        BigDecimal sum = BigDecimal.ZERO;

        if (avgRatingOverall != null) {
            sum = sum.add(avgRatingOverall);
            count++;
        }
        if (avgRatingClarity != null) {
            sum = sum.add(avgRatingClarity);
            count++;
        }
        if (avgRatingMaterial != null) {
            sum = sum.add(avgRatingMaterial);
            count++;
        }
        if (avgRatingPedagogy != null) {
            sum = sum.add(avgRatingPedagogy);
            count++;
        }

        if (count == 0) {
            return BigDecimal.ZERO;
        }

        return sum.divide(BigDecimal.valueOf(count), 2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Vérifie si le cours a des avis
     */
    public boolean hasReviews() {
        return totalReviews != null && totalReviews > 0;
    }

    /**
     * Retourne une représentation textuelle de la note (étoiles)
     */
    public String getRatingStars() {
        if (avgRatingOverall == null) {
            return "☆☆☆☆☆";
        }

        int fullStars = avgRatingOverall.intValue();
        StringBuilder stars = new StringBuilder();

        for (int i = 0; i < fullStars; i++) {
            stars.append("★");
        }
        for (int i = fullStars; i < 5; i++) {
            stars.append("☆");
        }

        return stars.toString();
    }
}
