const passport = require("passport");
const local = require("passport-local");

const userModel = require("../models/user.model.js");
const {createHash, isValidPassword} = require("../utils/hashBcrypt.js");

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;

        try {
            let user = await userModel.findOne({email: username});
            if (user) {
                console.log("Usuario no encontrado")
                return done(null, false);
            } 

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role
            };

            let result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done("Error al obtener el usuario" + error);
        };
    }));

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({email});
            if(user) {
                console.log("Usuario no encontrado");
                return done(null, false);
            };
            if(!isValidPassword(password, user)) return done(null, false);
            return(null, user)
        } catch (error) {
            return done(error);
        };
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({_id: id})
        done(null, user);
    });
};

module.exports = initializePassport
