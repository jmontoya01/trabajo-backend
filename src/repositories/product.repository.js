const productModel = require("../models/product.model.js");
const logger = require("../utils/logger.js");

class ProductRepository {
    async addProduct({ title, description, price, code, stock, category, thumbnails }) {

        try {

            if (!title || !description || !price || !code || !stock || !category) {
                logger.warning("Todos los campos son obligatorios para continuar");
                return;
            }

            const existProduct = await productModel.findOne({ code: code });

            if (existProduct) {
                logger.warning("El valor de ese code ya existe y no puede repetirse, ingrese otro code")
                return;
            }

            const newProduct = new productModel({
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();
            return newProduct;

        } catch (error) {
            logger.error("Error al agregar producto", error);
            throw new Error("Error al agregar un nuevo producto");
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            };

            const sortOptions = {};
            if (sort) {
                if (sort === "asc" || sort === "desc") {
                    sortOptions.price = sort === "asc" ? 1 : -1;
                };
            };

            const products = await productModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await productModel.countDocuments(queryOptions);
            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };

        } catch (error) {
            logger.error("Error al obtener los productos", error);
            throw new Error("Error al obtener los productos");
        }
    };

    async getProductById(id) {
        try {
            const product = await productModel.findById(id)

            if (!product) {
                logger.warning("Producto no encontrado");
                return 
            };

            logger.info("Producto encontrado con éxito!");
            return product;
        } catch (error) {
            logger.error("Error al buscar el producto con el id", error);
            throw new Error("Error al buscar el producto por id");
        }
    };

    async updateProduct(id, productUpdate) {
        try {
            const productUpdated = await productModel.findByIdAndUpdate(id, productUpdate);
            if (!productUpdated) {
                logger.warning("No se encontro el producto");
            };
            logger.info("Producto actualizado con éxito!");
            return productUpdated;
        } catch (error) {
            logger.error("Error al actualizar el producto", error);
            throw new Error("Error al actualizar el producto");
        };
    };

    async deleteProduct(id) {
        try {
            const deleted = await productModel.findByIdAndDelete(id);;

            if (!deleted) {
                logger.warning("No se encuentra el producto con el id");
            }

            logger.info("Producto eliminado con éxito!");
            return deleted;
        } catch (error) {
            logger.error("Error al eliminar el producto", error);
            throw new Error("Error al eliminar el producto");
        };
    };
};

module.exports = ProductRepository;