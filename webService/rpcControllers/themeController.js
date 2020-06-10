const themeService = require('../services/themeService');
const exerciseService = require('../services/exerciseService');
const themeMapper = require('../Mappers/themeMapper');
const {pubExchanges, serviceName} = require('../options');
const {publish, getChannel} = require('../amqpHandler');
const {serializeError} = require('serialize-error');
const {Types} = require('mongoose');

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
            method: async ({id}, res) => {
                try {
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('Not valid id'))});
                    const theme = await themeService.findById(id);
                    res({result: theme ? themeMapper.fromThemeToOutObj(theme) : theme});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'getByNumber',
            method: async ({number}, res) => {
                try {
                    const theme = await themeService.findByNumber(number);
                    res({result: theme ? themeMapper.fromThemeToOutObj(theme) : theme});
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
            method: async ({id, theme}, res) => {
                try {
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('Not valid id'))});
                    const themeObj = themeMapper.fromObjToThemeObj(theme);
                    res({result: await themeService.findByIdAndUpdate(id, themeObj)});
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
        {
            name: 'deleteById',
            method: async ({id}, res) => {
                try {
                    if (!Types.ObjectId.isValid(id))
                        return res({error: serializeError(new Error('Not valid id'))});
                    res({
                        result: await Promise.all([
                            themeService.deleteById(id),
                            exerciseService.deleteManyByThemeId(id),
                        ])
                    });
                } catch (error) {
                    await publish(await getChannel(), pubExchanges.error,
                        {error: serializeError(error), date: Date.now(), serviceName});
                    res({error: serializeError(error)});
                }
            }
        },
    ]
};