const db = require("../database/db");

const TEST_VALUE = 10;

jest.mock("../database/db", () => {
    return {
        getCount: jest.fn().mockResolvedValue({
            value: TEST_VALUE,
        }),
    };
});

describe("db unit test", () => {
    afterEach(() => jest.resetAllMocks());

    it("returns object with value of 3", async () => {
        const obj = await db.getCount("testuser");

        expect(db.getCount).toHaveBeenCalled();
        expect(obj.value).toEqual(TEST_VALUE);
    });
});
