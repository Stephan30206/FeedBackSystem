package com.uaz.backend.repository;

import com.uaz.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Course
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

    Optional<Course> findByCode(String code);

    List<Course> findByIsActiveTrue();

    List<Course> findByTypeAndIsActiveTrue(Course.CourseType type);

    List<Course> findByDepartmentAndIsActiveTrue(String department);

    List<Course> findByTeacherUserIdAndIsActiveTrue(Integer teacherId);

    @Query("SELECT DISTINCT c.department FROM Course c WHERE c.department IS NOT NULL ORDER BY c.department")
    List<String> findAllDepartments();

    @Query("SELECT c FROM Course c WHERE c.isActive = true AND " +
            "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Course> searchCourses(@Param("search") String search);
}
