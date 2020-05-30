const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');

module.exports = {
    name: 'theme',
    methods: [
        {
            name: 'getAllByLang',
            method: async (msg, res) => {
                const themes = await themeService.findThemes({language: msg.lang});
                const themesOut = themes.map(th => themeMapper.fromThemeToOutObj(th));
                res(themesOut);
            }
        },
        {
            name: 'getById',
            method: async (msg, res) => {
                try {
                    const theme = await themeService.findById(msg.id);
                    if (!theme) return res(null);
                    const themeOut = themeMapper.fromThemeToOutObj(theme);
                    res(themeOut);
                }catch(e){
                    res(null);
                }
            }
        },
        {
            name: 'getByNumber',
            method: async (msg, res) => {
                const theme = await themeService.findByNumber(msg.number);
                if (!theme) return res(theme);
                const themeOut = themeMapper.fromThemeToOutObj(theme);
                res(themeOut);
            }
        },
        {
            name: 'create',
            method: async (msg, res) => {
                const newTheme = themeMapper.fromObjToThemeObj(msg);
                const createdTheme = await themeService.create(newTheme);
                res(createdTheme);
            }
        },
        {
            name: 'updateById',
            method: async (msg, res) => {
                const {id, theme} = msg;
                const themeObj = themeMapper.fromObjToThemeObj(theme);
                const resultTheme = await themeService.findByIdAndUpdate(id, themeObj);
                res(resultTheme);
            }
        },
    ]
};