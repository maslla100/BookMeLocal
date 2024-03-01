-- Drop the database if it exists and create a new one
DROP DATABASE IF EXISTS z7tyvgse3ogpmo4f;
CREATE DATABASE z7tyvgse3ogpmo4f CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE z7tyvgse3ogpmo4f;

-- Create Users table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'owner', 'customer') NOT NULL DEFAULT 'customer',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME DEFAULT NULL 
    
);

-- Create Businesses table
CREATE TABLE Businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    owner_id INT,
    hours VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME DEFAULT NULL, 
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE SET NULL
);
-- Add index on name field in Businesses table
CREATE INDEX idx_businesses_name ON Businesses(name);

-- Create Services table
CREATE TABLE Services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    business_id INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME DEFAULT NULL, 
    FOREIGN KEY (business_id) REFERENCES Businesses(id) ON DELETE CASCADE
);

-- Create Bookings table
CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_time DATETIME NOT NULL,
    duration INT NOT NULL, -- Duration in minutes
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME DEFAULT NULL,
    FOREIGN KEY (service_id) REFERENCES Services(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


