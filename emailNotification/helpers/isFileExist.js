const fs = require('fs');

module.exports = {
    isFileExist: path => fs.existsSync(path),
    isFileExistAsync: path => fs.exists(path),
};
