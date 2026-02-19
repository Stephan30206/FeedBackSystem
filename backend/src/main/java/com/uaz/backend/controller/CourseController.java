package com.uaz.backend.controller;

import com.uaz.backend.dto.CourseDTO;
import com.uaz.backend.dto.CourseRequest;
import com.uaz.backend.dto.CourseStatisticsDTO;
import com.uaz.backend.dto.MessageResponse;
import com.uaz.backend.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller pour la gestion des cours
 */
@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    /**
     * Obtenir tous les cours actifs
     * GET /api/courses
     */
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllActiveCourses();
        return ResponseEntity.ok(courses);
    }

    /**
     * Obtenir un cours par son ID
     * GET /api/courses/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Integer id) {
        try {
            CourseDTO course = courseService.getCourseById(id);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Cours non trouvé"));
        }
    }

    /**
     * Rechercher des cours
     * GET /api/courses/search?q=java
     */
    @GetMapping("/search")
    public ResponseEntity<List<CourseDTO>> searchCourses(@RequestParam String q) {
        List<CourseDTO> courses = courseService.searchCourses(q);
        return ResponseEntity.ok(courses);
    }

    /**
     * Obtenir les cours par département
     * GET /api/courses/department?department=Informatique
     */
    @GetMapping("/department")
    public ResponseEntity<List<CourseDTO>> getCoursesByDepartment(@RequestParam String department) {
        List<CourseDTO> courses = courseService.getCoursesByDepartment(department);
        return ResponseEntity.ok(courses);
    }

    /**
     * Obtenir les cours par type
     * GET /api/courses/type?type=course
     */
    @GetMapping("/type")
    public ResponseEntity<List<CourseDTO>> getCoursesByType(@RequestParam String type) {
        List<CourseDTO> courses = courseService.getCoursesByType(type);
        return ResponseEntity.ok(courses);
    }

    /**
     * Obtenir tous les départements
     * GET /api/courses/departments
     */
    @GetMapping("/departments")
    public ResponseEntity<List<String>> getAllDepartments() {
        List<String> departments = courseService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    /**
     * Obtenir les cours d'un enseignant
     * GET /api/courses/teacher/{teacherId}
     */
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<CourseDTO>> getCoursesByTeacher(@PathVariable Integer teacherId) {
        List<CourseDTO> courses = courseService.getCoursesByTeacher(teacherId);
        return ResponseEntity.ok(courses);
    }

    /**
     * Obtenir les statistiques d'un cours
     * GET /api/courses/{id}/statistics
     */
    @GetMapping("/{id}/statistics")
    public ResponseEntity<?> getCourseStatistics(@PathVariable Integer id) {
        try {
            CourseStatisticsDTO stats = courseService.getCourseStatistics(id);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Statistiques non disponibles"));
        }
    }

    /**
     * Créer un nouveau cours (Admin uniquement)
     * POST /api/courses
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseRequest courseRequest) {
        try {
            CourseDTO course = courseService.createCourse(courseRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la création du cours: " + e.getMessage()));
        }
    }

    /**
     * Mettre à jour un cours (Admin uniquement)
     * PUT /api/courses/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCourse(
            @PathVariable Integer id,
            @Valid @RequestBody CourseRequest courseRequest) {
        try {
            CourseDTO course = courseService.updateCourse(id, courseRequest);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la mise à jour: " + e.getMessage()));
        }
    }

    /**
     * Désactiver un cours (Admin uniquement)
     * DELETE /api/courses/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateCourse(@PathVariable Integer id) {
        try {
            courseService.deactivateCourse(id);
            return ResponseEntity.ok(new MessageResponse("Cours désactivé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de la désactivation: " + e.getMessage()));
        }
    }

    /**
     * Activer un cours (Admin uniquement)
     * PATCH /api/courses/{id}/activate
     */
    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateCourse(@PathVariable Integer id) {
        try {
            courseService.activateCourse(id);
            return ResponseEntity.ok(new MessageResponse("Cours activé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Erreur lors de l'activation: " + e.getMessage()));
        }
    }

    /**
     * Obtenir les cours les mieux notés
     * GET /api/courses/top-rated?limit=5
     */
    @GetMapping("/top-rated")
    public ResponseEntity<List<CourseDTO>> getTopRatedCourses(
            @RequestParam(defaultValue = "5") Integer limit) {
        List<CourseDTO> courses = courseService.getTopRatedCourses(limit);
        return ResponseEntity.ok(courses);
    }

    /**
     * Obtenir les cours récents
     * GET /api/courses/recent?limit=10
     */
    @GetMapping("/recent")
    public ResponseEntity<List<CourseDTO>> getRecentCourses(
            @RequestParam(defaultValue = "10") Integer limit) {
        List<CourseDTO> courses = courseService.getRecentCourses(limit);
        return ResponseEntity.ok(courses);
    }
}
