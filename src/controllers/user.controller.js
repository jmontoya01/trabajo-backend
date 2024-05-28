const UserModel = require("../models/user.model.js");
const { isValidPassword, createHash } = require("../utils/hashBcrypt.js");
const Response = require("../utils/reusables.js")
const response = new Response();
const CustomError = require("../utils/errors/custom-error.js");
const { credentialsMessage } = require("../utils/errors/info.js");
const { Errors } = require("../utils/errors/enums.js");
const logger = require("../utils/logger.js");
const generateToken = require("../utils/resetToken.js");
const { sendResetMail } = require("../utils/email.js")



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
            const user = await UserModel.findOne({ email });

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
    };

    async requestpasswordreset(req, res) {
        const { email } = req.body;
        try {
            const user = await UserModel.findOne({ email });//buscamos el usuario en la base de datos
            if (!user) {
                logger.warning("Usuario no encontrado");//validamos que si este
                response.responseError(res, 400, "Usuario no encontrado")
            }

            const token = generateToken(); //creamos en utils funcion para generar token y la importamos
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) //le damos al token una expiracion de una hora
            };
            await user.save(); //guardamos el token en user
            await sendResetMail(email, user.first_name, token); //enviamos correo electronico con el enlace de restablecimiento
            res.redirect("/confirmationmail");
        } catch (error) {
            logger.error("Error al intentar restablecer la contraseña", error);
            response.responseError(res, 400, "Error al intentar restablecer la contraseña");
        }
    };

    async resetpassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                logger.warning("Usuario no encontrado");//buscamos usuario y verificamos que si este en la BD
                return res.render("changepassword", { error: "Usuario no encontrado" });
            };
            const resetToken = user.resetToken;//obtenemos el token de restablecimiento y lo validamos

            if (!resetToken || resetToken.token !== token) {
                return res.render("resetpassword", { error: "El token de restablecimiento de contraseña no es valido" });
            }

            const now = new Date();
            if (now > resetToken.expiresAt) {//verificamos si el token a expirado
                return res.redirect("/changepassword"); //si expiro redirigimos a la pagina para crear otro
            }

            if (isValidPassword(password, user)) {//verificamos si la contraseña es igual a la anterior
                return res.render("changepassword", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            user.password = createHash(password);//actualizamos contraseña del usuario
            user.resetToken = undefined; //marcamos token como utilizado
            await user.save();//guardamos los cambios
            return res.redirect("/login"); //redirigimos al login

        } catch (error) {
            logger.error("Error al intentar cambiar la contraseña", error);
            response.responseError(res, 400, "Error al intentar cambiar la contraseña");
        }
    };

    async changeRolPremium(req, res) {
        try {
            const { uid } = req.params;
            const user = await UserModel.findById(uid);

            if (!user) {
                response.responseError(res, 404, "Usuario no encontrado");
            }

            const newRol = user.role === 'user' ? 'premium' : 'user';
            const updateRol = await UserModel.findByIdAndUpdate(uid, { role: newRol }, { new: true });
            res.json(updateRol)
        } catch (error) {
            logger.error("Error al intentar cambiar el rol", error);
            response.responseError(res, 400, "Error al intentar cambiar el rol");
        }
    }


};

module.exports = UserController;