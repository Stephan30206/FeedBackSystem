package com.uaz.backend.controller;

import com.uaz.backend.dto.LoginRequest;
import com.uaz.backend.dto.LoginResponse;
import com.uaz.backend.dto.RegisterRequest;
import com.uaz.backend.dto.MessageResponse;
import com.uaz.backend.entity.User;
import com.uaz.backend.security.JwtUtil;
import com.uaz.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controller pour l'authentification
 * Gère la connexion et l'inscription des utilisateurs
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * Connexion d'un utilisateur
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Authentifier l'utilisateur
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Récupérer l'utilisateur authentifié
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User user = userService.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Générer le token JWT
            String token = jwtUtil.generateToken(userDetails.getUsername());

            // Créer la réponse
            LoginResponse response = LoginResponse.builder()
                    .token(token)
                    .userId(user.getUserId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().name())
                    .department(user.getDepartment())
                    .message("Connexion réussie")
                    .build();

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Nom d'utilisateur ou mot de passe incorrect"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur lors de la connexion: " + e.getMessage()));
        }
    }

    /**
     * Inscription d'un nouvel utilisateur
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            // Vérifier si le nom d'utilisateur existe déjà
            if (userService.existsByUsername(registerRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Ce nom d'utilisateur est déjà utilisé"));
            }

            // Vérifier si l'email existe déjà
            if (userService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Cet email est déjà utilisé"));
            }

            // Créer l'utilisateur
            User user = userService.createUser(registerRequest);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageResponse("Inscription réussie! Vous pouvez maintenant vous connecter."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Erreur lors de l'inscription: " + e.getMessage()));
        }
    }

    /**
     * Vérifier si un nom d'utilisateur est disponible
     * GET /api/auth/check-username?username=john
     */
    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(new MessageResponse(
                exists ? "Ce nom d'utilisateur est déjà pris" : "Ce nom d'utilisateur est disponible",
                !exists
        ));
    }

    /**
     * Vérifier si un email est disponible
     * GET /api/auth/check-email?email=john@example.com
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(new MessageResponse(
                exists ? "Cet email est déjà utilisé" : "Cet email est disponible",
                !exists
        ));
    }

    /**
     * Valider un token JWT
     * GET /api/auth/validate-token
     */
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String username = jwtUtil.extractUsername(token);

                if (username != null && jwtUtil.validateToken(token, username)) {
                    User user = userService.findByUsername(username)
                            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                    return ResponseEntity.ok(LoginResponse.builder()
                            .userId(user.getUserId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .fullName(user.getFullName())
                            .role(user.getRole().name())
                            .department(user.getDepartment())
                            .message("Token valide")
                            .build());
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Token invalide ou expiré"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Erreur de validation du token"));
        }
    }

    /**
     * Déconnexion (côté serveur - optionnel car JWT est stateless)
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Avec JWT, la déconnexion est généralement gérée côté client
        // en supprimant le token du localStorage
        // Ici on peut ajouter une logique de blacklist si nécessaire
        return ResponseEntity.ok(new MessageResponse("Déconnexion réussie"));
    }

    /**
     * Rafraîchir le token
     * POST /api/auth/refresh-token
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String oldToken = authHeader.substring(7);
                String username = jwtUtil.extractUsername(oldToken);

                if (username != null && jwtUtil.validateToken(oldToken, username)) {
                    // Générer un nouveau token
                    String newToken = jwtUtil.generateToken(username);

                    User user = userService.findByUsername(username)
                            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

                    return ResponseEntity.ok(LoginResponse.builder()
                            .token(newToken)
                            .userId(user.getUserId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .fullName(user.getFullName())
                            .role(user.getRole().name())
                            .department(user.getDepartment())
                            .message("Token rafraîchi avec succès")
                            .build());
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Token invalide"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Erreur lors du rafraîchissement du token"));
        }
    }
}
