function fromObjToThemeObj(obj) {
    const theme = {
        language: obj.language,
        name: obj.name,
    };
    if (obj.number) theme.number = obj.number;
    return theme;
}

function fromThemeToOutObj(theme) {
    return {
        _id: theme._id,
        number: theme.number,
        name: theme.name,
        language: theme.language,
    };
}

module.exports = {
    fromObjToThemeObj,
    fromThemeToOutObj,
};