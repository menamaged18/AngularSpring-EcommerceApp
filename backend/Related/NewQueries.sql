show databases;
drop database ecommerce;
create database ecommerce;
use ecommerce;

select * from custom_user;

DELETE FROM custom_user;
-- First, insert users
INSERT INTO custom_user (name, email, password, phone, user_type, is_active) 
VALUES 
('Admin User', 'admin@example.com', 'pass', '1234567890', 'Admin', TRUE),
('Normal User', 'user@example.com', 'pass', '0987654321', 'Normal', TRUE),
('Guest User', 'guest@example.com', 'pass', '5555555555', 'Guest', TRUE);

select * from custom_user;

SHOW CREATE TABLE custom_user;

select * from product;