const express = require("express");
const asyncHandler = require('express-async-handler');

module.exports = function themeCommonController() {
    const router = express.Router();

    router.get('/', asyncHandler(async (req, res) => {
        // const themes = await themeService.findThemes({language: lang});
        // const resObj = {
        //     layout: 'themeSelectMain.hbs',
        //     themesList: themes.map(th => themeMapper.fromThemeToOutObj(th)),
        //     lang,
        // };
        // const flagName = `is${lang[0].toUpperCase() + lang.slice(1)}`;
        // resObj[flagName] = true;

        // res.render('themesList.hbs', resObj);
        next();
    }));

    router.post('/', asyncHandler(async (req, res, next) => {
        // res.json(createdTheme);
        next();
    }));

    return router;
};
