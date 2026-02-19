package com.uaz.backend.repository;

import com.uaz.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Review
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    @Query("SELECT r FROM Review r WHERE r.course.courseId = :courseId AND r.moderationStatus = :status")
    List<Review> findByCourseIdAndModerationStatus(@Param("courseId") Integer courseId, @Param("status") Review.ModerationStatus status);

    @Query("SELECT r FROM Review r WHERE r.course.courseId = :courseId AND r.moderationStatus = :status")
    Page<Review> findByCourseIdAndModerationStatus(
            @Param("courseId") Integer courseId,
            @Param("status") Review.ModerationStatus status,
            Pageable pageable
    );

    @Query("SELECT r FROM Review r WHERE r.user.userId = :userId ORDER BY r.createdAt DESC")
    List<Review> findByUserIdOrderByCreatedAtDesc(@Param("userId") Integer userId);

    List<Review> findByModerationStatusOrderByCreatedAtDesc(Review.ModerationStatus status);

    @Query("SELECT r FROM Review r WHERE r.user.userId = :userId AND r.course.courseId = :courseId")
    Optional<Review> findByUserIdAndCourseId(@Param("userId") Integer userId, @Param("courseId") Integer courseId);

    @Query("SELECT COUNT(r) > 0 FROM Review r WHERE r.user.userId = :userId AND r.course.courseId = :courseId")
    boolean existsByUserIdAndCourseId(@Param("userId") Integer userId, @Param("courseId") Integer courseId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.course.courseId = :courseId AND r.moderationStatus = 'APPROVED'")
    long countApprovedReviewsByCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT AVG(r.ratingOverall) FROM Review r WHERE r.course.courseId = :courseId AND r.moderationStatus = 'APPROVED'")
    Double getAverageRatingByCourseId(@Param("courseId") Integer courseId);

    @Query("SELECT r FROM Review r WHERE r.course.teacher.userId = :teacherId ORDER BY r.createdAt DESC")
    List<Review> findReviewsForTeacher(@Param("teacherId") Integer teacherId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.moderationStatus = 'PENDING'")
    long countPendingReviews();

    @Query("SELECT r FROM Review r WHERE r.moderationStatus = 'APPROVED' ORDER BY r.createdAt DESC")
    List<Review> findRecentApprovedReviews(Pageable pageable);
}
