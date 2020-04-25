const express = require("express");
const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');
const asyncHandler = require('express-async-handler');
const mustAuthenticated = require('../Handlers/adminAuth');

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

    router.post('/', mustAuthenticated, asyncHandler(async (req, res) => {
        const newTheme = themeMapper.fromObjToThemeObj(req.body);
        const createdTheme = await themeService.create(newTheme);
        res.json(createdTheme);
    }));

    return router;
};
