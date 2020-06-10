const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(6)
        .max(20)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9!\@\#\$\%\^\&\*]{6,20}$'))
        .required(),
    email: Joi.string()
        .email(),
});

const roleSchema = Joi.string().valid('free', 'paid', 'admin');
const passwordSchema = Joi.string().pattern(new RegExp('^[a-zA-Z0-9!\@\#\$\%\^\&\*]{6,20}$'));
const emailSchema = Joi.string().email();

module.exports = {
    userSchema,
    emailSchema,
    roleSchema,
    passwordSchema,
};