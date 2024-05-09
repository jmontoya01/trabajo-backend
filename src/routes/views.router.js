const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const checkRole = require("../middleware/checkRole.js");
const viewsController = new ViewsController();


router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/profile",  viewsController.renderProfile);
router.get("/products", checkRole(["user"]), viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCarts);
router.get("/", viewsController.renderIndex);
router.get("/realtimeproducts", checkRole(["admin"]), viewsController.renderRealtimeproducts);
router.get("/chat", checkRole(["user"]), viewsController.renderChat);
router.get("/admin", checkRole(['admin']), viewsController.admin)






module.exports = router;