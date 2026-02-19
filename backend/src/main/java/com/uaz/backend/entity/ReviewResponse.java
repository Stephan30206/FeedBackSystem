package com.uaz.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entité ReviewResponse - Réponse d'un enseignant à un avis
 */
@Entity
@Table(name = "review_responses", indexes = {
        @Index(name = "idx_review_responses_review", columnList = "review_id"),
        @Index(name = "idx_review_responses_teacher", columnList = "teacher_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"review", "teacher"})
@EqualsAndHashCode(of = "responseId")
public class ReviewResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "response_id")
    private Integer responseId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @Column(name = "response_text", nullable = false, columnDefinition = "TEXT")
    private String responseText;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Retourne le nom de l'enseignant
     */
    public String getTeacherName() {
        return teacher != null ? teacher.getFullName() : "Enseignant inconnu";
    }
}
