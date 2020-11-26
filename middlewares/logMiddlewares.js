const fs = require('fs');

function logMiddlewares(req, res, next) {
    fs.appendFileSync('log.txt', 'se ingreso en la pagina' + req.url);

    next();
}
module.exports = logMiddlewares;