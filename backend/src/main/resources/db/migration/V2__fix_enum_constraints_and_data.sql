-- This migration fixes the enum constraints and converts data to lowercase
-- It's safe to run even if the schema was already created

-- Update existing role values to lowercase (if any exist in uppercase)
UPDATE users SET role = LOWER(role) WHERE role IS NOT NULL;

-- Update existing type values to lowercase (if any exist in uppercase)
UPDATE courses SET type = LOWER(type) WHERE type IS NOT NULL;

-- Update existing moderation_status values to lowercase (if any exist in uppercase)
UPDATE reviews SET moderation_status = LOWER(moderation_status) WHERE moderation_status IS NOT NULL;

-- Add/fix constraints if they don't exist
-- These statements are idempotent and won't fail if constraints already exist

-- For users table - ensure role constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name='users' AND constraint_name='users_role_check'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('student', 'teacher', 'admin'));
    END IF;
END
$$;

-- For courses table - ensure type constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name='courses' AND constraint_name='courses_type_check'
    ) THEN
        ALTER TABLE courses ADD CONSTRAINT courses_type_check CHECK (type IN ('course', 'service'));
    END IF;
END
$$;

-- For reviews table - ensure moderation_status constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name='reviews' AND constraint_name='reviews_moderation_status_check'
    ) THEN
        ALTER TABLE reviews ADD CONSTRAINT reviews_moderation_status_check CHECK (moderation_status IN ('pending', 'approved', 'rejected'));
    END IF;
END
$$;
