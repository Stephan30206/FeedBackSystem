package com.uaz.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO pour les statistiques d'un cours
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseStatisticsDTO {
    private Integer courseId;
    private String courseName;
    private BigDecimal avgRatingOverall;
    private BigDecimal avgRatingClarity;
    private BigDecimal avgRatingMaterial;
    private BigDecimal avgRatingPedagogy;
    private Integer totalReviews;
}
