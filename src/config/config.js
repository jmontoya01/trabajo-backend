const dotenv = require("dotenv");
const program = require("../utils/commander.js");

const { mode } = program.opts();
const environment = mode || process.env.NODE_ENV || 'development';

// Configurar dotenv para cargar el archivo .env correcto
dotenv.config({
    path: environment === "production" 
        ? "./.env.production" 
        : environment === "test" 
        ? "./.env.test" 
        : "./.env.development"
});

const configObject = {
    node_env: process.env.NODE_ENV,
    mongo_url: process.env.MONGO_URL,
    port: process.env.PORT
};

module.exports = configObject;