const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model.js");
const {createHash} = require("../utils/hashBcrypt.js");
// const passport = require("passport");

router.post ("/", async (req, res) => {
    const {first_name, last_name, email, password,  age} = req.body;

    try {
        const existinUser = await userModel.findOne({email: email});
        if (existinUser) {
            return res.status(400).send({error: "El correo electronico ya esta registrado"});
        };

        const newUser = await userModel.create({first_name, last_name, email, password: createHash(password), age});
        // req.session.login = true;
        req.session.user = {...newUser._doc};
        res.status(200).send({message: "La solicitud ha tenido éxito y se ha creado un nuevo usuario"});
    } catch (error) {
        res.status(400).send({ error: "La solicitud no se puede procesar debido a un error de sintaxis por parte del cliente." });
    };
});

module.exports = router;