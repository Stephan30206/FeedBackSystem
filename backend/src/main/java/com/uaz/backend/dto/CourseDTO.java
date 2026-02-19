package com.uaz.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO pour les informations de cours
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Integer courseId;
    private String name;
    private String code;
    private String description;
    private String type;
    private Integer teacherId;
    private String teacherName;
    private String department;
    private String semester;
    private Integer credits;
    private Boolean isActive;
    private BigDecimal avgRating;
    private Integer totalReviews;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

