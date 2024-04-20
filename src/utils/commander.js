const {Command} = require("commander");
const program = new Command();

//Recuerden
//1. comando, 2. la descripción, 3. valor por default
program
    .option("--mode <mode>", "modo de trabajo", "production")
program.parse();//cerrar program

module.exports = program;