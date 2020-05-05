function fromObjToThemeObj(obj) {
    const theme = {
        language: obj.language,
        name: obj.name,
        theoryLink: obj.theoryLink,
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
        theoryLink: theme.theoryLink,
    };
}

module.exports = {
    fromObjToThemeObj,
    fromThemeToOutObj,
};