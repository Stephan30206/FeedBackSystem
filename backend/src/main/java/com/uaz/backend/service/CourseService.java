package com.uaz.backend.service;

import com.uaz.backend.dto.CourseDTO;
import com.uaz.backend.dto.CourseRequest;
import com.uaz.backend.dto.CourseStatisticsDTO;
import com.uaz.backend.entity.Course;
import com.uaz.backend.entity.CourseStatistics;
import com.uaz.backend.entity.User;
import com.uaz.backend.repository.CourseRepository;
import com.uaz.backend.repository.CourseStatisticsRepository;
import com.uaz.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service pour la gestion des cours
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseStatisticsRepository courseStatisticsRepository;
    private final UserRepository userRepository;

    /**
     * Obtenir tous les cours actifs
     */
    public List<CourseDTO> getAllActiveCourses() {
        return courseRepository.findByIsActiveTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir un cours par ID
     */
    public CourseDTO getCourseById(Integer id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        return convertToDTO(course);
    }

    /**
     * Rechercher des cours
     */
    public List<CourseDTO> searchCourses(String searchTerm) {
        return courseRepository.searchCourses(searchTerm)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir les cours par département
     */
    public List<CourseDTO> getCoursesByDepartment(String department) {
        return courseRepository.findByDepartmentAndIsActiveTrue(department)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir les cours par type
     */
    public List<CourseDTO> getCoursesByType(String type) {
        Course.CourseType courseType = Course.CourseType.valueOf(type.toUpperCase());
        return courseRepository.findByTypeAndIsActiveTrue(courseType)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir tous les départements
     */
    public List<String> getAllDepartments() {
        return courseRepository.findAllDepartments();
    }

    /**
     * Obtenir les cours d'un enseignant
     */
    public List<CourseDTO> getCoursesByTeacher(Integer teacherId) {
        return courseRepository.findByTeacherUserIdAndIsActiveTrue(teacherId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir les statistiques d'un cours
     */
    public CourseStatisticsDTO getCourseStatistics(Integer courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        CourseStatistics stats = courseStatisticsRepository.findByCourseId(courseId)
                .orElse(null);

        if (stats == null) {
            return CourseStatisticsDTO.builder()
                    .courseId(courseId)
                    .courseName(course.getName())
                    .totalReviews(0)
                    .build();
        }

        return CourseStatisticsDTO.builder()
                .courseId(courseId)
                .courseName(course.getName())
                .avgRatingOverall(stats.getAvgRatingOverall())
                .avgRatingClarity(stats.getAvgRatingClarity())
                .avgRatingMaterial(stats.getAvgRatingMaterial())
                .avgRatingPedagogy(stats.getAvgRatingPedagogy())
                .totalReviews(stats.getTotalReviews())
                .build();
    }

    /**
     * Créer un nouveau cours
     */
    public CourseDTO createCourse(CourseRequest request) {
        // Valider le type
        Course.CourseType type;
        try {
            type = Course.CourseType.valueOf(request.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Type de cours invalide: " + request.getType());
        }

        // Vérifier si le code existe déjà
        if (courseRepository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalArgumentException("Un cours avec ce code existe déjà");
        }

        // Récupérer l'enseignant si spécifié
        User teacher = null;
        if (request.getTeacherId() != null) {
            teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));

            if (!teacher.getRole().equals(User.UserRole.TEACHER)) {
                throw new IllegalArgumentException("L'utilisateur spécifié n'est pas un enseignant");
            }
        }

        // Créer le cours
        Course course = Course.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .type(type)
                .teacher(teacher)
                .department(request.getDepartment())
                .semester(request.getSemester())
                .credits(request.getCredits())
                .isActive(true)
                .build();

        course = courseRepository.save(course);
        return convertToDTO(course);
    }

    /**
     * Mettre à jour un cours
     */
    public CourseDTO updateCourse(Integer id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));

        // Valider le type
        Course.CourseType type;
        try {
            type = Course.CourseType.valueOf(request.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Type de cours invalide: " + request.getType());
        }

        // Vérifier si le code existe déjà (sauf pour le cours actuel)
        courseRepository.findByCode(request.getCode()).ifPresent(existingCourse -> {
            if (!existingCourse.getCourseId().equals(id)) {
                throw new IllegalArgumentException("Un cours avec ce code existe déjà");
            }
        });

        // Récupérer l'enseignant si spécifié
        User teacher = null;
        if (request.getTeacherId() != null) {
            teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));

            if (!teacher.getRole().equals(User.UserRole.TEACHER)) {
                throw new IllegalArgumentException("L'utilisateur spécifié n'est pas un enseignant");
            }
        }

        // Mettre à jour le cours
        course.setName(request.getName());
        course.setCode(request.getCode());
        course.setDescription(request.getDescription());
        course.setType(type);
        course.setTeacher(teacher);
        course.setDepartment(request.getDepartment());
        course.setSemester(request.getSemester());
        course.setCredits(request.getCredits());

        course = courseRepository.save(course);
        return convertToDTO(course);
    }

    /**
     * Désactiver un cours
     */
    public void deactivateCourse(Integer id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        course.setIsActive(false);
        courseRepository.save(course);
    }

    /**
     * Activer un cours
     */
    public void activateCourse(Integer id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cours non trouvé"));
        course.setIsActive(true);
        courseRepository.save(course);
    }

    /**
     * Obtenir les cours les mieux notés
     */
    public List<CourseDTO> getTopRatedCourses(Integer limit) {
        return courseRepository.findByIsActiveTrue()
                .stream()
                .map(course -> {
                    CourseDTO dto = convertToDTO(course);
                    CourseStatistics stats = courseStatisticsRepository.findByCourseId(course.getCourseId()).orElse(null);
                    if (stats != null) {
                        dto.setAvgRating(stats.getAvgRatingOverall());
                        dto.setTotalReviews(stats.getTotalReviews());
                    }
                    return dto;
                })
                .filter(dto -> dto.getAvgRating() != null && dto.getTotalReviews() > 0)
                .sorted((a, b) -> {
                    int ratingCompare = b.getAvgRating().compareTo(a.getAvgRating());
                    if (ratingCompare == 0) {
                        return b.getTotalReviews().compareTo(a.getTotalReviews());
                    }
                    return ratingCompare;
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Obtenir les cours récents
     */
    public List<CourseDTO> getRecentCourses(Integer limit) {
        return courseRepository.findByIsActiveTrue()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convertir une entité Course en DTO
     */
    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = CourseDTO.builder()
                .courseId(course.getCourseId())
                .name(course.getName())
                .code(course.getCode())
                .description(course.getDescription())
                .type(course.getType().getValue())
                .teacherId(course.getTeacher() != null ? course.getTeacher().getUserId() : null)
                .teacherName(course.getTeacher() != null ? course.getTeacher().getFullName() : null)
                .department(course.getDepartment())
                .semester(course.getSemester())
                .credits(course.getCredits())
                .isActive(course.getIsActive())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();

        // Ajouter les statistiques si disponibles
        CourseStatistics stats = courseStatisticsRepository.findByCourseId(course.getCourseId()).orElse(null);
        if (stats != null) {
            dto.setAvgRating(stats.getAvgRatingOverall());
            dto.setTotalReviews(stats.getTotalReviews());
        }

        return dto;
    }
}
