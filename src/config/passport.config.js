const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2");
const userModel = require("../models/user.model.js");
const cartModel = require("../models/cart.model.js");
const {createHash, isValidPassword} = require("../utils/hashBcrypt.js");

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.61d5fb251b69614b",
        clientSecret: "a4eba4fe7c42de7c69ad05b9de0e5a4f804acf5e",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            let user = await userModel.findOne({email: profile._json.email});
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
                };
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body;

        try {
            let user = await userModel.findOne({email: username});
            if (user) {
                console.log("El usuario ya esta registrado")
                return done(null, false);
            } 

            const newCart = new cartModel();
            await newCart.save()

            let newUser = {
                first_name,
                last_name,
                email,
                cart: newCart._id,
                password: createHash(password),
                age
            };

            let result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done("Error al obtener el usuario " + error);
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
