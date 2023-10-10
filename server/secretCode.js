const bcrypt = require("bcrypt");

const secretCode = bcrypt.genSaltSync(10);

//export secretCode

module.exports = secretCode;
