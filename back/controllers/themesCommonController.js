const express = require("express");

const themesList = [
    {
        id: 1,
        number: 1,
        title: "Функциональные выражения",
    },
    {
        id: 2,
        number: 2,
        title: "Функциональные выражения",
    },
    {
        id: 3,
        number: 3,
        title: "Функциональные выражения",
    },
    {
        id: 4,
        number: 4,
        title: "Функциональные выражения",
    },
    {
        id: 5,
        number: 5,
        title: "Функциональные выражения",
    },
    {
        id: 6,
        number: 6,
        title: "Функциональные выражения",
    },
    {
        id: 7,
        number: 7,
        title: "Функциональные выражения",
    },
    {
        id: 8,
        number: 8,
        title: "Функциональные выражения",
    },
    {
        id: 9,
        number: 9,
        title: "Функциональные выражения",
    },
    {
        id: 10,
        number: 10,
        title: "Функциональные выражения",
    },
    {
        id: 11,
        number: 11,
        title: "Функциональные выражения",
    },
    {
        id: 12,
        number: 12,
        title: "Функциональные выражения",
    },
    {
        id: 13,
        number: 13,
        title: "Функциональные выражения",
    },
    {
        id: 14,
        number: 14,
        title: "Функциональные выражения",
    },
    {
        id: 15,
        number: 15,
        title: "Функциональные выражения",
    },
    {
        id: 16,
        number: 16,
        title: "Функциональные выражения",
    },
    {
        id: 17,
        number: 17,
        title: "Функциональные выражения",
    },
    {
        id: 18,
        number: 18,
        title: "Функциональные выражения",
    },
    {
        id: 19,
        number: 19,
        title: "Функциональные выражения",
    },
    {
        id: 20,
        number: 20,
        title: "Функциональные выражения",
    },
    {
        id: 21,
        number: 21,
        title: "Функциональные выражения",
    },
    {
        id: 22,
        number: 22,
        title: "Функциональные выражения",
    },
];

module.exports = function themeCommonController(lang) {
    const router = express.Router();

    router.get('/', (req, res) => {
        const flagName = `is${lang[0].toUpperCase() + lang.slice(1)}`;
        const resObj = {
            layout: 'themeSelectMain.hbs',
            themesList,
            lang,
        };
        resObj[flagName] = true;

        res.render('themesList.hbs', resObj);
    });

    router.get('/:id/:difficulty', (req, res) => {
        console.log(req.params);
        res.render('empty.hbs');
    });

    return router;
};
