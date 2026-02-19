package com.uaz.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour créer ou modifier un cours
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {

    @NotBlank(message = "Le nom du cours est obligatoire")
    private String name;

    @NotBlank(message = "Le code du cours est obligatoire")
    private String code;

    private String description;

    @NotBlank(message = "Le type est obligatoire")
    private String type; // course ou service

    private Integer teacherId;
    private String department;
    private String semester;
    private Integer credits;
}

