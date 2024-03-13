const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");


//rutas
router.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        limit ? res.json(products.slice(0, limit)) : res.json(products);
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});

router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.json({error: "Producto no encontrado"});
        } 
        res.json(product);
    } catch (error) {
        console.error("Error al obtener el producto", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});

module.exports = router;
