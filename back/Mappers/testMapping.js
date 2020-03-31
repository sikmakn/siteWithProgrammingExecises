function arrToTests(arrObjs) {
    return arrObjs.map(obj => {
        return {
            input: obj.input,
            output: obj.output,
        }
    });
}

module.exports = {
    arrToTests,
};