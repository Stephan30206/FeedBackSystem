package com.uaz.backend.repository;

import com.uaz.backend.entity.CourseStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité CourseStatistics
 */
@Repository
public interface CourseStatisticsRepository extends JpaRepository<CourseStatistics, Integer> {

    Optional<CourseStatistics> findByCourseCourseId(Integer courseId);

    default Optional<CourseStatistics> findByCourseId(Integer courseId) {
        return findByCourseCourseId(courseId);
    }

    @Query("SELECT cs FROM CourseStatistics cs WHERE cs.totalReviews > 0 ORDER BY cs.avgRatingOverall DESC")
    List<CourseStatistics> findTopRatedCourses();

    @Query("SELECT cs FROM CourseStatistics cs JOIN cs.course c WHERE c.department = :department AND cs.totalReviews > 0 ORDER BY cs.avgRatingOverall DESC")
    List<CourseStatistics> findTopRatedCoursesByDepartment(String department);
}
