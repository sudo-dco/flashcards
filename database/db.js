const mysql = require("mysql");

const localDB = {
    host: "localhost",
    user: "root",
    database: "flashcards",
};

const db = mysql.createConnection(process.env.JAWSDB_URL || localDB);

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

module.exports = {
    getQuestion,
    addQuestion,
    getCount,
};
