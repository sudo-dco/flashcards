DROP DATABASE IF EXISTS flashcards;

CREATE DATABASE flashcards;

USE flashcards;

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL);