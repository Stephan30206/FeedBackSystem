package com.uaz.backend.controller;

import com.uaz.backend.dto.MessageResponse;
import com.uaz.backend.entity.User;
import com.uaz.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller pour la gestion des utilisateurs
 */
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Obtenir le profil de l'utilisateur connecté
     * GET /api/users/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", user.getUserId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("fullName", user.getFullName());
            userInfo.put("role", user.getRole().name());
            userInfo.put("isActive", user.getIsActive());
            userInfo.put("createdAt", user.getCreatedAt());

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Utilisateur non trouvé"));
        }
    }

    /**
     * Obtenir tous les utilisateurs (Admin uniquement)
     * GET /api/users
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Obtenir un utilisateur par son ID (Admin uniquement)
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        try {
            User user = userService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userId", user.getUserId());
            userInfo.put("username", user.getUsername());
            userInfo.put("email", user.getEmail());
            userInfo.put("fullName", user.getFullName());
            userInfo.put("role", user.getRole().name());
            userInfo.put("isActive", user.getIsActive());
            userInfo.put("createdAt", user.getCreatedAt());
            userInfo.put("updatedAt", user.getUpdatedAt());

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Utilisateur non trouvé"));
        }
    }

    /**
     * Obtenir tous les étudiants (Admin/Teacher)
     * GET /api/users/students
     */
    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    /**
     * Obtenir tous les enseignants
     * GET /api/users/teachers
     */
    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getAllTeachers() {
        List<User> teachers = userService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    /**
     * Mettre à jour le profil de l'utilisateur connecté
     * PUT /api/users/me
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> updates,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Mettre à jour les champs autorisés
            if (updates.containsKey("fullName")) {
                user.setFullName(updates.get("fullName"));
            }
            if (updates.containsKey("email")) {
                // Vérifier si l'email est déjà utilisé
                if (!user.getEmail().equals(updates.get("email")) &&
                        userService.existsByEmail(updates.get("email"))) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Cet email est déjà utilisé"));
                }
                user.setEmail(updates.get("email"));
            }

            userService.saveUser(user);
            return ResponseEntity.ok(new MessageResponse("Profil mis à jour avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la mise à jour: " + e.getMessage()));
        }
    }

    /**
     * Changer le mot de passe
     * PUT /api/users/me/password
     */
    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> passwords,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            String currentPassword = passwords.get("currentPassword");
            String newPassword = passwords.get("newPassword");

            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Le nouveau mot de passe doit contenir au moins 6 caractères"));
            }

            userService.changePassword(username, currentPassword, newPassword);
            return ResponseEntity.ok(new MessageResponse("Mot de passe modifié avec succès"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur lors du changement de mot de passe"));
        }
    }

    /**
     * Désactiver un utilisateur (Admin uniquement)
     * PATCH /api/users/{id}/deactivate
     */
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable Integer id) {
        try {
            userService.deactivateUser(id);
            return ResponseEntity.ok(new MessageResponse("Utilisateur désactivé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la désactivation: " + e.getMessage()));
        }
    }

    /**
     * Activer un utilisateur (Admin uniquement)
     * PATCH /api/users/{id}/activate
     */
    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateUser(@PathVariable Integer id) {
        try {
            userService.activateUser(id);
            return ResponseEntity.ok(new MessageResponse("Utilisateur activé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de l'activation: " + e.getMessage()));
        }
    }

    /**
     * Supprimer définitivement un utilisateur (Admin uniquement)
     * DELETE /api/users/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id, Authentication authentication) {
        try {
            String username = authentication.getName();
            User currentUser = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Empêcher l'admin de se supprimer lui-même
            if (currentUser.getUserId().equals(id)) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Vous ne pouvez pas supprimer votre propre compte"));
            }

            userService.deleteUser(id);
            return ResponseEntity.ok(new MessageResponse("Utilisateur supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la suppression: " + e.getMessage()));
        }
    }

    /**
     * Obtenir les statistiques des utilisateurs (Admin uniquement)
     * GET /api/users/statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.countAllUsers());
        stats.put("totalStudents", userService.countStudents());
        stats.put("totalTeachers", userService.countTeachers());
        stats.put("totalAdmins", userService.countAdmins());
        stats.put("activeUsers", userService.countActiveUsers());

        return ResponseEntity.ok(stats);
    }

    /**
     * Rechercher des utilisateurs (Admin uniquement)
     * GET /api/users/search?q=john
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String q) {
        List<User> users = userService.searchUsers(q);
        return ResponseEntity.ok(users);
    }

    /**
     * Mettre à jour le rôle d'un utilisateur (Admin uniquement)
     * PATCH /api/users/{id}/role
     */
    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body) {
        try {
            String roleStr = body.get("role");
            User.UserRole role = User.UserRole.fromValue(roleStr);

            User user = userService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            user.setRole(role);
            userService.saveUser(user);

            return ResponseEntity.ok(new MessageResponse("Rôle mis à jour avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la mise à jour: " + e.getMessage()));
        }
    }
}
