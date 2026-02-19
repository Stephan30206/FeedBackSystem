package com.uaz.backend.service;

import com.uaz.backend.dto.RegisterRequest;
import com.uaz.backend.entity.User;
import com.uaz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des utilisateurs
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Trouver un utilisateur par son username
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Trouver un utilisateur par son ID
     */
    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    /**
     * Trouver un utilisateur par son email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Vérifier si un username existe
     */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Vérifier si un email existe
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Créer un nouvel utilisateur
     */
    public User createUser(RegisterRequest request) {
        // Valider le rôle
        User.UserRole role;
        try {
            role = User.UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rôle invalide: " + request.getRole());
        }

        // Créer l'utilisateur
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(role)
                .department(request.getDepartment())
                .isActive(true)
                .build();

        return userRepository.save(user);
    }

    /**
     * Sauvegarder un utilisateur
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    /**
     * Obtenir tous les utilisateurs
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Obtenir tous les étudiants
     */
    public List<User> getAllStudents() {
        return userRepository.findByRoleAndIsActiveTrue(User.UserRole.STUDENT);
    }

    /**
     * Obtenir tous les enseignants
     */
    public List<User> getAllTeachers() {
        return userRepository.findByRoleAndIsActiveTrue(User.UserRole.TEACHER);
    }

    /**
     * Changer le mot de passe d'un utilisateur
     */
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Le mot de passe actuel est incorrect");
        }

        // Mettre à jour le mot de passe
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Désactiver un utilisateur
     */
    public void deactivateUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    /**
     * Activer un utilisateur
     */
    public void activateUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setIsActive(true);
        userRepository.save(user);
    }

    /**
     * Supprimer un utilisateur
     */
    public void deleteUser(Integer userId) {
        userRepository.deleteById(userId);
    }

    /**
     * Compter tous les utilisateurs
     */
    public long countAllUsers() {
        return userRepository.count();
    }

    /**
     * Compter les étudiants
     */
    public long countStudents() {
        return userRepository.findByRoleAndIsActiveTrue(User.UserRole.STUDENT).size();
    }

    /**
     * Compter les enseignants
     */
    public long countTeachers() {
        return userRepository.findByRoleAndIsActiveTrue(User.UserRole.TEACHER).size();
    }

    /**
     * Compter les admins
     */
    public long countAdmins() {
        return userRepository.findByRoleAndIsActiveTrue(User.UserRole.ADMIN).size();
    }

    /**
     * Compter les utilisateurs actifs
     */
    public long countActiveUsers() {
        return userRepository.findAll().stream()
                .filter(User::getIsActive)
                .count();
    }

    /**
     * Rechercher des utilisateurs
     */
    public List<User> searchUsers(String searchTerm) {
        // Recherche simple par username, email ou fullName
        return userRepository.findAll().stream()
                .filter(user ->
                        user.getUsername().toLowerCase().contains(searchTerm.toLowerCase()) ||
                                user.getEmail().toLowerCase().contains(searchTerm.toLowerCase()) ||
                                (user.getFullName() != null && user.getFullName().toLowerCase().contains(searchTerm.toLowerCase()))
                )
                .toList();
    }
}
