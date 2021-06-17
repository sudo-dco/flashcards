const mysql = require("mysql");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

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

const localDb = {
    host: "localhost",
    user: "root",
    database: "flashcards",
};

const testDb = {
    host: "localhost",
    user: "root",
};

exports.createDbApi = (env) => {
    let con;

    if (env === "test") {
        con = mysql.createConnection(testDb);
    } else {
        con = mysql.createConnection(process.env.JAWSDB_URL || localDb);
    }

    const sessionStore = new MySQLStore(sessionOptions, con);

    const trivia = {
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
        add: (username, question, answer) => {
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
        get: (username, number) => {
            return new Promise((resolve, reject) => {
                con.query(
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
        },
        delete: (username, id) => {
            return new Promise((resolve, reject) => {
                con.query(
                    "DELETE FROM ?? WHERE id = ?",
                    [`${username}_trivia`, id],
                    (error, results) => {
                        if (error) reject(error);

                        resolve(results);
                    }
                );
            });
        },
        count: (username) => {
            return new Promise((resolve, reject) => {
                con.query(
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
        },
    };

    const users = {
        createTable: () => {
            return new Promise((resolve, reject) => {
                con.query(
                    "CREATE TABLE ?? (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL)",
                    ["users"],
                    (error, results) => {
                        if (error) {
                            console.error("Error creating user table");
                            reject(error);
                        }
                        resolve(results);
                    }
                );
            });
        },
        add: (username, password) => {
            return new Promise((resolve, reject) => {
                con.query(
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
        },
        get: (username) => {
            return new Promise((resolve, reject) => {
                con.query(
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
        },
        getById: (id) => {
            return new Promise((resolve, reject) => {
                con.query(
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
        },
    };

    return {
        con,
        trivia,
        users,
        session,
        sessionStore,
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
};
