const productModel = require("../models/product.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const CustomError = require("../utils/errors/custom-error.js");
const { productNotFoundMessage } = require("../utils/errors/info.js");
const { Errors } = require("../utils/errors/enums.js");
const logger = require("../utils/logger.js");
const { sendPremiumSoldProduct } = require("../utils/email.js");
const { error } = require("winston");

class ProductController {
    async getProducts(req, res) {
        try {
            let { limit = 20, page = 1, sort, query } = req.query;
            const products = await productRepository.getProducts({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query,
            });
            res.status(200).json(products);
        } catch (error) {
            logger.error("Error al obtener los productos", error);
            res.status(500).send({ message: "Error al obtener los productos" });
        };

    };

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const product = await productRepository.getProductById(id);
            if (!product) {
                throw CustomError.createError({
                    name: "ID Inválido de producto",
                    cause: productNotFoundMessage(id),
                    message: "El ID enviado no es correcto",
                    code: Errors.PRODUCT_NOT_FOUND
                })
            }
            res.status(200).json(product);

        } catch (error) {
            logger.error("Error al obtener el producto con el id: ", error);
            res.status(500).send({ message: "Error al obtener el producto con el id" });
        };
    };

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const result = await productRepository.addProduct(newProduct);
            if (!result) {
                logger.warning("Error al agregar el producto");
                return res.status(400).send({ message: "Error al agregar el producto" });
            }
            logger.info("Producto agregado exitosamente");
            res.status(201).json(result);
        } catch (error) {
            logger.error("Error al agregar el producto", error);
            res.status(500).send({ message: "Error al agregar el producto" });
        };
    };

    async updateProduct(req, res) {
        const productId = req.params.pid;
        const updateProduct = req.body;
        try {
            const product = await productModel.findOne({ _id: productId });
            if (!product) {
                logger.warning("Producto no encontrado");
                return res.status(404).send({ error: "Producto no encontrado" });
            }
            const productUpdate = await productRepository.updateProduct(product, updateProduct);
            logger.info("Producto actualizado con éxito");
            res.status(200).send(productUpdate);
        } catch (error) {
            logger.error("Error al actualizar el producto con el id", error);
            res.status(400).send({ message: "No existe producto con ese id, por favor ingrese un id valido" });
        };
    };

    async deleteProduct(req, res) {
        const productId = req.params.pid;
        try {
            const product = await productModel.findOne({ _id: productId });
            if (!product) {
                logger.warning("Producto no encontrado");
                return res.status(404).send({ error: "Producto no encontrado" });
            }

            // Obtener el usuario dueño del producto
            const owner = await userModel.findOne({ email: product.owner });
            if (owner && owner.role === 'premium') {
                // Enviar correo al usuario premium
                await sendPremiumSoldProduct(owner)
            }

            let productDelete = await productRepository.deleteProduct(product);
            if (productDelete) {
                res.status(200).send({ message: "La solicitud ha tenido éxito y se ha eliminado el recurso como resultado" });
            }
        } catch (error) {
            logger.error("Error al eliminar el producto", error);
            res.status(404).send({ message: "No existe un producto con ese ID, por favor envíe un ID válido" });
        };
    }
};

module.exports = ProductController;