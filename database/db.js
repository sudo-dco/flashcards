const mysql = require("mysql");

const localDB = {
    host: "localhost",
    user: "root",
    database: "flashcards",
};

const db = mysql.createConnection(process.env.JAWSDB_URL || localDB);

const createTable = (username) => {
    return new Promise((resolve, reject) => {
        db.query(
            `CREATE TABLE ${username}_trivia (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL)`,
            (error, results) => {
                if (error) {
                    console.error(
                        "Error creating trivia table for user: ",
                        username,
                        error
                    );
                    reject(error);
                }
                resolve(results);
            }
        );
    });
};

const addUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password],
            (error, results) => {
                if (error) {
                    console.error(
                        "Error adding user account: ",
                        username,
                        error
                    );
                    reject(error);
                }
                resolve(results);
            }
        );
    });
};

const getCount = () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT COUNT(id) as value FROM `trivia`",
            (error, results) => {
                if (error) {
                    console.error("Error retrieving count from DB");
                    reject(error);
                }
                resolve(results[0]);
            }
        );
    });
};

const getQuestion = (number) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM `trivia` WHERE `id` = ?",
            [number],
            (error, results) => {
                if (error) {
                    console.error("Error retrieving question from DB");
                    reject(error);
                }
                resolve(results);
            }
        );
    });
};

const addQuestion = (question, answer) => {
    db.query(
        `INSERT INTO trivia (question, answer) VALUES ('${question}', '${answer}')`,
        (error, results) => {
            if (error) {
                console.error("Error adding question to DB", error);
            }
            console.log(results);
        }
    );
};

// returns array of result obj
const findUser = (username) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM `users` WHERE `username` = ?",
            [username],
            (error, results) => {
                if (error) {
                    console.error("Error retrieving user from DB");
                    reject(error);
                }

                resolve(results[0]);
            }
        );
    });
};

const findById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM `users` WHERE `id` = ?",
            [id],
            (error, results) => {
                if (error) {
                    console.error("Error retrieving user from DB");
                    reject(error);
                }

                resolve(results[0]);
            }
        );
    });
};

module.exports = {
    createTable,
    addUser,
    getQuestion,
    addQuestion,
    getCount,
    findUser,
    findById,
};
