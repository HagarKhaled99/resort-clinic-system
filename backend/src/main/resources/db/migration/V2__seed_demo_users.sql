-- Demo staff accounts (same as the React demo: doctor / 1234 and nurse / 1234).
-- Passwords are stored as BCrypt hashes, never as plain text.
-- Change these passwords before the system is used with real patients.
INSERT INTO users (full_name, username, password_hash, role) VALUES
    ('Dr. Mena',       'doctor', '$2a$10$0smkXhpMtYReG3TrBI/FNe.VDZSQat4B6NEiW5hJiFHxRMNsMtQHu', 'DOCTOR'),
    ('Nurse Mona Ali', 'nurse',  '$2a$10$0smkXhpMtYReG3TrBI/FNe.VDZSQat4B6NEiW5hJiFHxRMNsMtQHu', 'NURSE');
