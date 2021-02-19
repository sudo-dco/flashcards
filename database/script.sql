DROP DATABASE IF EXISTS flashcards;

CREATE DATABASE flashcards;

USE flashcards;

CREATE TABLE trivia(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL);