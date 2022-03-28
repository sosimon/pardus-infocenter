-- Run these commands to setup databse user in prod
-- (replace "placeholder" with actual password)
CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'placeholder';
GRANT ALL PRIVILEGES ON *.* TO 'db_user'@'localhost';
FLUSH PRIVILEGES;

CREATE DATABASE infocenter;

-- run db.sql after this to create the tables