const themeService = require('../services/themeService');
const themeMapper = require('../Mappers/themeMapper');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');

module.exports = {
    name: 'theme',
    methods: [
        {
            name: 'getAllByLang',
            method: async (msg, res) => {
                try {
                    const themes = await themeService.findThemes({language: msg.lang});
                    res({result: themes.map(th => themeMapper.fromThemeToOutObj(th))});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'getById',
            method: async (msg, res) => {
                try {
                    const theme = await themeService.findById(msg.id);
                    if (!theme) return res({error: serializeError(new Error('theme not found'))});
                    res({result: themeMapper.fromThemeToOutObj(theme)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'getByNumber',
            method: async (msg, res) => {
                try {
                    const theme = await themeService.findByNumber(msg.number);
                    if (!theme) return res({error: serializeError(new Error('theme not found'))});
                    res({result: themeMapper.fromThemeToOutObj(theme)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
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
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
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
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
    ]
};