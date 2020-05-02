const testMapper = require('./testMapping');

function fromObjToExerciseObj(obj) {
    const exercise = {
        difficulty: obj.difficulty,
        themeId: obj.themeId,
        task: obj.task,
        tests: testMapper.arrToTests(obj.tests),
        language: obj.language,
    };
    if (obj.number) exercise.number = obj.number;
    return exercise;
}

function fromExerciseToOutObj(exercise) {
    return {
        language: exercise.language,
        number: exercise.number,
        task: exercise.task,
        _id: exercise._id,
    };
}

module.exports = {
    fromObjToExerciseObj,
    fromExerciseToOutObj,
};