const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productModel = require("../models/product.model.js");
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
            payload: products,
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
            return res.status(404).send({error: "Producto no encontrado"});
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
    const {title, description, price, code, stock, category} = newProduct;
    try {
        if (!title || !description || !price ||!code ||!stock || !category) {
            res.status(400).send({message: "Todos los campos son obligatorios"});
            return
        };
        const product = await productModel.findOne({code: code});
        if (product) {
            res.status(400).send({ message: "El valor de ese code ya existe y no puede repetirse, ingrese otro code"})
        } else {
            await productManager.addProduct(newProduct);
            res.status(201).json({message: "Producto agregado exitosamente"});
        }
        
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
        const productUpdate = await productManager.updateProduct(productId, updateProduct);
        if (!productUpdate) {
            res.status(404).send({message: "El producto que desea actualizar no existe en la base de datos"});
        } else {
            res.status(200).json({message: "La solicitud ha tenido éxito y se ha actualizado el recurso como resultado"});
        }
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
