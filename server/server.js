const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../database/db");

const app = express();
const port = process.env.PORT || 3000;

const signUpCode = "testcode1234";
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
    session({
        secret: "testsecret1234",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.static("public"));

app.get("/get", async (req, res) => {
    const { username } = req.user;
    console.log("get route user obj: ", username);

    // add check for existing username

    if (username) {
        const number = await getQuestionId(username);
        const question = await db.getQuestion(username, number);
        res.status(200).send(question[0]);
    }
});

app.post("/add", (req, res) => {
    const { username } = req.user;
    const { user } = req.params;
    const { question, answer } = req.body;

    console.log("add route user obj: ", username);

    if (username) {
        db.addQuestion(username, question, answer);
        res.sendStatus(200);
    }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({
        isAuthenticated: true,
    });
});

app.get("/checkAuth", (req, res) => {
    if (req.user) {
        res.send({
            user: username,
            isAuthenticated: true,
        });
    } else {
        res.send({ isAuthenticated: false });
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
