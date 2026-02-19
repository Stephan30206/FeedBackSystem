package com.uaz.backend.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Custom converter to store UserRole as lowercase values in the database
 * This ensures the database constraint users_role_check is satisfied
 */
@Converter(autoApply = true)
public class UserRoleConverter implements AttributeConverter<User.UserRole, String> {

    @Override
    public String convertToDatabaseColumn(User.UserRole attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public User.UserRole convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return User.UserRole.fromValue(dbData);
    }
}
