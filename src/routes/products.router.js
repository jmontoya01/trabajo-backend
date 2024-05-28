const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/products.controller.js");
const productController = new ProductController();
const checkRole = require("../middleware/checkRole.js");

router.use(checkRole(['admin', 'premium']));

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post("/", productController.addProduct);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct)

module.exports = router;
