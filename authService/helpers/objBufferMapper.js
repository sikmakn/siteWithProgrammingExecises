const objToBuffer = (obj) => {
    const jsonMsg = JSON.stringify(obj);
    return Buffer.from(jsonMsg);
};

const bufferToObj = (buffer) => {
    const stringResult = buffer.toString();
    let result;
    try {
        result = JSON.parse(stringResult);
    } catch (e) {
        result = stringResult;
    }
    return result;
};

module.exports = {
    objToBuffer,
    bufferToObj,
};