function isArrsEquals(firstArr, secondArr) {
    return isSubArr(firstArr, secondArr) && isSubArr(secondArr, firstArr);
}

function isSubArr(fullArr, subArr) {
    return subArr.every((el) => fullArr.includes(el));
}

function containArr(fullArr, arr) {
    return fullArr.some((el) => isArrsEquals(el, arr))
}

module.exports = {
    isSubArr,
    containArr,
    isArrsEquals,
};