import dbModule from "../database/db-api";

const DB = dbModule.createDbApi("test");
const TEST_DB_NAME = "flashcards-test";
const TEST_USERNAME = "testuser";
const TEST_TABLE_NAME = `${TEST_USERNAME}_trivia`;

// jest.mock("../database/db", () => {
//     return {
//         getCount: jest.fn().mockResolvedValue({
//             value: TEST_VALUE,
//         }),
//     };
// });

// beforeAll(async () => {
//     try {
//         DB.con.query(
//             "CREATE DATABASE IF NOT EXISTS ??",
//             [`${TEST_DB_NAME}`],
//             (results) => {
//                 console.log("CREATE DB: ", results);
//             }
//         );

// DB.con.changeUser({ database: TEST_DB_NAME }, (results) => {
//     console.log("CHANGE USER: ", results);
// });

//         await DB.createTable(TEST_USERNAME);
//     } catch (err) {
//         if (err) throw err;
//     }
// });

afterAll(async () => {
    await DB.query("DROP DATABASE ??", [`${TEST_DB_NAME}`]);

    DB.con.end();
});

// describe("db unit tests", () => {
//     afterEach(() => jest.resetAllMocks());

//     it("returns object with value of 3", async () => {
//         const obj = await db.getCount("testuser");

//         expect(db.getCount).toHaveBeenCalled();
//         expect(obj.value).toEqual(TEST_VALUE);
//     });
// });

describe("db", () => {
    it("creates a test database", async () => {
        const results = await DB.query("CREATE DATABASE IF NOT EXISTS ??", [
            `${TEST_DB_NAME}`,
        ]);

        // console.log(results);

        expect(results).not.toBeUndefined();
    });

    it("creates new table with correct name", async () => {
        const query = "SHOW TABLES FROM ?? LIKE ?";

        await DB.query("USE ??", [`${TEST_DB_NAME}`]);

        await DB.createTable(TEST_USERNAME);

        const results = await DB.query(query, [
            `${TEST_DB_NAME}`,
            TEST_TABLE_NAME,
        ]);

        // console.log(results);

        expect(results.length).toBeGreaterThan(0);
    });
});
