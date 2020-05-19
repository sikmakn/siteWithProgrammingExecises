const fact = require('./factorial');
const {containArr} = require('./arrayHelps');

function c(n, k) {
    return fact(n) / fact(k) / fact(n - k);
}

function combination(index, k, A) {
    const res = [0];
    const n = A.length;
    let s = 0;
    for (let t = 1; t <= k; t++) {
        let j = res[t - 1] + 1;
        while (j < n - k + t && s + c(n - j, k - t) <= index) {
            s += c(n - j, k - t);
            j++;
        }
        res.push(j);
    }
    res.splice(0, 1);
    return res;
}

function getCombinations(fields, length) {
    fields = [...fields];
    fields.length += fields.length - 1;

    const allCombinations = [];
    for (let i = 0; i < c(fields.length, length); i++) {
        const combinationResult = combination(i, length, fields.slice(0))
            .map((el) => fields[el - 1])
            .filter((el) => el);

        if (!combinationResult.length || containArr(allCombinations, combinationResult))
            continue;

        allCombinations.push(combinationResult);
    }
    return allCombinations;
}


module.exports = getCombinations;