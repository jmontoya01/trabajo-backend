const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
const passport = require("passport");



router.post("/", passport.authenticate("register", {failureRedirect: "user/failregister"}), userController.passportRegister);
router.get("/failregister", userController.failregister);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});
router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), userController.githubcallback);
router.post("/requestpasswordreset", userController.requestpasswordreset);
router.post("/reset-password", userController.resetpassword);


module.exports = router;