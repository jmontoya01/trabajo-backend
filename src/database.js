const mongoose = require("mongoose");
const configObject = require("./config/config.js")
const {mongo_url} = configObject;

class Database {
    static #instance; 
    constructor(){
        mongoose.connect(mongo_url);
    }

    static getInstance(){
        if (this.#instance) {
            console.log("Conexión previa con MongoDB");
            return this.#instance;
        } else {
            this.#instance = new Database()
            console.log("Conexión exitosa con MongoDB");
            return this.#instance;
        };
    };
};

module.exports = Database.getInstance();