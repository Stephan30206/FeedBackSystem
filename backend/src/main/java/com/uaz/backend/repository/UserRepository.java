package com.uaz.backend.repository;

import com.uaz.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité User
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Trouve un utilisateur par son username
     */
    Optional<User> findByUsername(String username);

    /**
     * Trouve un utilisateur par son email
     */
    Optional<User> findByEmail(String email);

    /**
     * Vérifie si un username existe
     */
    boolean existsByUsername(String username);

    /**
     * Vérifie si un email existe
     */
    boolean existsByEmail(String email);

    /**
     * Trouve tous les utilisateurs actifs par rôle
     */
    List<User> findByRoleAndIsActiveTrue(User.UserRole role);

    /**
     * Trouve tous les enseignants
     */
    @Query("SELECT u FROM User u WHERE u.role = 'TEACHER' AND u.isActive = true")
    List<User> findAllTeachers();

    /**
     * Trouve tous les étudiants
     */
    @Query("SELECT u FROM User u WHERE u.role = 'STUDENT' AND u.isActive = true")
    List<User> findAllStudents();
}