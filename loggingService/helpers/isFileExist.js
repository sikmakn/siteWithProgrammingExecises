const fs = require('fs');

module.exports = {
    isFileExist: path => fs.existsSync(path),
};
