exports.generateIdList = (count) => {
    const ids = [];

    for (let i = 1; i <= count; i++) {
        ids.push(i);
    }

    return ids;
};

exports.getQuestionId = (userIds) => {
    // create array of ids in user's trivia table
    // pull ids out of array until there's no more left and then recreate array
    const randomIndex = Math.floor(
        Math.random() * (userIds.length - 0 + 1) + 0
    );
    const selectedId = userIds.splice(randomIndex, 1);

    return {
        id: selectedId[0],
        updatedIds: userIds,
    };
};
