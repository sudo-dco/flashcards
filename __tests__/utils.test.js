const utils = require("../server/utils");

test("returns array with range 1-5", () => {
    const ids = utils.generateIdList(5);

    expect(ids).toHaveLength(5);
});

test("returns id list with one random number removed", () => {
    const userQuestionList = {
        testuser2: [1, 2, 3, 4, 5],
    };
    const { updatedIds } = utils.getQuestionId(userQuestionList["testuser2"]);

    expect(updatedIds).toHaveLength(4);
});
