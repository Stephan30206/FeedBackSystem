package com.uaz.backend.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Custom converter to store CourseType as lowercase values in the database
 */
@Converter(autoApply = true)
public class CourseTypeConverter implements AttributeConverter<Course.CourseType, String> {

    @Override
    public String convertToDatabaseColumn(Course.CourseType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public Course.CourseType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return Course.CourseType.fromValue(dbData);
    }
}
