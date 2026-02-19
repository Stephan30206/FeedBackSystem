package com.uaz.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité User - Représente un utilisateur du système
 * Peut être un étudiant, un enseignant ou un administrateur
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_username", columnList = "username"),
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_role", columnList = "role")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"reviews", "courses", "responses"})
@EqualsAndHashCode(of = "userId")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, columnDefinition = "TEXT")
    private String passwordHash;

    @Convert(converter = UserRoleConverter.class)
    @Column(name = "role", nullable = false, length = 15)
    private UserRole role;

    @Column(name = "full_name", length = 100)
    private String fullName;

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
     * Liste des avis laissés par cet utilisateur (si étudiant)
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    /**
     * Liste des cours enseignés par cet utilisateur (si enseignant)
     */
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Course> courses = new ArrayList<>();

    /**
     * Liste des réponses aux avis (si enseignant)
     */
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ReviewResponse> responses = new ArrayList<>();

    // Méthodes utilitaires

    /**
     * Ajoute un avis à la liste des avis de l'utilisateur
     */
    public void addReview(Review review) {
        reviews.add(review);
        review.setUser(this);
    }

    /**
     * Retire un avis de la liste
     */
    public void removeReview(Review review) {
        reviews.remove(review);
        review.setUser(null);
    }

    /**
     * Ajoute un cours à la liste des cours enseignés
     */
    public void addCourse(Course course) {
        courses.add(course);
        course.setTeacher(this);
    }

    /**
     * Vérifie si l'utilisateur est un étudiant
     */
    public boolean isStudent() {
        return UserRole.STUDENT.equals(this.role);
    }

    /**
     * Vérifie si l'utilisateur est un enseignant
     */
    public boolean isTeacher() {
        return UserRole.TEACHER.equals(this.role);
    }

    /**
     * Vérifie si l'utilisateur est un administrateur
     */
    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }

    /**
     * Enum pour les rôles utilisateur
     */
    public enum UserRole {
        STUDENT("student"),
        TEACHER("teacher"),
        ADMIN("admin");

        private final String value;

        UserRole(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static UserRole fromValue(String value) {
            for (UserRole role : UserRole.values()) {
                if (role.value.equalsIgnoreCase(value)) {
                    return role;
                }
            }
            throw new IllegalArgumentException("Invalid role: " + value);
        }
    }
}
