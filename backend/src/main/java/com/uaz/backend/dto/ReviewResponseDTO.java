package com.uaz.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO pour la réponse d'avis
 * IMPORTANT: Renommé en ReviewResponseDTO pour éviter le conflit avec l'entité ReviewResponse
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Integer reviewId;
    private Integer userId;
    private Integer courseId;
    private String courseName;
    private String courseCode;
    private BigDecimal ratingOverall;
    private BigDecimal ratingClarity;
    private BigDecimal ratingMaterial;
    private BigDecimal ratingPedagogy;
    private String comment;
    private Boolean anonymous;
    private String reviewerName;
    private String moderationStatus;
    private String teacherResponse;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
