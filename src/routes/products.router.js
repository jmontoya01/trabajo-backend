const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productModel = require("../models/product.model.js");
const productManager = new ProductManager();
const response = require("../utils/reusables.js");


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
        response(res, 500, "Error interno del servidor");
        // res.status(500).json({status: "error", error: "Error interno del servidor"});
    }
});


//get products by id
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(id);
        if (!product) {
            return response(res, 404, "Producto no encontrado");
            // return res.status(404).send({error: "Producto no encontrado"});
        } 
        res.json(product);

    } catch (error) {
        console.error("Error al obtener el producto con el id", error);
        response(res, 500, "Error interno del servidor");
        // res.status(500).json({status: "error", error: "Error interno del servidor"});
    }
});

//add new product
router.post("/", async (req, res) => {
    const newProduct = req.body;
    const {title, description, price, code, stock, category} = newProduct;
    try {
        if (!title || !description || !price ||!code ||!stock || !category) {
            response(res, 400, "Todos los campos son obligatorios");
            // res.status(400).send({message: "Todos los campos son obligatorios"});
            return
        };
        const product = await productModel.findOne({code: code});
        if (product) {
            response(res, 400, "El valor de ese code ya existe y no puede repetirse, ingrese otro code");
            // res.status(400).send({ message: "El valor de ese code ya existe y no puede repetirse, ingrese otro code"})
        } else {
            await productManager.addProduct(newProduct);
            response(res, 201, "Producto agregado exitosamente");
            // res.status(201).json({message: "Producto agregado exitosamente"});
        }
        
    } catch (error) {
        console.error("Error al crear el producto", error);
        response(res, 500, "Error interno del servidor");
        // res.status(500).json({status: "error", error: "Error interno del servidor"});
    };
});

//update for id
router.put("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const updateProduct = req.body;

    try {
        const productUpdate = await productManager.updateProduct(productId, updateProduct);
        if (!productUpdate) {
            response(res, 404, "El producto que desea actualizar no existe en la base de datos");
            // res.status(404).send({message: "El producto que desea actualizar no existe en la base de datos"});
        } else {
            response(res, 200, "La solicitud ha tenido éxito y se ha actualizado el recurso como resultado");
            // res.status(200).json({message: "La solicitud ha tenido éxito y se ha actualizado el recurso como resultado"});
        }
    } catch (error) {
        console.error("Error al actualizar el producto con el id", error);
        response(res, 500, "Error interno del servidor");
        // res.status(500).json({status: "error", error: "Error interno del servidor"});
    };
});

//delete product
router.delete("/:pid", async (req, res) => {
    const productId = req.params.pid;

    try {
        await productManager.deleteProduct(productId);
        response(res, 200, "La solicitud ha tenido éxito y se ha eliminado el recurso como resultado")
        // res.status(200).json({message: "La solicitud ha tenido éxito y se ha eliminado el recurso como resultado"});
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        response(res, 500, "Error interno del servidor");
        // res.status(500).json({status: "error", error: "Error interno del servidor"}); Fede cual cree q es mejor de estos dos: el de arriba o este???
    };
})

module.exports = router;
