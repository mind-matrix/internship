const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');

const publicKey = readFileSync(`${__dirname}/../../../public.key`);

module.exports = function (req, res, next) {
    let token = req.headers.authorization;
    if (token) {
        req.context = jwt.decode(token, publicKey);
        next();
    } else {
        res.status(403).send();
    }
};