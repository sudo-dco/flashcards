const mysql = require("mysql");

const localDb = {
    host: "localhost",
    user: "root",
    database: "flashcards",
};

const testDb = {
    host: "localhost",
    user: "root",
};

export default {
    createDbApi: (env) => {
        let con;

        if (env === "test") {
            con = mysql.createConnection(testDb);
        } else {
            con = mysql.createConnection(localDb);
        }

        return {
            con,
            createTable: (username) => {
                return new Promise((resolve, reject) => {
                    con.query(
                        "CREATE TABLE IF NOT EXISTS ?? (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL)",
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
            },
            addQuestion: (username, question, answer) => {
                return new Promise((resolve, reject) => {
                    con.query(
                        "INSERT INTO ?? (question, answer) VALUES (?, ?)",
                        [`${username}_trivia`, question, answer],
                        (error, results) => {
                            if (error) {
                                console.error("Error adding question to DB");
                                reject(error);
                            }
                            // console.log(results);
                            resolve(results);
                        }
                    );
                });
            },
            getQuestion: (username, number) => {
                return new Promise((resolve, reject) => {
                    con.query(
                        "SELECT * FROM ?? WHERE id = ?",
                        [`${username}_trivia`, number],
                        (error, results) => {
                            if (error) {
                                console.error(
                                    "Error retrieving question from DB"
                                );
                                reject(error);
                            }
                            resolve(results);
                        }
                    );
                });
            },
            query: (str, placeholders) => {
                return new Promise((resolve, reject) => {
                    con.query(str, placeholders, (error, results) => {
                        if (error) {
                            console.error("Error running query: ", error);
                            reject(error);
                        }
                        resolve(results);
                    });
                });
            },
        };
    },
};
