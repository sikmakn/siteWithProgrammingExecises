const express = require("express");
const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');
const asyncHandler = require('express-async-handler');

module.exports = function themeCommonController(lang) {
    const router = express.Router();

    router.get('/', asyncHandler(async (req, res) => {
        const themes = await themeService.findThemes({language: lang});
        const resObj = {
            layout: 'themeSelectMain.hbs',
            themesList: themes.map(th => themeMapper.fromThemeToOutObj(th)),
            lang,
        };
        const flagName = `is${lang[0].toUpperCase() + lang.slice(1)}`;
        resObj[flagName] = true;

        res.render('themesList.hbs', resObj);
    }));

    router.post('/', asyncHandler(async (req, res) => {
        const newTheme = themeMapper.fromObjToThemeObj(req.body);
        await themeService.create(newTheme);
        res.render('empty.hbs');
    }));

    return router;
};
