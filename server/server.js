const express = require("express");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../database/db");

const app = express();
const port = process.env.PORT || 3000;
const signUpCode = "testcode1234";

const getRandomNum = async (username) => {
    const count = await db.getCount(username);
    const min = 1;
    const max = count.value;

    return Math.floor(Math.random() * (max - min + 1) + min);
};

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.static("public"));

app.get("/get/:user", async (req, res) => {
    const { user } = req.params;

    if (user) {
        const number = await getRandomNum(user);
        const question = await db.getQuestion(user, number);
        res.status(200).send(question[0]);
    }
});

app.post("/add/:user", (req, res) => {
    const { user } = req.params;
    const { question, answer } = req.body;

    if (user) {
        db.addQuestion(user, question, answer);
        res.sendStatus(200);
    }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
    res.json({
        isAuthenticated: true,
        user: req.user.username,
    });
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
            res.sendStatus(200).send("account_created");
        })
        .catch((error) => {
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
                return done(null, result);
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
            return done(null, result);
        })
        .catch((error) => {
            return done(error);
        });
});

// app.get("/count", async (req, res) => {
//     const result = await db.getCount();
//     res.status(200).send(result);
// });

// app.get("/number", async (req, res) => {
//     const number = await db.getRandomNum();
//     res.status(200).send({ number });
// });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
