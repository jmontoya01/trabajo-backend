const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager();


//rutas

//limit 
router.get("/", async (req, res) => {
    try {
        const {limit = 10, page = 1, sort, query} = req.query;
        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });
        res.json({
            status: "success",
            payload: "products",
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
        })
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({status: "error", error: "Error interno del servidor"});
    }
});


//get products by id
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.json({error: "Producto no encontrado"});
        } 
        res.json(product);

    } catch (error) {
        console.error("Error al obtener el producto con el id", error);
        res.status(500).json({status: "error", error: "Error interno del servidor"});
    }
});

//add new product
router.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({message: " La solicitud ha tenido éxito y se ha creado un nuevo recurso como resultado"});
    } catch (error) {
        console.error("Error al crear el producto", error);
        res.status(500).json({status: "error", error: "Error interno del servidor"});
    };
});

//update for id
router.put("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const updateProduct = req.body;

    try {
        await productManager.updateProduct(productId, updateProduct);
        res.status(200).json({message: "La solicitud ha tenido éxito y se ha actualizado el recurso como resultado"})
    } catch (error) {
        console.error("Error al actualizar el producto con el id", error);
        res.status(500).json({status: "error", error: "Error interno del servidor"});
    };
});

//delete product
router.delete("/:pid", async (req, res) => {
    const productId = req.params.pid;

    try {
        await productManager.deleteProduct(productId);
        res.status(200).json({message: "La solicitud ha tenido éxito y se ha eliminado el recurso como resultado"});
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        res.status(500).json({status: "error", error: "Error interno del servidor"});
    };
})

module.exports = router;
