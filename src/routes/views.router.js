const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const checkRole = require("../middleware/checkRole.js");
const passport = require("passport");
const viewsController = new ViewsController();


router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/profile",  viewsController.renderProfile);
router.get("/products", viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCarts);
router.get("/", viewsController.renderIndex);
router.get("/realtimeproducts", viewsController.renderRealtimeproducts);
router.get("/chat",  viewsController.renderChat);
router.get("/admin",  viewsController.admin)


module.exports = router;