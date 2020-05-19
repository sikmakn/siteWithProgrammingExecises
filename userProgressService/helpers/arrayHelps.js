function isArrsEquals(firstArr, secondArr) {
    return firstArr.every((el) => secondArr.includes(el))
        && secondArr.every((el) => firstArr.includes(el));
}

function containArr(fullArr, arr) {
    return fullArr.some((el) => isArrsEquals(el, arr))
}

module.exports = {
    containArr,
    isArrsEquals,
};