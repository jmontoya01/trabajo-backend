const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const Response = require("../utils/reusables.js")
const response = new Response();

class ProductController {
    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;
            const products = await productRepository.getProducts({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query,
            });
            res.json(products)
        } catch (error) {
            console.error("Error al obtener productos", error);
            response.responseError(res, 500, "Error interno del servidor");
        };
        
    };

    async getProductById(req, res) {
        const id = req.params.pid;
        try {
            const product = await productRepository.getProductById(id);
            if (!product) {
                return response.responseError(res, 404, "Producto no encontrado");
            }
            res.json(product);

        } catch (error) {
            console.error("Error al obtener el producto con el id", error);
            response.responseError(res, 500, "Error al obtener el producto con el id");
        };
    };

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const result = await productRepository.addProduct(newProduct);
            if (!result) {
                response.responseError(res, 400, "El valor de ese code ya existe y no puede repetirse, ingrese otro code");
            }
            console.log("Producto agregado exitosamente");
            res.json(result);
        } catch (error) {
            console.error("Error al crear el producto", error);
            response.responseError(res, 500, "Error interno del servidor");
        };
    };

    async updateProduct(req, res) {
        try {
            const id = req.params.pid;
            const updateProduct = req.body;

            const productUpdate = await productRepository.updateProduct(id, updateProduct);
            console.log("Producto actualizado con éxito");
            res.json(productUpdate);
        } catch (error) {
            console.error("Error al actualizar el producto con el id", error);
            response.responseError(res, 500, "Error interno del servidor");
        };
    };

    async deleteProduct(req, res) {
        const id = req.params.pid;

        try {
            let productDelete = await productRepository.deleteProduct(id);
            if (productDelete) {
                response.responseSucess(res, 200, "La solicitud ha tenido éxito y se ha eliminado el recurso como resultado");
            }
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            response.responseError(res, 500, "Error interno del servidor");
        };
    }
};

module.exports = ProductController;