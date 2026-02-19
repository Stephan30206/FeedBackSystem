-- Insert test users with different roles for development/testing
-- Password hashing is done in the application, so we're using pre-generated BCrypt hashes
-- All test users have password: "test123" hashed with BCrypt

-- Admin user: admin / test123
INSERT INTO users (username, email, password_hash, role, full_name, is_active, created_at, updated_at)
VALUES ('admin', 'admin@example.com', '$2a$10$Uj38Rm73QOmze4YVQjKfZ.O6cAj6wNCa1/xBJ3CXsr4kQRCl1zTHC', 'admin', 'Administrator', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- Teacher users: prof1, prof2 / test123
INSERT INTO users (username, email, password_hash, role, full_name, is_active, created_at, updated_at)
VALUES ('prof1', 'prof1@example.com', '$2a$10$Uj38Rm73QOmze4YVQjKfZ.O6cAj6wNCa1/xBJ3CXsr4kQRCl1zTHC', 'teacher', 'Dr. Jean Dupont', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password_hash, role, full_name, is_active, created_at, updated_at)
VALUES ('prof2', 'prof2@example.com', '$2a$10$Uj38Rm73QOmze4YVQjKfZ.O6cAj6wNCa1/xBJ3CXsr4kQRCl1zTHC', 'teacher', 'Dr. Marie Martin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- Student users: student1, student2 / test123
INSERT INTO users (username, email, password_hash, role, full_name, is_active, created_at, updated_at)
VALUES ('student1', 'student1@example.com', '$2a$10$Uj38Rm73QOmze4YVQjKfZ.O6cAj6wNCa1/xBJ3CXsr4kQRCl1zTHC', 'student', 'Alice Dupont', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password_hash, role, full_name, is_active, created_at, updated_at)
VALUES ('student2', 'student2@example.com', '$2a$10$Uj38Rm73QOmze4YVQjKfZ.O6cAj6wNCa1/xBJ3CXsr4kQRCl1zTHC', 'student', 'Bob Martin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;
