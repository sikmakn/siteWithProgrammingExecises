const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');

module.exports = {
    name: 'theme',
    methods: [
        {
            name: 'getAllByLang',
            method: async (msg, res) => {
                const themes = await themeService.findThemes({language: msg.lang});
                res({result: themes.map(th => themeMapper.fromThemeToOutObj(th))});
            }
        },
        {
            name: 'getById',
            method: async (msg, res) => {
                try {
                    const theme = await themeService.findById(msg.id);
                    if (!theme) return res({error: new Error('theme not found')});
                    res({result: themeMapper.fromThemeToOutObj(theme)});
                } catch (error) {
                    res({error});
                }
            }
        },
        {
            name: 'getByNumber',
            method: async (msg, res) => {
                try {
                    const theme = await themeService.findByNumber(msg.number);
                    if (!theme) return res({error: new Error('theme not found')});
                    res({result: themeMapper.fromThemeToOutObj(theme)});
                } catch (error) {
                    res({error});
                }
            }
        },
        {
            name: 'create',
            method: async (msg, res) => {
                try {
                    const newTheme = themeMapper.fromObjToThemeObj(msg);
                    res({result: await themeService.create(newTheme)});
                } catch (error) {
                    res({error});
                }
            }
        },
        {
            name: 'updateById',
            method: async (msg, res) => {
                try {
                    const {id, theme} = msg;
                    const themeObj = themeMapper.fromObjToThemeObj(theme);
                    res({result: await themeService.findByIdAndUpdate(id, themeObj)});
                } catch (error) {
                    res({error});
                }
            }
        },
    ]
};