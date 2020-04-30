const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');

module.exports = {
    name: 'theme',
    methods: [
        {
            name: 'getByLang',
            method: async (msg, res) => {
                const themes = await themeService.findThemes({language: msg.lang});
                const themesOut = themes.map(th => themeMapper.fromThemeToOutObj(th));
                res(themesOut);
            }
        },
        {
            name: 'add',
            method: (msg, res) => {

                res('answer');
            }
        },
        {
            name: 'update',
            method: (msg, res) => {

                res('answer');
            }
        },
    ]
};

// module.exports = function themeCommonController(lang) {
//     const router = express.Router();
//
//     router.get('/', asyncHandler(async (req, res) => {
//         const themes = await themeService.findThemes({language: lang});
//         const resObj = {
//             layout: 'themeSelectMain.hbs',
//             themesList: themes.map(th => themeMapper.fromThemeToOutObj(th)),
//             lang,
//         };
//         const flagName = `is${lang[0].toUpperCase() + lang.slice(1)}`;
//         resObj[flagName] = true;
//
//         res.render('themesList.hbs', resObj);
//     }));
//
//     router.post('/', asyncHandler(async (req, res) => {
//         const newTheme = themeMapper.fromObjToThemeObj(req.body);
//         const createdTheme = await themeService.create(newTheme);
//         res.json(createdTheme);
//     }));
//
//     return router;
// };
