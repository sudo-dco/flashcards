import dbModule from "../database/db-api";

const DB = dbModule.createDbApi("test");
const TEST_DB_NAME = "flashcards-test";
const TEST_USERNAME = "testuser";
const TEST_TABLE_NAME = `${TEST_USERNAME}_trivia`;
const TEST_QUESTION = "test question";
const TEST_ANSWER = "test answer";
const TEST_QUESTION_ID = 1;

beforeAll(async () => {
    await DB.query("CREATE DATABASE IF NOT EXISTS ??", [`${TEST_DB_NAME}`]);
});

afterAll(async () => {
    await DB.query("DROP DATABASE ??", [`${TEST_DB_NAME}`]);
    DB.con.end();
});

describe("db", () => {
    it("creates new table with correct name", async () => {
        // returns an array of matching table names
        const query = "SHOW TABLES FROM ?? LIKE ?";

        await DB.query("USE ??", [`${TEST_DB_NAME}`]);

        await DB.createTable(TEST_USERNAME);

        const result = await DB.query(query, [
            `${TEST_DB_NAME}`,
            TEST_TABLE_NAME,
        ]);

        expect(result.length).toBeGreaterThan(0);
    });

    it("adds question to test db", async () => {
        const result = await DB.addQuestion(
            TEST_USERNAME,
            TEST_QUESTION,
            TEST_ANSWER
        );

        expect(result).not.toBeUndefined();
    });

    it("retrieves question from test db", async () => {
        const result = await DB.getQuestion(TEST_USERNAME, TEST_QUESTION_ID);

        expect(result[0].question).toEqual(TEST_QUESTION);
        expect(result[0].answer).toEqual(TEST_ANSWER);
    });
});
