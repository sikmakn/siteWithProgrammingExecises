function arrToTests(arrObjs) {
    return arrObjs.map(obj => {
        return {
            input: obj.input,
            output: obj.output,
            additionalCode: obj.additionalCode,
        }
    });
}

module.exports = {
    arrToTests,
};