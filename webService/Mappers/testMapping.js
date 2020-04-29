function arrToTests(arrObjs) {
    return arrObjs.map(obj => ({
        input: obj.input,
        output: obj.output,
        additionalCode: obj.additionalCode,
    }));
}

module.exports = {
    arrToTests,
};