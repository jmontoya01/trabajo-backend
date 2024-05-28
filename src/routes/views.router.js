const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const checkRole = require("../middleware/checkRole.js");
const viewsController = new ViewsController();


router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/profile",  viewsController.renderProfile);
router.get("/products", checkRole(["user", "premium"]), viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCarts);
router.get("/", viewsController.renderIndex);
router.get("/realtimeproducts", checkRole(["admin", "premium"]), viewsController.renderRealtimeproducts);
router.get("/chat", checkRole(["user"]), viewsController.renderChat);
router.get("/admin", checkRole(['admin']), viewsController.admin)
router.get("/checkout/:coid", checkRole(["user", "premium"]), viewsController.checkout)
router.get("/mockingproducts", checkRole(['admin']), viewsController.mockingproducts);
router.get("/loggertest", viewsController.testLogger);
router.get("/failregister", viewsController.failregister);
router.get("/reset-password", viewsController.renderResetPassword);
router.get("/confirmationmail", viewsController.confirmationmail);
router.get("/password", viewsController.changePassword);










module.exports = router;