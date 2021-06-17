import { createDbApi } from "../database/db-api";

const DB = createDbApi("test");
const TEST_DB_NAME = "flashcards-test";

const TEST_USERNAME = "testuser";
const TEST_USER_ID = 1;
const TEST_PASSWORD = "testpassword123";

const TEST_TABLE_NAME = `${TEST_USERNAME}_trivia`;
const TEST_QUESTION = "test question";
const TEST_ANSWER = "test answer";
const TEST_QUESTION_ID = 1;

beforeAll(async () => {
    await DB.query("CREATE DATABASE IF NOT EXISTS ??", [`${TEST_DB_NAME}`]);
    await DB.query("USE ??", [`${TEST_DB_NAME}`]);
    await DB.trivia.create(TEST_USERNAME);
    await DB.users.create();
});

afterAll(async () => {
    await DB.query("DROP DATABASE ??", [`${TEST_DB_NAME}`]);
    DB.con.end();
});

describe("db", () => {
    describe("trivia table", () => {
        let result;

        it("adds question to test db", async () => {
            result = await DB.trivia.add(
                TEST_USERNAME,
                TEST_QUESTION,
                TEST_ANSWER
            );

            expect(result).not.toBeUndefined();
        });

        it("retrieves question from test db", async () => {
            result = await DB.trivia.get(TEST_USERNAME, TEST_QUESTION_ID);

            expect(result[0].question).toEqual(TEST_QUESTION);
            expect(result[0].answer).toEqual(TEST_ANSWER);
        });

        it("deletes question from test db", async () => {
            result = await DB.trivia.delete(TEST_USERNAME, TEST_QUESTION_ID);

            expect(result).not.toBeUndefined();
        });
    });

    describe("users table", () => {
        let result;

        it("adds user to table", async () => {
            result = await DB.users.add(TEST_USERNAME, TEST_PASSWORD);
            // console.log("add user: ", result);
            expect(result.insertId).toEqual(1);
        });

        it("finds user by name", async () => {
            result = await DB.users.get(TEST_USERNAME);
            // console.log("get user: ", result);
            expect(result.username).toEqual(TEST_USERNAME);
        });

        it("find user by id", async () => {
            result = await DB.users.getById(TEST_USER_ID);
            // console.log("user id: ", result);
            expect(result.id).toEqual(TEST_USER_ID);
        });
    });
});
