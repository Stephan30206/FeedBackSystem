package com.uaz.backend.repository;

import com.uaz.backend.entity.ReviewResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewResponseRepository extends JpaRepository<ReviewResponse, Integer> {

    Optional<ReviewResponse> findByReviewReviewId(Integer reviewId);

    List<ReviewResponse> findByTeacherUserId(Integer teacherId);

    boolean existsByReviewReviewId(Integer reviewId);

    default Optional<ReviewResponse> findByReviewId(Integer reviewId) {
        return findByReviewReviewId(reviewId);
    }
}
