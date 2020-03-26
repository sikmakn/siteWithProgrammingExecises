const express = require("express");
const exerciseService = require('../services/exerciseService');

module.exports = function exerciseController(lang) {
    const router = express.Router();

    router.get('/:themeId/:difficulty', async (req, res) => {
        try {
            const exercises = await exerciseService.findByThemeId(req.params.themeId, req.params.difficulty);
            res.render('exercises.hbs', {
                layout: 'themeSelectMain.hbs', isJs: true, theme: {
                    number: 1,
                    title: "bla bla bla bla",
                    lang: 'js',
                    id: '5e7bc2c9676a3b212869e106',
                },
                exercises: [
                    {
                        _id: 1,
                        number: 1,
                        task: "Найти ответ на смысл жизни, вселенной и вообще всего",
                    },
                    {
                        _id: 2,
                        number: 2,
                        task: "Ищи ещё",
                    },
                ],
            });

        } catch (err) {
            console.error(err);
        }
    });

    return router;
};
