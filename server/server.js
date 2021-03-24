require("dotenv").config();
const express = require("express");
// const session = require("express-session");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../database/db");

const app = express();
const port = process.env.PORT || 3000;

const signUpCode = process.env.SIGNUP_CODE;
const userQuestionList = {};

const generateIdList = async (username) => {
    const ids = [];
    const count = await db.getCount(username);

    for (let i = 1; i <= count.value; i++) {
        ids.push(i);
    }

    userQuestionList[username] = ids;
};

const getQuestionId = async (username) => {
    // create array of ids in user's trivia table
    // pull ids out of array until there's no more left and then recreate array
    if (
        !userQuestionList[username] ||
        userQuestionList[username].length === 0
    ) {
        await generateIdList(username);
    }

    const randomIndex = Math.floor(
        Math.random() * (userQuestionList[username].length - 0 + 1) + 0
    );
    const id = userQuestionList[username].splice(randomIndex, 1);

    return id[0];
};

app.use(
    db.session({
        name: "flashcards.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: db.sessionStore,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.static("public"));

app.get("/question", async (req, res) => {
    let result = null;

    if (req.user) {
        const { username } = req.user;
        const number = await getQuestionId(username);
        const question = await db.getQuestion(username, number);
        result = {
            id: question[0][id],
            question: question[0][question],
            answer: question[0][answer],
        };
    } else {
        result = "Not authorized, please login again.";
    }

    res.status(200).send(result);
});

app.get("/question/all", async (req, res) => {});

app.post("/question", (req, res) => {
    const { username } = req.user;
    const { question, answer } = req.body;

    if (username) {
        db.addQuestion(username, question, answer);
    }

    res.sendStatus(200);
});

app.delete("/question", (req, res) => {
    const { id } = req.body;
    let result = null;

    if (req.user) {
        const { username } = req.user;
        try {
            db.deleteQuestion(username, id);
            result = "Question Deleted";
        } catch (error) {
            console.error("Error deleting question from DB: ", error);
            result = "Error deleting question from DB";
        }
    } else {
        result = "Not authorized, please login again.";
    }

    res.status(200).send(result);
});

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({
        isAuthenticated: true,
    });
});

app.get("/checkAuth", (req, res) => {
    if (req.session.passport) {
        const { username } = req.user;

        res.json({
            user: username,
            isAuthenticated: true,
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

app.post("/signup", async (req, res) => {
    const { username, password, code } = req.body;

    if (code !== signUpCode) {
        return res.status(200).send("invalid_code");
    }

    const userCheck = await db.findUser(username);

    if (userCheck !== undefined) {
        return res.status(200).send("username_taken");
    }

    db.addUser(username, password)
        .then((result) => {
            return db.createTable(username);
        })
        .then((result) => {
            return res.status(200).send("account_created");
        })
        .catch((error) => {
            console.log(error);
            res.status(200).send(error);
        });
});

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

passport.use(
    new LocalStrategy((username, password, done) => {
        db.findUser(username)
            .then((result) => {
                if (result === undefined) {
                    return done(null, false, { message: "Incorrect username" });
                }
                if (result.password !== password) {
                    return done(null, false, { message: "Incorrect password" });
                }
                return done(null, {
                    id: result.id,
                    username: result.username,
                });
            })
            .catch((error) => {
                return done(error);
            });
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.findById(id)
        .then((result) => {
            return done(null, {
                id: result.id,
                username: result.username,
            });
        })
        .catch((error) => {
            return done(error);
        });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
