const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const Response = require("../utils/reusables.js")
const response = new Response();
const CustomError = require("../utils/errors/custom-error.js");
const { credentialsMessage } = require("../utils/errors/info.js");
const { Errors } = require("../utils/errors/enums.js");
const logger = require("../utils/logger.js");



class UserController {
    async passportRegister(req, res) {
        
        if (!req.user) return response.responseError(res, 400, "Credenciales invalidas");

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart
        };
        req.session.login = true;
        res.redirect("/login");
    };

    failregister(req, res) {
        res.send({ error: "Registro fallido" })
    };

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await UserModel.findOne({email});
            
            if (user) {
                if (isValidPassword(password, user)) {
                    req.session.login = true;
                    req.session.user = {
                        email: user.email,
                        age: user.age,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        role: user.role,
                        cart: user.cart
                    };
                    if (user.role === "admin") {
                        res.redirect("/admin");
                    } else {
                        res.redirect("/login");
                    }
                        
                } else {
                    throw CustomError.createError({
                        name: "Login de usuario fallido",
                        cause: credentialsMessage(),
                        message: "Error de credenciales",
                        code: Errors.INVALID_CREDENTIALS
                    })
                }
            } else {
                logger.warning("Usuario no encontrado")
                response.responseError(res, 404, "Usuario no encontrado");
            }

        } catch (error) {
            logger.error("Error en el login", error)
            response.responseError(res, 400, "Error en el login");
        };
    };

    async logout(req, res) {
        if (req.session.login) {
            req.session.destroy();
        };
        res.redirect("/login");
    };

    async githubcallback(req, res) {
        req.session.user = req.user;
        req.session.login = true;
        res.redirect("/profile");
    }
};

module.exports = UserController;