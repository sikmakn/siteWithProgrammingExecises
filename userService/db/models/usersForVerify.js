const mongoose = require('mongoose');
const usersForVerify = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = {
    usersForVerify: mongoose.model('UsersForVerify', usersForVerify),
    scheme: usersForVerify,
};