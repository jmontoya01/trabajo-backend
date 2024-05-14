const winston = require("winston");
const configObject = require("../config/config.js");
const {node_env} = configObject;

const levels = {
    level: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
};

//logger para desarrollo

const loggerDev = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: levels.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

//logger para produccion

const loggerProduct = winston.createLogger({
    levels: levels.level,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: levels.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})


//que logger usar segun el entorno

const logger = node_env === "production" ? loggerProduct : loggerDev;


//a partir de un middleware, vamos a colocar en el objeto req el logger, aremos nuestro primer log
const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next()
};

module.exports = addLogger;

