package com.uaz.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO pour ajouter une réponse à un avis
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseRequest {

    @NotBlank(message = "Le texte de la réponse est obligatoire")
    private String responseText;
}
