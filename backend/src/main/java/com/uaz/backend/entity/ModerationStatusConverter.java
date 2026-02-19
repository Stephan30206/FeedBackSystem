package com.uaz.backend.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Custom converter to store ModerationStatus as lowercase values in the database
 */
@Converter(autoApply = true)
public class ModerationStatusConverter implements AttributeConverter<Review.ModerationStatus, String> {

    @Override
    public String convertToDatabaseColumn(Review.ModerationStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public Review.ModerationStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Review.ModerationStatus.fromValue(dbData);
    }
}
