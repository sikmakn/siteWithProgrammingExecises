const nodemailer = require('nodemailer');
const {emailTemplates} = require('../options');
const {SENDER_EMAIL_ADDRESS, REFRESH_TOKEN, CLIENT_ID, CLIENT_SECRET, DOMAIN} = require('../config');
const fs = require('fs');

const transporter = nodemailer.createTransport({
        pool: true,
        service: 'Gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            refreshToken: REFRESH_TOKEN,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
        }
    },
    {
        from: SENDER_EMAIL_ADDRESS,
    });

async function sendBlockMail({email, username}) {
    const template = emailTemplates.blockUserObj;
    const data = await new Promise((res, rej) =>
        fs.readFile('./templates/blockUser.html',
            (err, data) => err ? rej(err) : res(data)));
    const html = data.toString()
        .replace(/{{username}}/g, username)
        .replace(/{{domain}}/g, DOMAIN);
    return await transporter.sendMail({
        to: email,
        subject: template.subject,
        html,
    })
}

async function sendUnblockMail({email, username}) {
    const template = emailTemplates.unblockUserObj;
    const data = await new Promise((res, rej) =>
        fs.readFile('./templates/unblockUser.html',
            (err, data) => err ? rej(err) : res(data)));
    const html = data.toString()
        .replace(/{{username}}/g, username)
        .replace(/{{domain}}/g, DOMAIN);
    return await transporter.sendMail({
        to: email,
        subject: template.subject,
        html,
    })
}

async function sendVerifyMail({email, username, verifyLink}) {
    const template = emailTemplates.unblockUserObj;
    const data = await new Promise((res, rej) =>
        fs.readFile('./templates/verifyUser.html',
            (err, data) => err ? rej(err) : res(data)));
    const html = data.toString()
        .replace(/{{verifyLink}}/g, verifyLink)
        .replace(/{{username}}/g, username)
        .replace(/{{domain}}/g, DOMAIN);
    return await transporter.sendMail({
        to: email,
        subject: template.subject,
        html,
    })
}

module.exports = {
    sendBlockMail,
    sendUnblockMail,
    sendVerifyMail,
};