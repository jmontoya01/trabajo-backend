const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const Response = require("../utils/reusables.js")
const response = new Response();


class UserController {
    async passportRegister(req, res) {
        
        if (!req.user) return response.responseError(res, 400, "Credenciales invalidas");

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role
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
                        role: user.role
                    };
                    if (user.role === "admin") {
                        res.redirect("/admin");
                    } else {
                        res.redirect("/profile");
                    }
                        
                } else {
                    response.responseError(res, 401, "Contraseña no valida");
                }
            } else {
                response.responseError(res, 404, "Usuario no encontrado");
            }

        } catch (error) {
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