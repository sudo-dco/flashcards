const express = require("express");
const db = require("../database/db");

const app = express();
const port = process.env.PORT || 3000;

const getRandomNum = async () => {
    const count = await db.getCount();
    const min = 1;
    const max = count.value;

    return Math.floor(Math.random() * (max - min + 1) + min);
};

app.use(express.json());
app.use(express.static("public"));

app.get("/get", async (req, res) => {
    const number = await getRandomNum();
    const question = await db.getQuestion(number);
    res.status(200).send(question[0]);
});

app.post("/add", (req, res) => {
    const { question, answer } = req.body;
    db.addQuestion(question, answer);
    res.sendStatus(200);
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
