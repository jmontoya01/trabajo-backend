const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (user) {
            //uso isValidPassword para verificar el pass: 
            //if (user.password === password) {
            if (isValidPassword(password, user)) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    age: user.age,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                };

                res.redirect("/profile");
            } else {
                res.status(401).send({ error: "Contraseña no valida" });
            }
        } else {
            res.status(404).send({ error: "Usuario no encontrado" });
        }

    } catch (error) {
        res.status(400).send({ error: "Error en el login" });
    }
})

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    };
    res.redirect("/login");
});

router.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
});

module.exports = router;