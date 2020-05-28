const userRepository = require('../db/repositories/userRepository');
const argon2 = require('argon2');
const {STATIC_SALT} = require('../config');
const {getRandomString} = require('../helpers/randomString');
const {publish, getChannel} = require('../amqpHandler');
const {pubExchanges} = require('../options');

async function create({username, password, email, status = 'free', isBlocked = false}) {
    const dynamicSalt = getRandomString();
    const saltedPassword = `${password}.${STATIC_SALT}.${dynamicSalt}`;
    const hashedPassword = await argon2.hash(saltedPassword);
    const newUser = await userRepository.create({
        username,
        password: hashedPassword,
        salt: dynamicSalt,
        isBlocked,
        status,
        email,
    });
    return newUser._doc;
}

async function validate({username, password}) {
    const user = await userRepository.findByUsername(username);
    return await argon2.verify(user.password, `${password}.${STATIC_SALT}.${user.salt}`);
}

async function isValidNonBLocked({username, password}) {
    const user = await userRepository.findByUsername(username);
    return user && !user.isBlocked && await argon2.verify(user.password, `${password}.${STATIC_SALT}.${user.salt}`);
}

async function findByUsername(username) {
    return (await userRepository.findByUsername(username))._doc;
}

async function findByIdentityData({username, email}) {
    return (await userRepository.findByIdentityData({username, email}))._doc;
}

async function updateEmail({username, email}) {
    return (await userRepository.updateUser({username, email}))._doc;
}

async function updateBlocking({username, isBlocked = true}) {
    const {email} = (await userRepository.findByUsername(username))._doc;
    await publish(await getChannel(), pubExchanges.blockUser, {username, email, isBlocked: true});

    return (await userRepository.updateUser({username, isBlocked}))._doc;
}

async function updateStatus({username, status = 'free'}) {
    return (await userRepository.updateUser({username, status}))._doc;
}

async function updatePassword({username, password}) {
    const dynamicSalt = getRandomString();
    const saltedPassword = `${password}.${STATIC_SALT}.${dynamicSalt}`;
    const hashedPassword = await argon2.hash(saltedPassword);
    return (await userRepository.updateUser({username, password: hashedPassword, salt: dynamicSalt}))._doc;
}

module.exports = {
    create,
    validate,
    updateStatus,
    updateBlocking,
    findByUsername,
    findByIdentityData,
    updateEmail,
    isValidNonBLocked,
    updatePassword,
};
