package com.uaz.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité Course - Représente un cours ou un service
 */
@Entity
@Table(name = "courses", indexes = {
        @Index(name = "idx_courses_teacher", columnList = "teacher_id"),
        @Index(name = "idx_courses_type", columnList = "type"),
        @Index(name = "idx_courses_department", columnList = "department"),
        @Index(name = "idx_courses_code", columnList = "code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"reviews", "teacher", "statistics"})
@EqualsAndHashCode(of = "courseId")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Integer courseId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Convert(converter = CourseTypeConverter.class)
    @Column(name = "type", nullable = false, length = 50)
    private CourseType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "semester", length = 20)
    private String semester;

    @Column(name = "credits")
    private Integer credits;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations

    /**
     * Liste des avis pour ce cours
     */
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    /**
     * Statistiques du cours
     */
    @OneToOne(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private CourseStatistics statistics;

    // Méthodes utilitaires

    /**
     * Ajoute un avis à la liste des avis du cours
     */
    public void addReview(Review review) {
        reviews.add(review);
        review.setCourse(this);
    }

    /**
     * Retire un avis de la liste
     */
    public void removeReview(Review review) {
        reviews.remove(review);
        review.setCourse(null);
    }

    /**
     * Retourne le nom de l'enseignant ou "Non assigné"
     */
    public String getTeacherName() {
        return teacher != null ? teacher.getFullName() : "Non assigné";
    }

    /**
     * Vérifie si c'est un cours (pas un service)
     */
    public boolean isCourse() {
        return CourseType.COURSE.equals(this.type);
    }

    /**
     * Vérifie si c'est un service
     */
    public boolean isService() {
        return CourseType.SERVICE.equals(this.type);
    }

    /**
     * Enum pour le type de cours
     */
    public enum CourseType {
        COURSE("course"),
        SERVICE("service");

        private final String value;

        CourseType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static CourseType fromValue(String value) {
            for (CourseType type : CourseType.values()) {
                if (type.value.equalsIgnoreCase(value)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Invalid course type: " + value);
        }
    }
}
