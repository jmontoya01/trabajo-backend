const productModel = require("../models/product.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const Response = require("../utils/reusables.js")
const response = new Response();
const CustomError = require("../utils/errors/custom-error.js");
const { productNotFoundMessage } = require("../utils/errors/info.js");
const { Errors } = require("../utils/errors/enums.js");
const logger = require("../utils/logger.js");

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
            res.json(products)
        } catch (error) {
            logger.error("Error al obtener productos", error);
            response.responseError(res, 500, "Error interno del servidor");
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
            res.json(product);

        } catch (error) {
            logger.error("Error al obtener el producto con el id: ", error);
            response.responseError(res, 500, "Error al obtener el producto con el id");
        };
    };

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const result = await productRepository.addProduct(newProduct);
            if (!result) {
                logger.warning("Error al agregar el producto");
                response.responseError(res, 400, "Error al agregar el producto");
            }
            logger.info("Producto agregado exitosamente");
            res.json(result);
        } catch (error) {
            logger.error("Error al agregar el producto", error);
            response.responseError(res, 500, "Error al agregar el producto");
        };
    };

    async updateProduct(req, res) {
        const productId = req.params.pid;
        const updateProduct = req.body;
        try {
            const product = await productModel.findOne({_id:productId});
            if (!product) {
                logger.warning("Producto no encontrado");
                return response.responseMessage(res, 404, "Producto no encontrado")
            }
            const productUpdate = await productRepository.updateProduct(product, updateProduct);
            logger.info("Producto actualizado con éxito");
            res.json(productUpdate);
        } catch (error) {
            logger.error("Error al actualizar el producto con el id", error);
            response.responseError(res, 404, "No existe un producto con ese ID, por favor envíe un ID válido");
        };
    };

    async deleteProduct(req, res) {
        const productId = req.params.pid;
        try {
            const product = await productModel.findOne({_id:productId});
            if (!product) {
                logger.warning("Producto no encontrado");
                return response.responseMessage(res, 404, "Producto no encontrado")
            }
            let productDelete = await productRepository.deleteProduct(product);
            if (productDelete) {
                response.responseSucess(res, 200, "La solicitud ha tenido éxito y se ha eliminado el recurso como resultado");
            }
        } catch (error) {
            logger.error("Error al eliminar el producto", error);
            response.responseError(res, 404, "No existe un producto con ese ID, por favor envíe un ID válido");
        };
    }
};

module.exports = ProductController;