const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
        .required(),
    email: Joi.string()
        .email(),
});

const statusSchema = Joi.string().valid('free', 'paid', 'admin');
const passwordSchema = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'));
const emailSchema = Joi.string().email();

module.exports = {
    userSchema,
    emailSchema,
    statusSchema,
    passwordSchema,
};