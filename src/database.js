const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://jeffquetas:jeff1302@cluster0.zqiftye.mongodb.net/proyecto-backend?retryWrites=true&w=majority")
    .then(() => console.log("Conexión exitosa con MongoDB"))
    .catch(() => console.log("Ocurrio un error inesperado"));