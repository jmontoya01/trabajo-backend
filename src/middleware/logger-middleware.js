const logger = require("../utils/logger.js");

//a partir de un middleware, vamos a colocar en el objeto req el logger, haremos nuestro primer log
const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next()
};

module.exports = addLogger;