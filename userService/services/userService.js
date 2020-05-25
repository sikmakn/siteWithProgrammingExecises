const userRepository = require('../db/repositories/userRepository');
const argon2 = require('argon2');
const {STATIC_SALT} = require('../config');
const {getRandomString} = require('../helpers/randomString');

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

async function findByUsername(username) {
    return await userRepository.findByUsername(username);
}

async function updateEmail({username, email}) {
    return (await userRepository.updateUser({username, email}))._doc;
}

async function updateBlocking({username, isBlocked = true}) {
    //todo pub
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
    updateEmail,
    updatePassword,
};
