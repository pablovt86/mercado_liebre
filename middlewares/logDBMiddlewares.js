const fs = require('fs');

function logDBMiddlewares(req, res, next) {
    fs.appendFileSync('logDB.txt', 'se creo un ingreso en la db' + req.url);

    next();
}
module.exports = logDBMiddlewares;