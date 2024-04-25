const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController();


router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/profile", viewsController.renderProfile);
router.get("/carts/:cid", viewsController.renderCarts);
router.get("/", viewsController.renderIndex);
router.get("/realtimeproducts", viewsController.renderRealtimeproducts);
router.get("/chat", viewsController.renderChat);

module.exports = router;