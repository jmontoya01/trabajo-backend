const express = require("express");
const router = express.Router();
// const userModel = require("../models/user.model.js"); estos pasaron a ../config/passport.config.js
// const {createHash} = require("../utils/hashBcrypt.js");estos pasaron a ../config/passport.config.js
const passport = require("passport");

// router.post ("/", async (req, res) => {
//     const {first_name, last_name, email, password,  age} = req.body;

//     try {
//         const existinUser = await userModel.findOne({email: email});
//         if (existinUser) {
//             return res.status(400).send({error: "El correo electronico ya esta registrado"});
//         };

//         const newUser = await userModel.create({first_name, last_name, email, password: createHash(password), age});
//         // req.session.login = true;
//         req.session.user = {...newUser._doc};
//         res.status(200).send({message: "La solicitud ha tenido éxito y se ha creado un nuevo usuario"});
//     } catch (error) {
//         res.status(400).send({ error: "La solicitud no se puede procesar debido a un error de sintaxis por parte del cliente." });
//     };
// });



// =================Passport=======================
router.post("/", passport.authenticate("register", {
    failureRedirect: "/failregister"
}), async (req, res) => {
    if (!req.user) return res.status(400).send({status: "error", message: "Credenciales invalidas"});

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    };
    req.session.login = true;
    res.redirect("/profile");
});

router.get("/failregister", (req, res) => {
    res.send({error: "Registro fallido"})
});

module.exports = router;