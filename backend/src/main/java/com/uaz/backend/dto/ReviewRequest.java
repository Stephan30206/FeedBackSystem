package com.uaz.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO pour la requête de création d'avis
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @NotNull(message = "L'ID du cours est obligatoire")
    private Integer courseId;

    @NotNull(message = "La note globale est obligatoire")
    @DecimalMin(value = "0.0", message = "La note doit être au moins 0")
    @DecimalMax(value = "5.0", message = "La note ne peut pas dépasser 5")
    private BigDecimal ratingOverall;

    @DecimalMin(value = "0.0", message = "La note doit être au moins 0")
    @DecimalMax(value = "5.0", message = "La note ne peut pas dépasser 5")
    private BigDecimal ratingClarity;

    @DecimalMin(value = "0.0", message = "La note doit être au moins 0")
    @DecimalMax(value = "5.0", message = "La note ne peut pas dépasser 5")
    private BigDecimal ratingMaterial;

    @DecimalMin(value = "0.0", message = "La note doit être au moins 0")
    @DecimalMax(value = "5.0", message = "La note ne peut pas dépasser 5")
    private BigDecimal ratingPedagogy;

    @NotBlank(message = "Le commentaire est obligatoire")
    @Size(min = 10, message = "Le commentaire doit contenir au moins 10 caractères")
    private String comment;

    @Builder.Default
    private Boolean anonymous = true;
}
