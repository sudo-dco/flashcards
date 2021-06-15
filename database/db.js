const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const localDB = {
    host: "localhost",
    user: "root",
    database: "flashcards",
};

const sessionOptions = {
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    createDatabaseTable: true,
    schema: {
        tableName: "sessions",
        columnNames: {
            session_id: "session_id",
            expires: "expires",
            data: "data",
        },
    },
};

const db = mysql.createConnection(process.env.JAWSDB_URL || localDB);
const sessionStore = new MySQLStore(sessionOptions, db);

const createTable = (username) => {
    return new Promise((resolve, reject) => {
        db.query(
            "CREATE TABLE ?? (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL)",
            [`${username}_trivia`],
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

const getCount = (username) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT COUNT(id) as value FROM ??",
            [`${username}_trivia`],
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

exports.getAllIds = (username) => {
    return new Promise((resolve, reject));
};

const getQuestion = (username, number) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM ?? WHERE id = ?",
            [`${username}_trivia`, number],
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

const addQuestion = (username, question, answer) => {
    db.query(
        "INSERT INTO ?? (question, answer) VALUES (?, ?)",
        [`${username}_trivia`, question, answer],
        (error, results) => {
            if (error) {
                console.error("Error adding question to DB", error);
            }
            console.log(results);
        }
    );
};

const deleteQuestion = (username, id) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM ?? WHERE id = ?",
            [`${username}_trivia`, id],
            (error, results) => {
                if (error) reject(error);

                resolve(results);
            }
        );
    });
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
    deleteQuestion,
    getCount,
    findUser,
    findById,
    session,
    sessionStore,
};
